import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productApi, categoryApi } from '../api';
import ProductCard from '../components/ui/ProductCard';
import './HomePage.css';

const Toast = ({ message, onClose }) => (
    <div className="toast toast-success">
        <span>✓</span>
        <div>
            <strong>Added to cart!</strong>
            <p>{message}</p>
        </div>
        <button onClick={onClose} className="toast-close">✕</button>
    </div>
);

/* ---- Hero Slides ---- */
const HERO_SLIDES = [
    {
        id: 1,
        tag: 'NEW DROPS 2024',
        title: 'AIR\nPHANTOM\nPRO',
        subtitle: 'Carbon Fiber Technology. Unlimited Potential.',
        cta: 'Shop Running',
        link: '/products?categoryId=1',
        gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #2a1010 100%)',
        accent: '#ff2d20',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80',
    },
    {
        id: 2,
        tag: 'COURT COLLECTION',
        title: 'COURT\nKING\nHIGH',
        subtitle: 'Dominate Every Possession.',
        cta: 'Shop Basketball',
        link: '/products?categoryId=2',
        gradient: 'linear-gradient(135deg, #0a0a0a 0%, #0a0a1a 50%, #101028 100%)',
        accent: '#3b82f6',
        image: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=1200&q=80',
    },
    {
        id: 3,
        tag: 'LIFESTYLE SERIES',
        title: 'URBAN\nCLASSIC\nONE',
        subtitle: 'Timeless. Refined. Effortless.',
        cta: 'Shop Lifestyle',
        link: '/products?categoryId=3',
        gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a0a 50%, #1f1f10 100%)',
        accent: '#d4af37',
        image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1200&q=80',
    },
];

const HeroSlider = () => {
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();
    const slide = HERO_SLIDES[current];

    useEffect(() => {
        const interval = setInterval(() => setCurrent((c) => (c + 1) % HERO_SLIDES.length), 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="hero" style={{ background: slide.gradient }}>
            <div className="hero__image-wrapper" key={slide.id}>
                <img src={slide.image} alt={slide.title} className="hero__image" />
                <div className="hero__gradient-overlay" />
            </div>

            <div className="container hero__content" key={`content-${slide.id}`}>
                <span className="hero__tag" style={{ color: slide.accent }}>{slide.tag}</span>
                <h1 className="hero__title heading-xl" style={{ whiteSpace: 'pre-line' }}>
                    {slide.title}
                </h1>
                <p className="hero__subtitle">{slide.subtitle}</p>
                <div className="hero__cta-group">
                    <button className="btn btn-primary" onClick={() => navigate(slide.link)}>
                        {slide.cta}
                    </button>
                    <button className="btn btn-outline" onClick={() => navigate('/products')}>
                        All Products
                    </button>
                </div>
            </div>

            {/* Slide indicators */}
            <div className="hero__dots">
                {HERO_SLIDES.map((_, i) => (
                    <button
                        key={i}
                        className={`hero__dot ${i === current ? 'hero__dot--active' : ''}`}
                        onClick={() => setCurrent(i)}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>

            {/* Slide number */}
            <div className="hero__counter">
                <span className="hero__counter-current">{String(current + 1).padStart(2, '0')}</span>
                <span className="hero__counter-sep">/</span>
                <span className="hero__counter-total">{String(HERO_SLIDES.length).padStart(2, '0')}</span>
            </div>
        </section>
    );
};

/* ---- Ticker ---- */
const Ticker = () => {
    const items = ['FREE SHIPPING OVER $150', 'NEW COLLECTION 2024', 'EASY 30-DAY RETURNS', 'AUTHENTIC PRODUCT GUARANTEE', 'MEMBERS GET EXCLUSIVE DROPS'];
    return (
        <div className="ticker">
            <div className="ticker__track">
                {[...items, ...items].map((item, i) => (
                    <span key={i} className="ticker__item">{item} <span className="ticker__separator">✦</span></span>
                ))}
            </div>
        </div>
    );
};

/* ---- Category Grid ---- */
const CATEGORIES = [
    { id: 1, name: 'Running', image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80' },
    { id: 2, name: 'Basketball', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80' },
    { id: 3, name: 'Lifestyle', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80' },
    { id: 4, name: 'Training', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80' },
];

const CategoryGrid = () => (
    <section className="section section--sm">
        <div className="container">
            <div className="section-header">
                <div>
                    <span className="label">Browse</span>
                    <h2 className="heading-lg">Shop by Category</h2>
                </div>
                <Link to="/products" className="btn btn-ghost btn--sm">View All</Link>
            </div>
            <div className="category-grid">
                {CATEGORIES.map((cat) => (
                    <Link key={cat.id} to={`/products?categoryId=${cat.id}`} className="category-item">
                        <div className="category-item__image-wrapper">
                            <img src={cat.image} alt={cat.name} className="category-item__image" loading="lazy" />
                            <div className="category-item__overlay" />
                        </div>
                        <div className="category-item__label">
                            <h3>{cat.name}</h3>
                            <span>Shop Now →</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </section>
);

/* ---- Home Page ---- */
const HomePage = () => {
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        productApi.getFeatured()
            .then(({ data }) => setFeatured(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const showToast = (name) => {
        setToast(name);
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="page" style={{ paddingTop: 0 }}>
            <HeroSlider />
            <Ticker />

            {/* Featured */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <span className="label">Handpicked</span>
                            <h2 className="heading-lg">Featured Products</h2>
                        </div>
                        <Link to="/products" className="btn btn-ghost btn--sm">View All →</Link>
                    </div>
                    {loading ? (
                        <div className="loader"><div className="spinner" /></div>
                    ) : (
                        <div className="products-grid">
                            {featured.slice(0, 8).map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddedToCart={showToast}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Promo Banner */}
            <section className="promo-banner">
                <div className="container promo-banner__inner">
                    <div>
                        <span className="label">Limited Time</span>
                        <h2 className="heading-md promo-banner__title">MEMBERS ONLY<br />EXCLUSIVE DROP</h2>
                        <p>Sign up for free and unlock early access to exclusive releases, member pricing, and personalized picks.</p>
                    </div>
                    <div className="promo-banner__cta">
                        <Link to="/register" className="btn btn-primary">Join for Free</Link>
                        <Link to="/login" className="btn btn-outline">Sign In</Link>
                    </div>
                </div>
            </section>

            <CategoryGrid />

            {/* Value Props */}
            <section className="value-props section--sm">
                <div className="container">
                    <div className="value-props__grid">
                        {[
                            { icon: '🚚', title: 'Free Shipping', desc: 'On all orders over $150' },
                            { icon: '↩', title: '30-Day Returns', desc: 'Hassle-free returns' },
                            { icon: '🔒', title: 'Secure Checkout', desc: '256-bit SSL encryption' },
                            { icon: '🏆', title: 'Authentic Guarantee', desc: '100% genuine products' },
                        ].map((item) => (
                            <div key={item.title} className="value-prop">
                                <span className="value-prop__icon">{item.icon}</span>
                                <h4>{item.title}</h4>
                                <p>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
    );
};

export default HomePage;
