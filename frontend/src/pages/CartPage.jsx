import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const EmptyCart = () => (
    <div className="cart-empty">
        <span>🛒</span>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
    </div>
);

const CartPage = () => {
    const { cart, updateItem, removeItem, loading } = useCart();
    const navigate = useNavigate();

    const shipping = cart?.subtotal >= 150 ? 0 : 12;
    const total = ((cart?.subtotal || 0) + shipping);

    if (!cart?.items?.length) return <div className="page"><div className="container"><EmptyCart /></div></div>;

    return (
        <div className="page cart-page">
            <div className="container">
                <div className="cart-page__header">
                    <h1 className="heading-lg">Your Cart</h1>
                    <span className="cart-page__count">{cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''}</span>
                </div>

                <div className="cart-page__layout">
                    {/* Items */}
                    <div className="cart-items">
                        {cart.items.map((item) => {
                            const effectivePrice = item.salePrice && item.salePrice > 0 && item.salePrice < item.price
                                ? item.salePrice : item.price;
                            return (
                                <div key={item.cartItemId} className="cart-item">
                                    <Link to={`/products/${item.productId}`} className="cart-item__image-link">
                                        <img src={item.productImage} alt={item.productName} className="cart-item__image" />
                                    </Link>
                                    <div className="cart-item__info">
                                        <span className="cart-item__brand">{item.productBrand}</span>
                                        <Link to={`/products/${item.productId}`} className="cart-item__name">
                                            {item.productName}
                                        </Link>
                                        <div className="cart-item__options">
                                            {item.selectedSize && <span>Size: US {item.selectedSize}</span>}
                                            {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                                        </div>
                                        <div className="cart-item__bottom">
                                            <div className="cart-item__qty">
                                                <button onClick={() => updateItem(item.cartItemId, item.quantity - 1)} disabled={loading}>−</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateItem(item.cartItemId, item.quantity + 1)} disabled={loading || item.quantity >= item.stock}>+</button>
                                            </div>
                                            <span className="cart-item__price">${(Number(effectivePrice) * item.quantity).toFixed(2)}</span>
                                            <button className="cart-item__remove" onClick={() => removeItem(item.cartItemId)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary */}
                    <div className="cart-summary">
                        <h2 className="cart-summary__title">Order Summary</h2>
                        <div className="cart-summary__rows">
                            <div className="cart-summary__row">
                                <span>Subtotal</span>
                                <span>${Number(cart.subtotal).toFixed(2)}</span>
                            </div>
                            <div className="cart-summary__row">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? <span className="cart-summary__free">FREE</span> : `$${shipping.toFixed(2)}`}</span>
                            </div>
                            {shipping > 0 && (
                                <p className="cart-summary__shipping-note">
                                    Add ${(150 - Number(cart.subtotal)).toFixed(2)} more for free shipping
                                </p>
                            )}
                        </div>
                        <div className="divider" />
                        <div className="cart-summary__total">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button
                            className="btn btn-primary btn--full"
                            onClick={() => navigate('/checkout')}
                        >
                            Proceed to Checkout →
                        </button>
                        <Link to="/products" className="btn btn-ghost btn--full" style={{ marginTop: 12, textAlign: 'center' }}>
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
