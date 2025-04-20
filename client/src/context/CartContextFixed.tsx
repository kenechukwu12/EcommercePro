import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "@shared/schema";

interface CartItemWithProduct extends Omit<CartItem, "product"> {
  product: Product;
}

interface CartContextType {
  cart: CartItemWithProduct[];
  isCartOpen: boolean;
  addToCart: (item: { productId: number; quantity: number; product: Product; color?: string; size?: string }) => void;
  updateCartItem: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  calculateTotal: () => number;
}

// Create a context with a default value that matches the shape of CartContextType
// but with empty/noop implementations
const defaultContextValue: CartContextType = {
  cart: [],
  isCartOpen: false,
  addToCart: () => {},
  updateCartItem: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  toggleCart: () => {},
  calculateTotal: () => 0
};

// Create the context with the default value
const CartContext = createContext<CartContextType>(defaultContextValue);

const LOCAL_STORAGE_KEY = "shopease-cart";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItemWithProduct[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartId, setCartId] = useState(1); // Local cart item ID counter

  // Load cart from localStorage on initial mount
  useEffect(() => {
    const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        // Find the highest ID in the saved cart to continue ID sequence
        const maxId = Math.max(...parsedCart.map((item: CartItemWithProduct) => item.id), 0);
        setCartId(maxId + 1);
      } catch (err) {
        console.error("Error parsing saved cart", err);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const addToCart = (item: { productId: number; quantity: number; product: Product; color?: string; size?: string }) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.productId === item.productId &&
                    cartItem.color === item.color &&
                    cartItem.size === item.size
      );

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + item.quantity
        };
        return updatedCart;
      } else {
        // Add new item
        const newItem: CartItemWithProduct = {
          id: cartId,
          userId: 1, // Default user ID for non-authenticated users
          productId: item.productId,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          product: item.product
        };
        setCartId(prevId => prevId + 1);
        return [...prevCart, newItem];
      }
    });
  };

  const updateCartItem = (id: number, quantity: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.product.discountedPrice || item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };

  // Create the context value object
  const contextValue: CartContextType = {
    cart, 
    isCartOpen, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart, 
    toggleCart,
    calculateTotal
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  // We now don't need this check since we provided a default value
  // but we'll keep it for debugging purposes
  if (context === defaultContextValue) {
    console.warn("useCart() was called outside of CartProvider. Make sure your components are wrapped in CartProvider.");
  }
  
  return context;
};