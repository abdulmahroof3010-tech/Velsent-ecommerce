import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../Service/Axios";
import { toast } from "react-toastify";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const statusColors = {
    Pending: "bg-orange-100 text-orange-800 border-orange-200",
    Processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Shipped: "bg-blue-100 text-blue-800 border-blue-200",
    Delivered: "bg-green-100 text-green-800 border-green-200",
    Cancelled: "bg-red-100 text-red-800 border-red-200",
    Confirmed: "bg-purple-100 text-purple-800 border-purple-200",
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/order");
      if (res.data?.orderData) {
        setOrders(res.data.orderData);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load your orders. Please try again.");
      toast.error("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case "Shipped":
        return <TruckIcon className="w-5 h-5 text-blue-500" />;
      case "Processing":
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case "Pending":
        return <ClockIcon className="w-5 h-5 text-orange-500" />;
      case "Cancelled":
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case "Confirmed":
        return <CheckCircleIcon className="w-5 h-5 text-purple-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatAddress = (address) => {
    if (!address) return "Address not specified";
    if (typeof address === "string") return address;
    const addressfield = [
      address.name,
      address.address,
      address.city,
      address.pincode,
      address.phonenumber ? `Phone: ${address.phonenumber}` : null,
    ].filter(Boolean);
    return addressfield.length > 0
      ? addressfield.join(", ")
      : "Address not specified";
  };

  const handleCancelOrder = async (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    if (!order) return;

    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      //  fixed: send id in URL params, not body
      const response = await api.patch(`/order/cancel/${orderId}`);
      toast.success(response.data.Message || "Order cancelled successfully");
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? { ...o, orderStatus: "Cancelled", paymentStatus: "Failed" }
            : o
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.Message || "Failed to cancel order. Please try again."
      );
    }
  };

  const totalSpent = useMemo(() => {
    return orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  }, [orders]);

  
  const OrderItemImage = ({ item }) => {
    const [imgError, setImgError] = useState(false);
    const product = item.product || {};
    const imageUrl =
      imgError
        ? "https://via.placeholder.com/80x80?text=Perfume"
        : product.image_url?.[0]?.url || "https://via.placeholder.com/80x80?text=Perfume";

    return (
      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name || "Product image"}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="text-center space-y-6">
          <div className="text-6xl">🔐</div>
          <h2 className="text-2xl font-light text-gray-600">
            Please login to view your orders
          </h2>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
          >
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Orders
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchOrders}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Orders</h1>
          <p className="text-gray-600">View and track your order history</p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block">
                <ClockIcon className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading your orders...</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-gray-500 text-lg mb-4">📦 No orders found</div>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet.
              </p>
              <button
                onClick={() => navigate("/products")}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col md:items-end gap-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                          statusColors[order.orderStatus] || "bg-gray-100 text-gray-800 border-gray-200"
                        }`}
                      >
                        {getStatusIcon(order.orderStatus)}
                        <span className="ml-1">{order.orderStatus}</span>
                      </span>
                      <p className="text-lg font-bold text-gray-900">
                        ₹{order.totalAmount?.toLocaleString("en-IN") || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items?.map((item, itemIndex) => {
                      const product = item.product || {};
                      return (
                        <div
                          key={`${order._id}-${product._id || itemIndex}`}
                          className="flex items-center gap-4 py-3"
                        >
                          <OrderItemImage item={item} />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {product.name || "Unnamed Product"}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Size: {product.ml || "N/A"}ml
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity || 1}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* ✅ fixed: use item.price which is stored in order */}
                            <p className="text-sm font-bold text-gray-900">
                              ₹{item.price?.toLocaleString("en-IN") || 0}
                            </p>
                            {product.original_price && (
                              <p className="text-xs font-medium text-gray-500 line-through decoration-red-500">
                                ₹{product.original_price?.toLocaleString("en-IN")}
                              </p>
                            )}
                            {product.discount_percentage ? (
                              <span className="text-xs font-bold text-green-600">
                                ({product.discount_percentage}% OFF)
                              </span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Shipping Info */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Shipping Address
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formatAddress(order.shippingAddress)}
                    </p>
                  </div>

                  {/* Order Summary */}
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">
                        Payment Method
                      </span>
                      <span className="text-sm text-gray-600 capitalize">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">
                        Payment Status
                      </span>
                      <span className="text-sm text-gray-600 capitalize">
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex flex-wrap gap-3">
                      {(order.orderStatus === "Pending" ||
                        order.orderStatus === "Processing") && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center transition-colors"
                        >
                          <XCircleIcon className="w-4 h-4 mr-2" />
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {orders.length > 0 && (
          <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Order Summary
                </h3>
                <p className="text-sm text-gray-600">
                  Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{totalSpent.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
