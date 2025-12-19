import React from 'react';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';
import { useWishList } from '../contexts/WishListContext.jsx';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishList, wishList } = useWishList();

  const salePrice = Math.round(
    product.original_price -
    (product.original_price * product.discount_percentage) / 100
  );

  const detailPage = () => {
    navigate(`/details/${product.id}`);
  };

  // Check if product is in wishlist using correct property name
  const isWished = wishList.some((item) => item.id === product.id);

  return (
    <div className="bg-white py-5 relative">
      
      {/* IMAGE CONTAINER - clickable */}
      <div
        onClick={detailPage}
        className="group block w-full rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-gray-100 relative cursor-pointer"
      >
        <div className="overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-auto object-cover rounded-t-xl group-hover:scale-105 transition-all duration-300"
          />
        </div>

        {/* Wishlist Button - Shows filled heart only when in wishlist */}
        <button
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all"
          onClick={(e) => {
            e.stopPropagation(); 
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
      <div className="p-4">
        <h3 className="text-base font-medium text-gray-900 group-hover:text-black">
          {product.name}
        </h3>

        <p className="text-lg font-semibold text-gray-900 mt-2">₹{salePrice}</p>
        <p className="text-sm text-gray-500 line-through">₹{product.original_price}</p>

        <span className="mt-1 inline-block text-xs font-medium text-green-600">
          {product.discount_percentage}% off
        </span>

        <p className="font-light text-gray-900 mt-2">{product.ml}ml</p>

        {/* Add to Cart */}
        <button
          onClick={() => addToCart(product)}
          className="w-full mt-4 py-2 flex items-center justify-center gap-2 bg-black text-white text-sm rounded-lg hover:bg-gray-900 transition-all"
        >
          <FiShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;