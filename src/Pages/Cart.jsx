import React from "react";
import { useCart } from "../contexts/CartContext";
import { ArrowLeftIcon, TrashIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Cart() {
  const { items, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const continueShopping=()=>{
    navigate("/")
  }


  if (items.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="text-center space-y-6">
          <div className="text-6xl">🛒</div>
          <h2 className="text-2xl font-light text-gray-600">Your cart is empty</h2>
          <button
            onClick={continueShopping}
            className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
          >
            <div className="p-2 rounded-lg border border-gray-200 group-hover:border-black group-hover:bg-black group-hover:text-white transition-all">
              <ArrowLeftIcon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Back</span>
          </button>
          
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-light">Shopping Cart</h1>
            <span className="text-gray-500 font-medium">{items.length} items</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Luxury Styling */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => {
              const itemTotal = item.original_price * item.quantity;
              const discountPrice = Math.round(
                item.original_price - (item.original_price * item.discount_percentage) / 100
              );
              const discountTotal = discountPrice * item.quantity;

              return (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="relative">
                      <img
                        src={item.image_url}
                        className="w-32 h-32 object-cover rounded-xl"
                        alt={item.name}
                      />
                      {item.discount_percentage > 0 && (
                        <div className="absolute -top-2 -left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          -{item.discount_percentage}%
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h2 className="text-xl font-light text-gray-900 mb-2">{item.name}</h2>
                          <p className="text-gray-500 font-medium">{item.ml}ml</p>
                        </div>
                        <div className="text-right">
                          {item.discount_percentage > 0 ? (
                            <>
                              <p className="text-2xl font-light">₹{discountTotal}</p>
                              <p className="text-gray-400 line-through">₹{itemTotal}</p>
                            </>
                          ) : (
                            <p className="text-2xl font-light">₹{itemTotal}</p>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-white rounded transition-colors"
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-white rounded transition-colors"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                            <span className="text-sm">Remove</span>
                          </button>
                        </div>

                        {item.discount_percentage > 0 && (
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              ₹{discountPrice} each
                            </p>
                            <p className="text-xs text-gray-400 line-through">
                              ₹{item.original_price} each
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary - Luxury Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-8">
              <h2 className="text-2xl font-light mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{getCartTotal()}</span>
                </div>
                
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-light">Total</span>
                  <span className="text-3xl font-light">₹{getCartTotal()}</span>
                </div>

                <button
                  disabled={!user}
                  className={`w-full py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                    !user
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-900 hover:shadow-xl"
                  }`}
                  onClick={() => {
                    if (!user) return;
                    navigate("/payment");
                  }}
                >
                  {user ? "Proceed to Checkout" : "Login to Checkout"}
                </button>

                <div className="mt-6 text-center text-sm text-gray-500 space-y-2">
                 
                  <p>30-day return policy</p>
                  <p>Secure checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <button
            onClick={continueShopping}
            className="px-8 py-3 border-2 border-black text-black font-medium rounded-lg hover:bg-black hover:text-white transition-all duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;