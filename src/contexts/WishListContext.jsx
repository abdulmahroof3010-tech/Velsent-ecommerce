
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { api } from '../Service/Axios';
import { toast } from 'react-toastify';

const WishListContext = createContext();

function WishListProvider({ children }) {
  const { user } = useAuth();
  const [wishList, setWishList] = useState([]);

  // Fetch wishlist
  const fetchWishList = async (userId) => {
    if (!userId) return;
    try {
      const res = await api.get(`/users/${userId}`);
      setWishList(res.data.wishList || []);
    } catch (e) {
      console.error("Error while fetching wishlist", e);
    }
  };

  useEffect(() => {
    if (user?.id) fetchWishList(user.id);
    else setWishList([]);
  }, [user]);

  // ADD to wishlist
  const addWishList = async (product) => {
    if (!user) {
      toast.warn("Please login first");
      return;
    }

    // Check if product already exists in wishlist
    if (wishList.some((item) => item.id === product.id)) {
      toast.warn("Already in wishlist");
      return;
    }

    const updatedWishList = [...wishList, product];
    setWishList(updatedWishList);

    try {
      await api.patch(`/users/${user.id}`, { wishList: updatedWishList });
      toast.success("Added to wishlist!");
    } catch (e) {
      console.log("addWish patch error:", e);
      setWishList(wishList);
      toast.error("Failed to add to wishlist");
    }
  };

  // REMOVE from wishlist
  const removeFromWishList = async (productId) => {
    const updated = wishList.filter((item) => item.id !== productId);
    setWishList(updated);

    try {
      await api.patch(`/users/${user.id}`, { wishList: updated });
    } catch (e) {
      console.log("RemoveWishList patch error:", e);
      // Revert on error
      setWishList(wishList);
    }
  };

  // TOGGLE wishlist
  const toggleWishList = async (product) => {
    if (!user) {
      toast.warn("Please login to add to wishlist");
      return;
    }

    const exists = wishList.some((item) => item.id === product.id);

    if (exists) {
      await removeFromWishList(product.id);
      toast.success("Removed from wishlist!");
    } else {
      await addWishList(product);
    }
  };

  // Clear wishlist
  const clearWishList = async () => {
    setWishList([]);
    try {
      if (user?.id) {
        await api.patch(`/users/${user.id}`, { wishList: [] });
      }
      toast.success("Wishlist cleared!");
    } catch (e) {
      console.log("Clear wishlist error:", e);
    }
  };

  // Check if product is in wishlist
  const isInWishList = (productId) => {
    return wishList.some((item) => item.id === productId);
  };

  // Get wishlist count
  const getWishListCount = () => {
    return wishList.length;
  };

  return (
    <WishListContext.Provider
      value={{ 
        wishList, 
        addWishList, 
        removeFromWishList, 
        toggleWishList,
        clearWishList,
        isInWishList,
        getWishListCount
      }}
    >
      {children}
    </WishListContext.Provider>
  );
}

export const useWishList = () => {
  const context = useContext(WishListContext);
  if (!context) {
    throw new Error("useWishList must be used within a WishListProvider");
  }
  return context;
};

export default WishListProvider;