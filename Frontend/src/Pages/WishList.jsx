// Wishlist.jsx
import React from "react";
import { useWishList } from "../contexts/WishListContext";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeftIcon, TrashIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { AiFillHeart } from "react-icons/ai";

function Wishlist() {
  const { wishList, toggleWishList } = useWishList();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const continueShopping = () => navigate("/products");

  const handleMoveToCart = async(product) => {
    try{
    await addToCart(product);
    await toggleWishList(product);
    }catch(e){
      toast.error("Failed to move to cart")
    }
  
  };

  // If user not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <AiFillHeart className="text-6xl text-red-500 mb-4" />
        <h2 className="text-2xl font-light text-gray-600">Please login to view your wishlist</h2>
        <Link
          to="/login"
          className="mt-6 px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all"
        >
          Login
        </Link>
      </div>
    );
  }

  // If wishlist empty
  if (wishList.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <AiFillHeart className="text-6xl text-gray-300 mb-4" />
        <h2 className="text-2xl font-light text-gray-600">Your wishlist is empty</h2>
        <button
          onClick={continueShopping}
          className="mt-6 px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // Wishlist items
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back
          </button>

        
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishList.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden group hover:shadow-xl transition-all"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={item.image_url[0].url}
                  alt={item.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-all duration-300"
                />

                <button
                  onClick={() => toggleWishList(item)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:bg-gray-100"
                >
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </button>
              </div>

              {/* Details */}
              <div className="p-5">
                <h3 className="text-lg font-light mb-2 line-clamp-2">{item.name}</h3>

                <p className="text-xl font-semibold">₹{item.salePrice || item.original_price}</p>

                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 flex items-center gap-2"
                  >
                    <ShoppingCartIcon className="w-4 h-4" /> Move to Cart
                  </button>

                  <button
                    onClick={() => navigate(`/details/${item._id}`)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <button
            onClick={continueShopping}
            className="px-8 py-3 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-all"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
}

export default Wishlist;
