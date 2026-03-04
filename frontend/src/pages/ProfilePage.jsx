import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderApi } from '../api';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const STATUS_COLORS = {
    PENDING: '#f59e0b',
    CONFIRMED: '#3b82f6',
    SHIPPED: '#8b5cf6',
    DELIVERED: '#22c55e',
    CANCELLED: '#ff2d20',
};

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        orderApi.getOrders()
            .then(({ data }) => setOrders(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="page profile-page">
            <div className="container">
                <div className="profile-page__layout">
                    {/* Sidebar */}
                    <aside className="profile-sidebar">
                        <div className="profile-sidebar__card">
                            <div className="profile-sidebar__avatar">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="profile-sidebar__name">{user?.name}</h2>
                            <p className="profile-sidebar__email">{user?.email}</p>
                            <span className="profile-sidebar__badge">{user?.role}</span>
                        </div>
                        <nav className="profile-sidebar__nav">
                            <button className="profile-nav-item profile-nav-item--active">My Orders</button>
                            <Link to="/products" className="profile-nav-item">Shop Now</Link>
                            <button className="profile-nav-item profile-nav-item--logout" onClick={handleLogout}>
                                Sign Out
                            </button>
                        </nav>
                    </aside>

                    {/* Content */}
                    <div className="profile-content">
                        <h1 className="heading-md profile-content__title">My Orders</h1>

                        {loading ? (
                            <div className="loader"><div className="spinner" /></div>
                        ) : orders.length === 0 ? (
                            <div className="profile-empty">
                                <span>📦</span>
                                <h3>No orders yet</h3>
                                <p>Time to treat yourself!</p>
                                <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {orders.map((order) => (
                                    <div key={order.orderId} className="order-card">
                                        <div
                                            className="order-card__header"
                                            onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
                                        >
                                            <div className="order-card__meta">
                                                <span className="order-card__id">Order #{order.orderId}</span>
                                                <span className="order-card__date">
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="order-card__right">
                                                <span
                                                    className="order-card__status"
                                                    style={{ color: STATUS_COLORS[order.status] || '#fff' }}
                                                >
                                                    {order.status}
                                                </span>
                                                <span className="order-card__total">${Number(order.totalAmount).toFixed(2)}</span>
                                                <span className="order-card__toggle">{expandedOrder === order.orderId ? '▲' : '▼'}</span>
                                            </div>
                                        </div>

                                        {expandedOrder === order.orderId && (
                                            <div className="order-card__body">
                                                <div className="order-card__items">
                                                    {order.items.map((item, i) => (
                                                        <div key={i} className="order-item">
                                                            <img src={item.productImage} alt={item.productName} />
                                                            <div>
                                                                <p className="order-item__name">{item.productName}</p>
                                                                <p className="order-item__meta">
                                                                    Qty: {item.quantity}
                                                                    {item.selectedSize ? ` · Size ${item.selectedSize}` : ''}
                                                                    {item.selectedColor ? ` · ${item.selectedColor}` : ''}
                                                                </p>
                                                            </div>
                                                            <span className="order-item__price">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="order-card__shipping">
                                                    <p className="label" style={{ marginBottom: 8 }}>Shipping To</p>
                                                    <p>{order.shippingName}</p>
                                                    <p>{order.shippingAddress}, {order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
