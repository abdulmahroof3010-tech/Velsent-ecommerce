import React, { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../Service/Axios";
import { toast } from "react-toastify";


function Payment() {
  const [method, setMethod] = useState(""); 
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const { user } = useAuth();

  const location = useLocation();

  const productId = location.state?.productId;
  const quantity = location.state?.quantity || 1;

  const isBuyNow = !!productId;

  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [buyNowLoading, setBuyNowLoading] = useState(false);

  // Address fields
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });

  const { total, loadUserCart, items, isloading } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setBuyNowLoading(true);

      try {
        const res = await api.get(`/products/${productId}`);
        const product = res.data.Product;
        setBuyNowProduct({ ...product, price: product.salePrice });
      } catch (e) {
        console.error("BuyNow fetch error", e);
        toast.error("Failed to load product. Please try again.");
      } finally {
        setBuyNowLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const displayItems = isBuyNow
    ? buyNowProduct
      ? [{ ...buyNowProduct, quantity }]
      : []
    : items;

  const displayTotal = isBuyNow
    ? buyNowProduct
      ? buyNowProduct.salePrice * quantity
      : 0
    : total || 0;

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    // Validation
    if (
      !address.fullName.trim() ||
      !address.phone.trim() ||
      !address.street.trim() ||
      !address.city.trim() ||
      !address.pincode.trim()
    ) {
      toast.warn("Please fill all address fields.");
      return;
    }

    if (!method) {
      toast.warn("Please select a payment method.");
      return;
    }

    if (displayItems.length === 0) {
      toast.warn("No items to order!");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const paymentMethod = method === "online" ? "ONLINE" : "COD";

      const endpoint = isBuyNow ? "/order/single" : "/order/cart";

      const payload = isBuyNow
        ? {
            productId: buyNowProduct._id,
            quantity:Number(quantity),
            address,
            paymentMethod,
          }
        : {
            address,
            paymentMethod,
          };

          console.log("PAYLOAD:", JSON.stringify(payload)); 
           console.log("ENDPOINT:", endpoint);    

      const response = await api.post(endpoint, payload);

      if (paymentMethod === "COD") {
        toast.success(response.data.Message || "Order placed!");
        navigate("/my-orders");

        if (!isBuyNow) await loadUserCart();
        if (isBuyNow) setBuyNowProduct(null);

        return;
      }

      const { razorpayOrder, key } = response.data;

      const options = {
        key: key,
        amount: razorpayOrder.amount,
        currency: "INR",
        order_id: razorpayOrder.id,

        name: "Velsent",
        description: `Order Payment - ₹${displayTotal}`,

        method: {
    upi: true,
    card: true,
    netbanking: true,
    wallet: true
  },

        handler: async function (res) {
          try {
            await api.post("/order/verify-payment", {
              razorpay_order_id: res.razorpay_order_id,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature,
              ...response.data.orderData
            });

            toast.success("Payment Successful !");
            navigate("/my-orders");

            if (!isBuyNow) await loadUserCart();
            if (isBuyNow) setBuyNowProduct(null);
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: address.fullName,
          contact: address.phone,
          email: user?.email || "",
        },

        theme: {
          color: "#000",
        },

        modal: {
          ondismiss: function () {
            toast.error("Payment Cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(
        err.response?.data?.Message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  useEffect(() => {
    if (!user) {
      toast.warn("Please login to continue");
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // Pre-fill address if available in user data
  useEffect(() => {
    if (user && user.shippingAddress) {
      setAddress((prev) => ({
        ...prev,
        fullName: user.name || "",
        ...user.shippingAddress,
      }));
    }
  }, [user]);

  if (displayItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="text-center space-y-6">
          <div className="text-6xl">🛒</div>
          <h2 className="text-2xl font-light text-gray-600">
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Luxury Header */}
          <div className="bg-gradient-to-r from-black via-gray-900 to-black py-8 px-8 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-light tracking-wider">CHECKOUT</h1>
                <p className="text-gray-300 font-light mt-2">
                  Complete your purchase with confidence
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 font-light">Order Total</p>
                <p className="text-3xl font-light">₹{displayTotal}</p>
                <p className="text-sm text-gray-300">
                  {displayItems.length} item(s)
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Left Column - Address Form */}
              <div>
                <div className="flex items-center mb-8">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-light mr-4">
                    1
                  </div>
                  <h3 className="text-2xl font-light tracking-wide">
                    Delivery Address
                  </h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-light tracking-wide">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-gray-50"
                      value={address.fullName}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-light tracking-wide">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter phone number"
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-gray-50"
                      value={address.phone}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-light tracking-wide">
                      Street / House No. *
                    </label>
                    <input
                      type="text"
                      name="street"
                      placeholder="Enter street address"
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-gray-50"
                      value={address.street}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-light tracking-wide">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-gray-50"
                        value={address.city}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 font-light tracking-wide">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        placeholder="Pincode"
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-300 bg-gray-50"
                        value={address.pincode}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-lg font-medium mb-4 font-light tracking-wide">
                    Order Items
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {displayItems.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={item.image_url[0]. url}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.ml}ml • Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Payment */}
              <div>
                <div className="flex items-center mb-8">
                  <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-light mr-4">
                    2
                  </div>
                  <h3 className="text-2xl font-light tracking-wide">
                    Payment Method
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* ✅ Online Payment via Razorpay - no UPI input needed */}
                  <div className="p-6 border-2 border-gray-200 rounded-2xl hover:border-black transition-all duration-300 cursor-pointer bg-gray-50">
                    <label className="flex items-center gap-4 cursor-pointer">
                      <div className="relative">
                        <input
                          type="radio"
                          name="payment"
                          value="online"
                          onChange={() => setMethod("online")}
                          className="w-5 h-5 appearance-none border-2 border-gray-300 rounded-full checked:bg-black checked:border-black focus:ring-2 focus:ring-black"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          {method === "online" && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className="text-lg font-medium">Online Payment</span>
                        <p className="text-gray-600 text-sm mt-1">
                          UPI, Cards, Net Banking via Razorpay
                        </p>
                      </div>
                      <div className="w-16 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-800 text-xs font-medium">
                          Razorpay
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* COD - unchanged */}
                  <div className="p-6 border-2 border-gray-200 rounded-2xl hover:border-black transition-all duration-300 cursor-pointer bg-gray-50">
                    <label className="flex items-center gap-4 cursor-pointer">
                      <div className="relative">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          onChange={() => setMethod("cod")}
                          className="w-5 h-5 appearance-none border-2 border-gray-300 rounded-full checked:bg-black checked:border-black focus:ring-2 focus:ring-black"
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          {method === "cod" && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className="text-lg font-medium">
                          Cash on Delivery
                        </span>
                        <p className="text-gray-600 text-sm mt-1">
                          Pay when your order arrives
                        </p>
                      </div>
                      <div className="w-12 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-800 text-sm font-medium">
                          COD
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <h4 className="text-lg font-medium mb-4 font-light tracking-wide">
                    Order Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({displayItems.length} items)</span>
                      <span>₹{displayTotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (8%)</span>
                      <span>₹{(displayTotal * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between text-lg font-medium">
                        <span>Total Amount</span>
                        <span>₹{(displayTotal * 1.08).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-gray-600">
                  <p className="text-sm">
                    By placing your order, you agree to our Terms of Service
                  </p>
                  <p className="text-xs mt-1">
                    30-day return policy • Secure checkout • Authenticity
                    guaranteed
                  </p>
                </div>
                <button
                  onClick={handleOrder}
                  disabled={isPlacingOrder}
                  className={`px-12 py-4 bg-black text-white rounded-xl hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl font-light tracking-wider text-lg ${isPlacingOrder ? "opacity-75 cursor-not-allowed" : ""}`}
                >
                  {isPlacingOrder ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      PLACING ORDER...
                    </span>
                  ) : (
                    "PLACE ORDER →"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
