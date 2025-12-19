
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../Service/Axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const CartContext = createContext();

function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [buyNowProduct, setBuyNowProduct] = useState(null);

  // Load cart when user changes
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        await loadUserCartFromDB();
      } else {
        const guestCart = localStorage.getItem("guest_cart");
        if (guestCart) {
          try {
            setItems(JSON.parse(guestCart));
          } catch (e) {
            console.error("Failed to load guest cart", e);
            setItems([]);
          }
        } else {
          setItems([]);
        }
      }
    };

    loadCart();
  }, [user]);

  // Load user's cart from database
  const loadUserCartFromDB = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await api.get(`/users/${user.id}`);
      const userData = response.data;
      
      if (userData.cart && Array.isArray(userData.cart)) {
        setItems(userData.cart);
      } else {
        setItems([]);
      }
      
      // Clear any guest cart from localStorage when user logs in
      localStorage.removeItem("guest_cart");
    } catch (error) {
      console.error("Error loading user cart:", error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save cart to database (for logged-in users) or localStorage (for guests)
  const saveCart = async (cartItems) => {
    if (user) {
      // Save to user's data in database
      try {
        await api.patch(`/users/${user.id}`, { cart: cartItems });
      } catch (error) {
        console.error("Error saving cart to server:", error);
      }
    } else {
      // Save to localStorage for guest users (use different key)
      localStorage.setItem("guest_cart", JSON.stringify(cartItems));
    }
  };

  const addToCart = (product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      let newItems;

      if (existingItem) {
        newItems = prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prevItems, { ...product, quantity }];
      }

      // Save the updated cart
      saveCart(newItems);
      return newItems;
    });
    
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (productId) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== productId);
      saveCart(newItems);
      return newItems;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      saveCart(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setItems([]);
    if (user) {
      
      try {
        api.patch(`/users/${user.id}`, { cart: [] });
      } catch (error) {
        console.error("Error clearing cart from server:", error);
      }
    } else {
  
      localStorage.removeItem("guest_cart");
    }
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => {
      const salePrice = Math.round(
        item.original_price -
          (item.original_price * item.discount_percentage) / 100
      );
      return total + salePrice * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const values = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    isLoading,
     buyNowProduct, 
  setBuyNowProduct,
  };

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartProvider;