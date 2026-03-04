import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const CartIcon = () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
    </svg>
);

const UserIcon = () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const MenuIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const CloseIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => {
        logout();
        setUserMenuOpen(false);
        navigate('/');
    };

    const navLinks = [
        { label: 'Running', to: '/products?categoryId=1' },
        { label: 'Basketball', to: '/products?categoryId=2' },
        { label: 'Lifestyle', to: '/products?categoryId=3' },
        { label: 'Training', to: '/products?categoryId=4' },
        { label: 'Sale', to: '/products?onSale=true' },
    ];

    return (
        <>
            <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
                <div className="navbar__inner">
                    {/* Logo */}
                    <Link to="/" className="navbar__logo">
                        <span className="navbar__logo-mark">S</span>
                        <span className="navbar__logo-text">STRIDE</span>
                    </Link>

                    {/* Desktop Nav */}
                    <ul className="navbar__links">
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <Link to={link.to} className="navbar__link">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Actions */}
                    <div className="navbar__actions">
                        <Link to="/cart" className="navbar__icon-btn" aria-label="Cart">
                            <CartIcon />
                            {cartCount > 0 && <span className="navbar__cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>}
                        </Link>

                        <div className="navbar__user-wrapper">
                            <button
                                className="navbar__icon-btn"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                aria-label="User menu"
                            >
                                <UserIcon />
                            </button>

                            {userMenuOpen && (
                                <div className="navbar__dropdown">
                                    {isAuthenticated ? (
                                        <>
                                            <div className="navbar__dropdown-header">
                                                <span className="navbar__dropdown-name">{user?.name}</span>
                                                <span className="navbar__dropdown-email">{user?.email}</span>
                                            </div>
                                            <div className="navbar__dropdown-divider" />
                                            <Link to="/profile" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>
                                                My Orders
                                            </Link>
                                            <button className="navbar__dropdown-item navbar__dropdown-item--logout" onClick={handleLogout}>
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>Sign In</Link>
                                            <Link to="/register" className="navbar__dropdown-item" onClick={() => setUserMenuOpen(false)}>Create Account</Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile toggle */}
                        <button className="navbar__mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
                            {menuOpen ? <CloseIcon /> : <MenuIcon />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`navbar__mobile-menu ${menuOpen ? 'navbar__mobile-menu--open' : ''}`}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            to={link.to}
                            className="navbar__mobile-link"
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="navbar__mobile-divider" />
                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>My Orders</Link>
                            <button className="navbar__mobile-link" onClick={() => { handleLogout(); setMenuOpen(false); }}>Sign Out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
                            <Link to="/register" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>Create Account</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Overlay for dropdown/mobile */}
            {(userMenuOpen || menuOpen) && (
                <div className="navbar__overlay" onClick={() => { setUserMenuOpen(false); setMenuOpen(false); }} />
            )}
        </>
    );
};

export default Navbar;
