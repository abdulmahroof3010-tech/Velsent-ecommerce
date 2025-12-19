import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import useFetch from "../hooks/useFetch";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

function DetailsPage() {
  const { productid } = useParams();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, setBuyNowProduct } = useCart(); // Add removeFromCart and setBuyNowProduct
  const { user } = useAuth();
  const datas = useFetch("products");

  // Get single product
  const product = datas.find((item) => item.id === productid);

  // Handle Buy Now
  const handleBuyNow = () => {
    if (!user) {
      toast.warn("Please login to continue");
      return;
    }
    
    // Remove this product from cart if it exists
    removeFromCart(product.id);
    
    // Set this as Buy Now product (not in cart)
    setBuyNowProduct({ ...product, quantity: 1 });
    
    // Navigate to payment page
    navigate("/payment");
  };

  // ✔ If product not found
  if (!product) {
    return <p className="p-6 text-center text-gray-500">Product not found.</p>;
  }

  // ✔ If product is inactive
  if (!product.isActive) {
    return (
      <p className="p-6 text-center text-gray-500">
        Product is not available.
      </p>
    );
  }

  // ✔ sale price
  const salePrice = Math.round(
    product.original_price -
      (product.original_price * product.discount_percentage) / 100
  );

  // ✔ add to cart
  const addingToCart = () => addToCart(product);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 relative">

      {/* Back Button */}
      <div className="absolute left-4 top-4 z-10">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-300"
        >
          <div className="p-2 rounded-lg border border-gray-200 group-hover:border-black group-hover:bg-black group-hover:text-white transition-all duration-300">
            <ArrowLeftIcon className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Back to Collection</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto">

        {/* Product Details */}
        <div key={product.id} className="space-y-8">

          {/* Product Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8">

            {/* Image Section */}
            <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-xl overflow-hidden flex items-center justify-center p-6">
              <div className="absolute inset-0 opacity-[0.03] bg-grid-pattern"></div>
              
              <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-auto h-full max-h-full object-contain transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* Info Section */}
            <div className="p-4 lg:p-6 flex flex-col justify-between">
              <div className="space-y-6">

                {/* Title */}
                <div>
                  <h1 className="text-3xl lg:text-4xl font-light text-gray-900 mb-3">
                    {product.name}
                  </h1>
                  <div className="w-12 h-0.5 bg-gray-300 mb-4"></div>

                  <p className="text-gray-600 font-medium">
                    {product.ml}ml • Eau de Parfum
                  </p>
                </div>

                {/* Price */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-baseline gap-3">
                    <p className="text-4xl font-normal text-gray-900">
                      ₹{salePrice}
                    </p>
                    <div>
                      <p className="text-lg text-gray-500 line-through">
                        ₹{product.original_price}
                      </p>
                      <span className="inline-block bg-red-50 text-red-600 text-xs font-semibold px-2 py-1 rounded">
                        Save {product.discount_percentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 uppercase mb-3">
                      Fragrance Notes
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Static Additional Info */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium text-gray-500 uppercase">
                      Intensity
                    </h4>
                    <p className="text-gray-900">Moderate</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium text-gray-500 uppercase">
                      Longevity
                    </h4>
                    <p className="text-gray-900">8-12 Hours</p>
                  </div>
                </div>

              </div>

              {/* Buttons */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <button 
                  onClick={handleBuyNow}
                  className="w-full bg-gray-900 text-white py-3 px-6 text-base font-medium rounded-lg hover:bg-black transition-colors duration-300"
                >
                  Buy Now
                </button>

                <button 
                  onClick={addingToCart}
                  className="w-full bg-white border border-gray-300 text-gray-900 py-3 px-6 text-base font-medium rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all duration-300"
                >
                  Add to Cart
                </button>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Free Shipping • 30-Day Return • Authenticity Guaranteed
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default DetailsPage;