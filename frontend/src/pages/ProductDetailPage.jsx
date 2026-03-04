import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productApi } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetailPage.css';

const StarIcon = ({ filled }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#d4af37' : 'none'} stroke="#d4af37" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, loading: cartLoading } = useCart();
    const { isAuthenticated } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        productApi.getById(id)
            .then(({ data }) => {
                setProduct(data);
                if (data.colors) setSelectedColor(data.colors.split(',')[0].trim());
            })
            .catch(() => navigate('/products'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="page loader"><div className="spinner" /></div>;
    if (!product) return null;

    const images = [product.imageUrl, product.imageUrl2, product.imageUrl3].filter(Boolean);
    const sizes = product.sizes ? product.sizes.split(',').map(s => s.trim()) : [];
    const colors = product.colors ? product.colors.split(',').map(c => c.trim()) : [];
    const isOnSale = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
    const effectivePrice = isOnSale ? product.salePrice : product.price;

    const handleAddToCart = async () => {
        if (sizes.length > 0 && !selectedSize) {
            setError('Please select a size');
            return;
        }
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        setError('');
        const result = await addToCart(product.id, quantity, selectedSize, selectedColor);
        if (result.success) {
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2500);
        } else {
            setError(result.message);
        }
    };

    const colorMap = {
        white: '#ffffff', black: '#111111', red: '#ff2d20', blue: '#3b82f6',
        grey: '#888888', gray: '#888888', gold: '#d4af37', orange: '#f97316',
        green: '#22c55e', 'neon green': '#39ff14', teal: '#14b8a6', navy: '#1e3a5f',
        beige: '#e8d5b7', cream: '#f5f0e8', multi: 'linear-gradient(135deg, #ff2d20, #3b82f6, #22c55e)',
    };

    return (
        <div className="page product-detail">
            <div className="container">
                <div className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/products">Products</Link>
                    <span>/</span>
                    <Link to={`/products?categoryId=${product.categoryId}`}>{product.categoryName}</Link>
                    <span>/</span>
                    <span>{product.name}</span>
                </div>

                <div className="product-detail__layout">
                    {/* Images */}
                    <div className="product-detail__images">
                        <div className="product-detail__thumbnails">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    className={`product-detail__thumb ${i === activeImage ? 'product-detail__thumb--active' : ''}`}
                                    onClick={() => setActiveImage(i)}
                                >
                                    <img src={img} alt={`View ${i + 1}`} />
                                </button>
                            ))}
                        </div>
                        <div className="product-detail__main-image">
                            {isOnSale && (
                                <span className="product-detail__sale-badge">
                                    -{Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                                </span>
                            )}
                            <img src={images[activeImage]} alt={product.name} />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="product-detail__info">
                        <span className="product-detail__brand">{product.brand}</span>
                        <h1 className="product-detail__name heading-md">{product.name}</h1>

                        {/* Rating (static) */}
                        <div className="product-detail__rating">
                            {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} filled={i <= 4} />)}
                            <span>(128 reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="product-detail__pricing">
                            <span className="product-detail__price">${Number(effectivePrice).toFixed(2)}</span>
                            {isOnSale && (
                                <span className="product-detail__original">${Number(product.price).toFixed(2)}</span>
                            )}
                        </div>

                        <div className="divider" />
                        <p className="product-detail__description">{product.description}</p>
                        <div className="divider" />

                        {/* Colors */}
                        {colors.length > 0 && (
                            <div className="product-detail__option">
                                <div className="product-detail__option-header">
                                    <span className="label">Color</span>
                                    <span className="product-detail__option-selected">{selectedColor}</span>
                                </div>
                                <div className="product-detail__color-options">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            className={`product-detail__color-btn ${selectedColor === color ? 'product-detail__color-btn--active' : ''}`}
                                            onClick={() => setSelectedColor(color)}
                                            title={color}
                                            style={{ background: colorMap[color.toLowerCase()] || '#888' }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes */}
                        {sizes.length > 0 && (
                            <div className="product-detail__option">
                                <div className="product-detail__option-header">
                                    <span className="label">Size</span>
                                    {selectedSize && <span className="product-detail__option-selected">US {selectedSize}</span>}
                                </div>
                                <div className="product-detail__size-options">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            className={`product-detail__size-btn ${selectedSize === size ? 'product-detail__size-btn--active' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                                <a href="#" className="product-detail__size-guide">Size Guide →</a>
                            </div>
                        )}

                        {/* Quantity + Add */}
                        <div className="product-detail__actions">
                            <div className="product-detail__quantity">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                            </div>
                            <button
                                className={`btn btn-primary product-detail__add-btn ${addedToCart ? 'product-detail__add-btn--success' : ''}`}
                                onClick={handleAddToCart}
                                disabled={cartLoading || product.stock === 0}
                            >
                                {product.stock === 0 ? 'Out of Stock' : addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
                            </button>
                        </div>

                        {error && <p className="product-detail__error">{error}</p>}

                        <div className="product-detail__meta">
                            <span className={`product-detail__stock ${product.stock < 10 ? 'product-detail__stock--low' : ''}`}>
                                {product.stock === 0 ? '✗ Out of Stock'
                                    : product.stock < 10 ? `⚡ Only ${product.stock} left!`
                                        : `✓ In Stock`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
