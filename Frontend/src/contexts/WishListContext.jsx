
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { api } from '../Service/Axios';
import { toast } from 'react-toastify';

const WishListContext = createContext();

function WishListProvider({ children }) {
  const { user } = useAuth();
  const [wishList, setWishList] = useState([]);
  const [countWishlist,setCountWishlist]=useState(0);
  // Fetch wishlist
  const fetchWishList = async () => {
    
    try {
      const res = await api.get(`/wishlist`);
      
      const data=res.data.WishlistData;

      if(data?.items){
        const formattedData=data.items.map((item)=>({...item.product}))
        
        setWishList(formattedData);
        setCountWishlist(formattedData.length);
      } else{
         setWishList([]);
         setCountWishlist(0)
              }
    } catch (e) {
      console.error("Error while fetching wishlist", e);
      setWishList([]);
      setCountWishlist(0)
    }
  };

  useEffect(() => {
    if(user){
      fetchWishList()
    }else{
    setWishList([]);
    setCountWishlist(0);
    } 
  }, [user]);


  

  const toggleWishList = async (product) => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }
    try{
      const response=await api.patch(`/wishlist/${product._id}`);
      await fetchWishList();

      toast.success(response.data.Message); 

    }catch(err){
      toast.error(err.response?.data?.Message || "Wishlist error")
 }

    
};

  

  
  const isInWishList = (productId) => {
    return wishList.some((item) => item._id === productId);
  };

  

  return (
    <WishListContext.Provider
      value={{ 
        wishList, 
        toggleWishList,
         countWishlist,
        isInWishList,
      
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