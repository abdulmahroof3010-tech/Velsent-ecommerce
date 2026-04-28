import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  XCircleIcon,
  EyeIcon,
  PrinterIcon,
  ExclamationCircleIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { api } from "../../Service/Axios";
import { toast } from "react-toastify";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [amountStatus, setAmountStatus] = useState({
    Paid: 0,
    Pending: 0,
    Failed: 0,
  });
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/admin/order");

      if (
        response.data &&
        response.data.orderData &&
        response.data.orderData.length > 0
      ) {
        // Transform orders to match frontend format
        const transformedOrders = response.data.orderData.map((order) => ({
          id: order._id,
          orderNumber: order._id.slice(-8).toUpperCase(),

          userId: order.user?._id || order.user,

          customer: order.user?.name || order.user?.email || "Unknown Customer",
          email: order.user?.email || "No email",
          phone: order.user?.phonenumber || "No phone",

          address: order.shippingAddress?.address || "No address",

          date: new Date(order.createdAt).toLocaleDateString("en-GB"),
          time: new Date(order.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          fullDate: new Date(order.createdAt),

          total: order.totalAmount || 0,
          status: order.orderStatus || "Pending",

          items:
            order.items?.map((item) => ({
              id: item.product?._id || item._id,
              name: item.product?.name || "Unknown Product",
              quantity: item.quantity || 1,
              price: item.price || 0,
              image: item.product?.image_url?.[0]?.url || null,
              size: item.product?.ml || "N/A",
            })) || [],

          paymentMethod: order.paymentMethod || "Unknown",
          paymentStatus: order.paymentStatus || "Pending",

          shippingAddress: order.shippingAddress || "Address not specified",
        }));

        // Sort by date (newest first)
        transformedOrders.sort(
          (a, b) => new Date(b.fullDate) - new Date(a.fullDate),
        );

        setOrders(transformedOrders);

        // Set amount status from API response
        if (response.data.AmountStatus && response.data.AmountStatus[0]) {
          setAmountStatus(response.data.AmountStatus[0]);
        }
      } else {
        setOrders([]);
        setError(response.data?.Message || "No orders found");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.response?.data?.Message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
        );
      case "Shipped":
        return <TruckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />;
      case "Pending":
        return <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />;
      case "Cancelled":
        return <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
     
      case "Pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getFilterButtonStyle = (status, isActive) => {
    const baseColors = {
      all: {
        active: "bg-black text-white border-black",
        inactive: "bg-gray-100 text-gray-700 border-gray-200",
      },
      Pending: {
        active: "bg-orange-500 text-white border-orange-500",
        inactive: "bg-orange-100 text-orange-700 border-orange-200",
      },
      Shipped: {
        active: "bg-blue-500 text-white border-blue-500",
        inactive: "bg-blue-100 text-blue-700 border-blue-200",
      },
      Delivered: {
        active: "bg-green-500 text-white border-green-500",
        inactive: "bg-green-100 text-green-700 border-green-200",
      },
      Cancelled: {
        active: "bg-red-500 text-white border-red-500",
        inactive: "bg-red-100 text-red-700 border-red-200",
      },
    };

    return isActive
      ? baseColors[status]?.active || baseColors.all.active
      : baseColors[status]?.inactive || baseColors.all.inactive;
  };

  const getOrderCount = (status) => {
    if (status === "all") return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);

      await api.post(`admin/order/orderStatus/${orderId}`, {
        status: newStatus,
      });

      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order,
        ),
      );

      toast.success(`Order status updated to ${newStatus}`);

      // Refresh orders to get updated data
      await fetchAllOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(
        error.response?.data?.Error || "Failed to update order status",
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const totalRevenue = orders
  .filter(order => order.paymentStatus === "Paid")
  .reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const uniqueCustomers = [...new Set(orders.map((order) => order.userId))]
    .length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ClockIcon className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Orders Management
        </h1>
        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
          Manage all customer orders and track fulfillment
        </p>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <ExclamationCircleIcon className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl shadow-sm sm:shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Orders</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                {totalOrders}
              </p>
            </div>
            <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
              <ClockIcon className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm sm:shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Revenue</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                ₹{totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm sm:shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Active Customers</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                {uniqueCustomers}
              </p>
            </div>
            <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
              <UserIcon className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm sm:shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Avg. Order Value</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                ₹{Math.round(totalRevenue / totalOrders || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-yellow-100 p-2 sm:p-3 rounded-lg">
              <ClockIcon className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status Summary */}
      {amountStatus &&
        (amountStatus.Paid > 0 ||
          amountStatus.Pending > 0 ||
          amountStatus.Failed > 0) && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200">
              <p className="text-xs text-green-600">Paid Amount</p>
              <p className="text-lg sm:text-xl font-bold text-green-700">
                ₹{amountStatus.Paid?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-200">
              <p className="text-xs text-orange-600">Pending Amount</p>
              <p className="text-lg sm:text-xl font-bold text-orange-700">
                ₹{amountStatus.Pending?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 sm:p-4 border border-red-200">
              <p className="text-xs text-red-600">Failed Amount</p>
              <p className="text-lg sm:text-xl font-bold text-red-700">
                ₹{amountStatus.Failed?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm sm:shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex overflow-x-auto pb-2 space-x-2 sm:flex-wrap sm:space-x-3">
          {[
            "all",
            "Pending",
            "Shipped",
            "Delivered",
            "Cancelled",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg border text-xs sm:text-sm whitespace-nowrap ${
                filter === status
                  ? getFilterButtonStyle(status, true)
                  : getFilterButtonStyle(status, false)
              }`}
            >
              {status === "all" ? "All Orders" : status} (
              {getOrderCount(status)})
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Info
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900 text-sm">
                        {order.orderNumber}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {order.paymentMethod} • {order.paymentStatus}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-gray-900 text-sm flex items-center">
                          <UserIcon className="w-3 h-3 mr-1 text-gray-400" />
                          {order.customer}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <EnvelopeIcon className="w-3 h-3 mr-1" />
                          <span className="truncate max-w-[150px]">
                            {order.email}
                          </span>
                        </div>
                        {order.phone && order.phone !== "No phone" && (
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <PhoneIcon className="w-3 h-3 mr-1" />
                            {order.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-gray-900 text-sm">{order.date}</div>
                      <div className="text-xs text-gray-500">{order.time}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-gray-900 text-sm">
                        {order.items.length} item(s)
                      </div>
                      <div className="text-xs text-gray-500 max-w-xs">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="truncate">
                            {item.name} (x{item.quantity})
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-blue-600 text-xs">
                            +{order.items.length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900 text-sm">
                        ₹{order.total.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span
                          className={`ml-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex space-x-1">
                        <button
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100"
                          title="View Details"
                          onClick={() => viewOrderDetails(order)}
                        >
                          <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200"
                          title="Print Invoice"
                          onClick={() =>
                            window.open(`/invoice/${order.id}`, "_blank")
                          }
                        >
                          <PrinterIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          disabled={updatingStatus === order.id}
                          className="px-2 py-1 border border-gray-300 rounded-lg text-xs"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 sm:py-12 text-center">
                    <div className="text-gray-500">
                      <ClockIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300 mb-3 sm:mb-4" />
                      <p className="text-base sm:text-lg font-medium">
                        {orders.length === 0
                          ? "No orders found"
                          : "No orders match the filter"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">
                    {order.orderNumber}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.date} {order.time}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {order.paymentMethod} • {order.paymentStatus}
                  </p>
                </div>
                <div className="flex items-center">
                  {getStatusIcon(order.status)}
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-900 truncate">
                    {order.customer}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600 truncate">{order.email}</span>
                </div>
                {order.phone && order.phone !== "No phone" && (
                  <div className="flex items-center text-sm">
                    <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{order.phone}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {order.items.length} item(s)
                  </span>
                  <span className="font-medium text-gray-900">
                    ₹{order.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mt-4 pt-3 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => viewOrderDetails(order)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100"
                    title="View Details"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      window.open(`/invoice/${order.id}`, "_blank")
                    }
                    className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200"
                    title="Print Invoice"
                  >
                    <PrinterIcon className="w-4 h-4" />
                  </button>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  disabled={updatingStatus === order.id}
                  className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <ClockIcon className="w-10 h-10 mx-auto text-gray-300 mb-3" />
            <p className="text-base font-medium text-gray-900">
              {orders.length === 0
                ? "No orders found"
                : "No orders match the filter"}
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Order Details
                </h2>
                <button
                  onClick={closeOrderDetails}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                    Order Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Order ID:</span>
                      <span className="font-medium text-sm">
                        {selectedOrder.orderNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Date:</span>
                      <span className="font-medium text-sm">
                        {selectedOrder.date} {selectedOrder.time}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Status:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}
                      >
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">
                        Payment Method:
                      </span>
                      <span className="font-medium text-sm">
                        {selectedOrder.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">
                        Payment Status:
                      </span>
                      <span className="font-medium text-sm">
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                    Customer Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Customer:</span>
                      <span className="font-medium text-sm">
                        {selectedOrder.customer}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Email:</span>
                      <span className="font-medium text-sm">
                        {selectedOrder.email}
                      </span>
                    </div>
                    {selectedOrder.phone &&
                      selectedOrder.phone !== "No phone" && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 text-sm">Phone:</span>
                          <span className="font-medium text-sm">
                            {selectedOrder.phone}
                          </span>
                        </div>
                      )}
                    <div className="mt-3 sm:mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-1 sm:mb-2">
                        Shipping Address
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {selectedOrder.shippingAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                  Order Items
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-200 last:border-0"
                    >
                      <div className="flex items-center">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover mr-3"
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/150")
                            }
                          />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-600">
                            Size: {item.size} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 text-sm">
                          ₹{item.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          Total: ₹
                          {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-gray-300">
                    <span className="text-base sm:text-lg font-bold text-gray-900">
                      Total Amount:
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                      ₹{selectedOrder.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() =>
                    window.open(`/invoice/${selectedOrder.id}`, "_blank")
                  }
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm sm:text-base"
                >
                  Print Invoice
                </button>
                <button
                  onClick={closeOrderDetails}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {orders.length > 0 && (
        <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500">
          Showing {filteredOrders.length} of {orders.length} orders •{" "}
          {uniqueCustomers} unique customers • Total Revenue: ₹
          {totalRevenue.toLocaleString()}
        </div>
      )}
    </div>
  );
}

export default Orders;
