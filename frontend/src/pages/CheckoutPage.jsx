import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../api';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, fetchCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);
    const [form, setForm] = useState({
        shippingName: '', shippingAddress: '', shippingCity: '',
        shippingState: '', shippingZip: '', shippingPhone: '',
    });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await orderApi.placeOrder(form);
            setSuccess(data);
            await fetchCart();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="page checkout-success">
                <div className="container checkout-success__inner">
                    <div className="checkout-success__icon">✓</div>
                    <h1 className="heading-md">Order Confirmed!</h1>
                    <p>Your order <strong>#{success.orderId}</strong> has been placed successfully.</p>
                    <p>We'll send a confirmation email shortly.</p>
                    <div className="checkout-success__total">
                        Total: <strong>${Number(success.totalAmount).toFixed(2)}</strong>
                    </div>
                    <div className="checkout-success__actions">
                        <button className="btn btn-primary" onClick={() => navigate('/profile')}>View Orders</button>
                        <button className="btn btn-outline" onClick={() => navigate('/')}>Back to Home</button>
                    </div>
                </div>
            </div>
        );
    }

    const shipping = Number(cart?.subtotal || 0) >= 150 ? 0 : 12;
    const total = Number(cart?.subtotal || 0) + shipping;

    return (
        <div className="page checkout-page">
            <div className="container">
                <h1 className="heading-lg checkout-page__title">Checkout</h1>

                <div className="checkout-page__layout">
                    {/* Form */}
                    <form className="checkout-form" onSubmit={handleSubmit}>
                        <div className="checkout-form__section">
                            <h2 className="checkout-form__section-title">Shipping Information</h2>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input className="form-input" name="shippingName" value={form.shippingName} onChange={handleChange} placeholder="John Doe" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input className="form-input" name="shippingPhone" value={form.shippingPhone} onChange={handleChange} placeholder="+1 234 567 8900" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Street Address</label>
                                <input className="form-input" name="shippingAddress" value={form.shippingAddress} onChange={handleChange} placeholder="123 Main Street, Apt 4B" required />
                            </div>
                            <div className="checkout-form__row">
                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input className="form-input" name="shippingCity" value={form.shippingCity} onChange={handleChange} placeholder="New York" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">State</label>
                                    <input className="form-input" name="shippingState" value={form.shippingState} onChange={handleChange} placeholder="NY" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">ZIP Code</label>
                                    <input className="form-input" name="shippingZip" value={form.shippingZip} onChange={handleChange} placeholder="10001" required />
                                </div>
                            </div>
                        </div>

                        <div className="checkout-form__section">
                            <h2 className="checkout-form__section-title">Payment</h2>
                            <div className="checkout-payment-placeholder">
                                <div className="checkout-payment-placeholder__icon">💳</div>
                                <p>Secure simulated checkout — no real payment required</p>
                                <div className="checkout-form__mock-card">
                                    <input className="form-input" placeholder="1234 5678 9012 3456" readOnly />
                                    <div className="checkout-form__row">
                                        <input className="form-input" placeholder="MM/YY" readOnly />
                                        <input className="form-input" placeholder="CVV" readOnly />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && <div className="checkout-error">{error}</div>}

                        <button type="submit" className="btn btn-primary btn--full" disabled={loading || !cart?.items?.length}>
                            {loading ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
                        </button>
                    </form>

                    {/* Summary */}
                    <div className="checkout-summary">
                        <h2 className="cart-summary__title">Order Summary</h2>
                        <div className="checkout-summary__items">
                            {cart?.items?.map((item) => {
                                const price = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
                                return (
                                    <div key={item.cartItemId} className="checkout-summary__item">
                                        <img src={item.productImage} alt={item.productName} />
                                        <div>
                                            <p className="checkout-summary__item-name">{item.productName}</p>
                                            <p className="checkout-summary__item-meta">
                                                Qty: {item.quantity}{item.selectedSize ? ` · Size ${item.selectedSize}` : ''}
                                            </p>
                                        </div>
                                        <span>${(Number(price) * item.quantity).toFixed(2)}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="divider" />
                        <div className="cart-summary__rows">
                            <div className="cart-summary__row">
                                <span>Subtotal</span><span>${Number(cart?.subtotal || 0).toFixed(2)}</span>
                            </div>
                            <div className="cart-summary__row">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? <span className="cart-summary__free">FREE</span> : `$${shipping.toFixed(2)}`}</span>
                            </div>
                        </div>
                        <div className="divider" />
                        <div className="cart-summary__total">
                            <span>Total</span><span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
