import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  TruckIcon, 
  XCircleIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../Service/Axios';
import { toast } from 'react-toastify';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const statusColors = {
    Pending: 'bg-orange-100 text-orange-800 border-orange-200',
    Processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Shipped: 'bg-blue-100 text-blue-800 border-blue-200',
    Delivered: 'bg-green-100 text-green-800 border-green-200',
    Cancelled: 'bg-red-100 text-red-800 border-red-200'
  };

  const transformOrderData = useCallback((order) => ({
    id: order.id || order._id || Date.now().toString(),
    orderNumber: order.orderNumber || order.id || `ORD-${Date.now()}`,
    createdAt: order.createdAt || order.orderDate || new Date().toISOString(),
    items: Array.isArray(order.items) ? order.items : [],
    totalAmount: order.totalAmount || order.total || 0,
    status: order.status || 'Pending',
    paymentMethod: order.paymentMethod || 'Unknown',
    paymentStatus: order.paymentStatus || 'Pending',
    shippingAddress: order.shippingAddress || 'Address not specified',
    trackingNumber: order.trackingNumber || null,
    upiId: order.upiId || null
  }), []);

  const fetchFromUserData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const res = await api.get(`/users/${user.id}`);
      const userData = res.data;

      if (Array.isArray(userData.orders)) {
        const transformedOrders = userData.orders.map(transformOrderData);
        setOrders(transformedOrders);
      } else {
        setOrders([]);
        toast.info('No orders found in your account.');
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load your orders. Please try again.');
      toast.error('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, transformOrderData]);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      if (user) {
        await fetchFromUserData();
      } else {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [user, fetchFromUserData]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'Shipped':
        return <TruckIcon className="w-5 h-5 text-blue-500" />;
      case 'Processing':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'Pending':
        return <ClockIcon className="w-5 h-5 text-orange-500" />;
      case 'Cancelled':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const handleTrackOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (order?.trackingNumber) {
      toast.info(
        <div>
          <p className="font-semibold">Tracking Information</p>
          <p>Order: {order.orderNumber}</p>
          <p>Tracking Number: <span className="font-mono">{order.trackingNumber}</span></p>
          <p className="mt-2">You can track your order on the courier's website.</p>
        </div>,
        { autoClose: 5000 }
      );
    } else {
      toast.warn('Tracking information is not available yet.');
    }
  };

  const handleCancelOrder = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const canCancel = ['Pending', 'Processing'].includes(order.status);
    if (!canCancel) {
      toast.warn('This order cannot be cancelled.');
      return;
    }

    if (!window.confirm(`Are you sure you want to cancel order ${order.orderNumber}?`)) {
      return;
    }

    try {
      // Try to update in orders endpoint
      try {
        await api.patch(`/orders/${orderId}`, { 
          status: 'Cancelled' 
        });
      } catch (orderErr) {
        console.log('Falling back to user data update:', orderErr);
        // Fallback: update in user data
        const userResponse = await api.get(`/users/${user.id}`);
        const userData = userResponse.data;
        
        const updatedOrders = (userData.orders || []).map(o => 
          o.id === orderId ? { ...o, status: 'Cancelled' } : o
        );
        
        await api.patch(`/users/${user.id}`, { 
          orders: updatedOrders 
        });
      }
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(o => 
          o.id === orderId ? { ...o, status: 'Cancelled' } : o
        )
      );
      
      toast.success(`Order ${order.orderNumber} has been cancelled.`);
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order. Please try again.');
    }
  };

  const totalSpent = useMemo(() => {
    return orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  }, [orders]);

  const OrderItemImage = ({ item }) => {
    const [imgError, setImgError] = useState(false);
    
    const imageUrl = imgError 
      ? 'https://via.placeholder.com/80x80?text=Perfume' 
      : (item.image_url || item.image || 'https://via.placeholder.com/80x80?text=Perfume');

    return (
      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt={item.name || 'Product image'}
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
          <h2 className="text-2xl font-light text-gray-600">Please login to view your orders</h2>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
            aria-label="Navigate to login page"
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
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
            aria-label="Go back to previous page"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchFromUserData}
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
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
          aria-label="Go back to previous page"
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
                <ClockIcon 
                  className="w-12 h-12 text-gray-400 animate-spin mx-auto mb-4" 
                  aria-label="Loading orders"
                />
                <p className="text-gray-500">Loading your orders...</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-gray-500 text-lg mb-4">📦 No orders found</div>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
              <button
                onClick={() => navigate('/shop')}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                data-order-id={order.id}
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col md:items-end gap-2">
                      <span 
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusColors[order.status]}`}
                        aria-label={`Order status: ${order.status}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </span>
                      <p className="text-lg font-bold text-gray-900">
                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items?.map((item, itemIndex) => (
                      <div 
                        key={`${order.id}-${item.id || itemIndex}`} 
                        className="flex items-center gap-4 py-3"
                      >
                        <OrderItemImage item={item} />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.name || 'Unnamed Product'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Size: {item.ml || item.size || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity || 1}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ₹{(item.price || 0).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Info */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Shipping Address
                    </h4>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress}
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
                    {order.upiId && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">
                          UPI ID
                        </span>
                        <span className="text-sm text-gray-600 font-mono">
                          {order.upiId}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Order Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex flex-wrap gap-3">
                      {(order.status === 'Shipped' || order.status === 'Processing') && order.trackingNumber && (
                        <button
                          onClick={() => handleTrackOrder(order.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center transition-colors"
                          aria-label={`Track order ${order.orderNumber}`}
                        >
                          <TruckIcon className="w-4 h-4 mr-2" />
                          Track Order
                        </button>
                      )}
                      
                      {(order.status === 'Pending' || order.status === 'Processing') && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center transition-colors"
                          aria-label={`Cancel order ${order.orderNumber}`}
                        >
                          <XCircleIcon className="w-4 h-4 mr-2" />
                          Cancel Order
                        </button>
                      )}
                      
                      <button
                        onClick={() => navigate(`/order/${order.id}`)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm font-medium flex items-center transition-colors"
                        aria-label={`View details for order ${order.orderNumber}`}
                      >
                        View Details
                      </button>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Order Summary</h3>
                <p className="text-sm text-gray-600">
                  Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{totalSpent.toLocaleString('en-IN')}
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