import React from 'react';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';
import { useWishList } from '../contexts/WishListContext.jsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../contexts/AuthContext.jsx';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const {user } =useAuth();
  const { addToCart } = useCart();
  const { toggleWishList, wishList } = useWishList();


 

  const detailPage = () => {
    navigate(`/details/${product._id}`);
  };

  // Check if product is in wishlist using correct property name
  const isWished = wishList.some((item) => item._id === product._id);

    const handleAddToCart=()=>{
      addToCart(product)
    }

  return (
    <div className="bg-white py-5 relative">
      
      {/* IMAGE CONTAINER - clickable */}
      <div
        onClick={detailPage}
        className="group block w-full rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-gray-100 relative cursor-pointer"
      >
        <div className="overflow-hidden aspect-[3/4]">
          <img
            src={product.image_url[0].url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
          />
        </div>

        {/* Wishlist Button - Shows filled heart only when in wishlist */}
        <button
          className="absolute top-2 right-2 p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all"
          onClick={(e) => {
            e.stopPropagation();
           
            if (!user) {
              toast.error('Please login to add to wishlist', {
                position: "top-right",
                autoClose: 3000,
              });
             
              return;
            }
            toggleWishList(product);
          }}
          title={isWished ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWished ? (
            // Show filled heart when product is in wishlist
            <AiFillHeart className="w-4 h-4 text-red-500" />
          ) : (
            // Show outlined heart when product is NOT in wishlist
            <AiOutlineHeart className="w-4 h-4 text-gray-700" />
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-2 sm:p-3 space-y-1">
        <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2">
          {product.name}
        </h3>
<div className="flex items-center gap-2">

        <p className="text-sm sm:text-base font-semibold text-gray-900">₹{product.salePrice}</p>
        <p className="text-xs text-gray-400 line-through">₹{product.original_price}</p>
</div>

        <span className="mt-1 inline-block text-xs font-medium text-green-600">
          {product.discount}% off
        </span>

        <p className="font-light text-gray-900 mt-2">{product.ml}ml</p>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-2 py-1.5 text-xs sm:text-sm flex items-center justify-center gap-1 bg-black text-white rounded-md"
        >
          <FiShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;