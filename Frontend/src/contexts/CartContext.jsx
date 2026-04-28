
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../Service/Axios";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const CartContext = createContext();

function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [count,setCount]=useState(0);
  const [total,setTotal]=useState(0);
 

 
  useEffect(() => {

    if(user){
      loadUserCart();
    }else{
      setItems([]);
      setCount(0);
    }

  },[user])


  // Load user's cart from database
  const loadUserCart = async () => {
   
    
    try {
      setIsLoading(true);
      const response = await api.get(`/cart`);
      const cartData = response.data.cartData;
      
      if ( cartData?.items) {
          const formttedItem=cartData.items.map((item)=>({
            ...item.product,
            quantity:item.quantity,
            price:item.price
          }))
             setItems(formttedItem);
             setCount(response.data.count);
             setTotal(response.data.total);
      } else {
        setItems([]);
      }
    
    } catch (err) {
      console.error("Cart load error:", err);
      setItems([]);
      setCount(0);
      setTotal(0)
    } finally {
      setIsLoading(false);
    }
  };


  const addToCart = async(product) => {
    if(!user){
      toast.error("Please login to add items to cart",{
          position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      return
    }

    try{
      const response=await api.post(`/cart/add/${product._id}`);
      await loadUserCart();
      toast.success(response.data.Message ,{
        position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      })
    }catch(err){
      if(err.response?.status===409){
        toast.error(err.response?.data?.Message || "Failed to add to cart")
      }
  }
  }

  const removeFromCart =async (productId) => {
    try{
      const response=await api.patch(`/cart/remove/${productId}`);
      await loadUserCart();
      toast.success(response.data.Message)
    }catch(err){
      toast.error(err.response?.data?.Message ||"failed to remove item")

    }
   
  };


  const increaseQuantity=async(productId)=>{
    try{
      const response= await api.patch(`/cart/increase/${productId}`);
      await loadUserCart();
      
    }catch(e){
      toast.error(e.response?.data?.Message ||"Cannot increase quantity")
    }
  }

  const decreaseQuantity=async(productId)=>{
    try{
      const response= await api.patch(`/cart/decrease/${productId}`);
      await loadUserCart();

    }catch(e){
      toast.error(e.response?.data.Message || "Cannot decrease Quantity")
    }
  }


  
  const values = {
    items,
    count,
    total,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
   
    loadUserCart,
     isLoading,

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