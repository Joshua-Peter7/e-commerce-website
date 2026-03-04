import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__top">
                    {/* Brand */}
                    <div className="footer__brand">
                        <Link to="/" className="footer__logo">
                            <span className="footer__logo-mark">S</span>
                            <span>STRIDE</span>
                        </Link>
                        <p className="footer__tagline">Engineered for performance.<br />Designed for life.</p>
                        <div className="footer__socials">
                            {['Instagram', 'Twitter', 'Facebook', 'YouTube'].map((s) => (
                                <a key={s} href="#" className="footer__social" aria-label={s}>
                                    {s[0]}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="footer__col">
                        <h4 className="footer__col-title">Shop</h4>
                        <ul>
                            <li><Link to="/products?categoryId=1">Running</Link></li>
                            <li><Link to="/products?categoryId=2">Basketball</Link></li>
                            <li><Link to="/products?categoryId=3">Lifestyle</Link></li>
                            <li><Link to="/products?categoryId=4">Training</Link></li>
                            <li><Link to="/products?onSale=true">Sale</Link></li>
                        </ul>
                    </div>

                    <div className="footer__col">
                        <h4 className="footer__col-title">Help</h4>
                        <ul>
                            <li><a href="#">Size Guide</a></li>
                            <li><a href="#">Shipping & Returns</a></li>
                            <li><a href="#">Order Tracking</a></li>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Contact Us</a></li>
                        </ul>
                    </div>

                    <div className="footer__col">
                        <h4 className="footer__col-title">Company</h4>
                        <ul>
                            <li><a href="#">About Stride</a></li>
                            <li><a href="#">Sustainability</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Press</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p>© {year} Stride Store. All rights reserved.</p>
                    <div className="footer__legal">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Cookie Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
