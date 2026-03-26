import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

const CartContext = createContext({});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Initialize cart from local storage only once on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('relicsphere_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Persist cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('relicsphere_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        toast({
          title: "Cart Updated",
          description: `Updated quantity for ${product.name}`,
        });
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      toast({
        title: "Added to Cart",
        description: `${product.name} added to your cart.`,
      });
      return [...prevCart, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    toast({
      title: "Removed",
      description: "Item removed from cart.",
    });
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem('relicsphere_cart');
  }, []);

  // Memoize totals to prevent recalculation on every render
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const value = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal: () => cartTotal, // Keeping function signature for compatibility
    getCartCount: () => cartCount  // Keeping function signature for compatibility
  }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};