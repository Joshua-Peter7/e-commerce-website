import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState({ items: [], subtotal: 0, totalItems: 0 });
    const [loading, setLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCart({ items: [], subtotal: 0, totalItems: 0 });
            return;
        }
        try {
            const { data } = await cartApi.getCart();
            setCart(data);
        } catch {
            // Silently fail — user will see empty cart
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, quantity = 1, selectedSize, selectedColor) => {
        setLoading(true);
        try {
            const { data } = await cartApi.addItem({ productId, quantity, selectedSize, selectedColor });
            setCart(data);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to add to cart' };
        } finally {
            setLoading(false);
        }
    };

    const updateItem = async (itemId, quantity) => {
        try {
            const { data } = await cartApi.updateItem(itemId, { quantity });
            setCart(data);
        } catch (err) {
            console.error('Update item error:', err);
        }
    };

    const removeItem = async (itemId) => {
        try {
            const { data } = await cartApi.removeItem(itemId);
            setCart(data);
        } catch (err) {
            console.error('Remove item error:', err);
        }
    };

    const cartCount = cart?.totalItems ?? 0;

    return (
        <CartContext.Provider value={{ cart, loading, cartCount, addToCart, updateItem, removeItem, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};
