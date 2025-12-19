import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChartBarIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { FaRupeeSign } from "react-icons/fa";
import useFetch from '../../hooks/useFetch';

function Dashboard() {
  const users = useFetch('users');
  const products = useFetch('products');
  

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      link: '/admin/users'
    },
    {
      title: 'Total Products',
      value: products.length,
      icon: ShoppingBagIcon,
      color: 'bg-green-500',
      link: '/admin/products'
    },
    {
      title: 'Active Products',
      value: products.filter(p => p.isActive).length,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      link: '/admin/products'
    },
    {
      title: 'Revenue',
      value: `₹${users.reduce((total, user) => {
    const userOrders = user.orders || [];
    return total + userOrders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );
  }, 0).toLocaleString()}`,
      icon: FaRupeeSign ,
      color: 'bg-yellow-500',
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to VELSCENT Admin Panel</p>
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-5 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h2>
          <div className="space-y-4">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                  User
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/admin/users"
            className="block text-center mt-4 text-blue-600 hover:text-blue-800"
          >
            View all users →
          </Link>
        </div>

    
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Products</h2>
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">₹{product.sale_price}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/admin/products"
            className="block text-center mt-4 text-blue-600 hover:text-blue-800"
          >
            View all products →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
