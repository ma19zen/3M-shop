import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as cartAPI from '../api/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);

  const recalcTotal = (items) => items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], totalPrice: 0 }); return; }
    setLoading(true);
    try {
      const res = await cartAPI.getCart();
      setCart(res.data.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await cartAPI.addToCart({ productId, quantity });
    setCart(res.data.data);
  };

  const updateQuantity = async (itemId, newQuantity) => {
    const prevCart = { ...cart, items: [...cart.items] };

    if (newQuantity <= 0) {
      setCart((prev) => {
        const items = prev.items.filter((i) => (i.product?._id || i.product) !== itemId);
        return { ...prev, items, totalPrice: recalcTotal(items) };
      });
    } else {
      setCart((prev) => {
        const items = prev.items.map((i) =>
          (i.product?._id || i.product) === itemId ? { ...i, quantity: newQuantity } : i
        );
        return { ...prev, items, totalPrice: recalcTotal(items) };
      });
    }

    try {
      const res = await cartAPI.updateCartItem(itemId, { quantity: newQuantity });
      setCart(res.data.data);
    } catch (error) {
      setCart(prevCart);
      throw error;
    }
  };

  const removeItem = async (itemId) => {
    const prevCart = { ...cart, items: [...cart.items] };

    setCart((prev) => {
      const items = prev.items.filter((i) => (i.product?._id || i.product) !== itemId);
      return { ...prev, items, totalPrice: recalcTotal(items) };
    });

    try {
      const res = await cartAPI.removeFromCart(itemId);
      setCart(res.data.data);
    } catch (error) {
      setCart(prevCart);
      throw error;
    }
  };

  const clearAll = async () => {
    const prevCart = { ...cart };
    setCart({ items: [], totalPrice: 0 });

    try {
      await cartAPI.clearCart();
    } catch (error) {
      setCart(prevCart);
      throw error;
    }
  };

  const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeItem, clearAll, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
