import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const HeartIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
);

const CartPlusIcon = () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
        <line x1="12" y1="11" x2="12" y2="17" /><line x1="9" y1="14" x2="15" y2="14" />
    </svg>
);

const ProductCard = ({ product, onAddedToCart }) => {
    const { addToCart, loading } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const effectivePrice = product.salePrice && product.salePrice > 0 && product.salePrice < product.price
        ? product.salePrice
        : product.price;

    const isOnSale = product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
    const discountPct = isOnSale
        ? Math.round(((product.price - product.salePrice) / product.price) * 100)
        : 0;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        const result = await addToCart(product.id, 1, null, null);
        if (result.success && onAddedToCart) {
            onAddedToCart(product.name);
        }
    };

    return (
        <Link to={`/products/${product.id}`} className="product-card" aria-label={product.name}>
            <div className="product-card__image-wrapper">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-card__image"
                    loading="lazy"
                />
                {isOnSale && (
                    <span className="product-card__discount">-{discountPct}%</span>
                )}
                {product.featured && !isOnSale && (
                    <span className="product-card__badge">Featured</span>
                )}
                <div className="product-card__actions">
                    <button
                        className="product-card__action-btn product-card__action-btn--cart"
                        onClick={handleAddToCart}
                        disabled={loading || product.stock === 0}
                        aria-label="Add to cart"
                    >
                        <CartPlusIcon />
                        <span>{product.stock === 0 ? 'Sold Out' : 'Add to Cart'}</span>
                    </button>
                    <button className="product-card__action-btn product-card__action-btn--wishlist" aria-label="Wishlist">
                        <HeartIcon />
                    </button>
                </div>
            </div>
            <div className="product-card__info">
                <span className="product-card__brand">{product.brand}</span>
                <h3 className="product-card__name">{product.name}</h3>
                <div className="product-card__pricing">
                    <span className="product-card__price">
                        ${Number(effectivePrice).toFixed(2)}
                    </span>
                    {isOnSale && (
                        <span className="product-card__original-price">
                            ${Number(product.price).toFixed(2)}
                        </span>
                    )}
                </div>
                {product.colors && (
                    <div className="product-card__colors">
                        {product.colors.split(',').slice(0, 4).map((color) => (
                            <span
                                key={color}
                                className="product-card__color-dot"
                                title={color.trim()}
                                style={{
                                    background: color.trim().toLowerCase() === 'white' ? '#fff' :
                                        color.trim().toLowerCase() === 'black' ? '#111' :
                                            color.trim().toLowerCase() === 'red' ? '#ff2d20' :
                                                color.trim().toLowerCase() === 'blue' ? '#3b82f6' :
                                                    color.trim().toLowerCase() === 'grey' || color.trim().toLowerCase() === 'gray' ? '#888' :
                                                        color.trim().toLowerCase() === 'gold' ? '#d4af37' :
                                                            color.trim().toLowerCase() === 'orange' ? '#f97316' :
                                                                color.trim().toLowerCase() === 'green' || color.trim().toLowerCase() === 'neon green' ? '#22c55e' :
                                                                    color.trim().toLowerCase() === 'teal' ? '#14b8a6' :
                                                                        color.trim().toLowerCase() === 'navy' ? '#1e3a5f' :
                                                                            color.trim().toLowerCase() === 'beige' ? '#e8d5b7' :
                                                                                color.trim().toLowerCase() === 'cream' ? '#f5f0e8' : '#888'
                                }}
                            />
                        ))}
                        {product.colors.split(',').length > 4 && (
                            <span className="product-card__color-more">+{product.colors.split(',').length - 4}</span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default ProductCard;
