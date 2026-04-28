import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, NavLink } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  ArrowLeftIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
   PhotoIcon,
    TagIcon ,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logoutUser, user } = useAuth();
  const navigate = useNavigate();

  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };


    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/admin/dashboard' },
    { name: 'Products', icon: ShoppingBagIcon, path: '/admin/products' },
    { name: 'Users', icon: UsersIcon, path: '/admin/users' },
    { name: 'Orders', icon: ShoppingCartIcon, path: '/admin/orders' },
    { name: 'Banners', icon: PhotoIcon, path: '/admin/banners' },
    { name: 'Offers', icon: TagIcon, path: '/admin/offers' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Close Button */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
            <h1 className="text-xl font-bold text-white">VELSCENT Admin</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 lg:hidden"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center px-4 py-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center h-16 px-4 bg-white border-b border-gray-200 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 mr-4 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
      </header>

      {/* Main Content - FIXED: Remove ml-64 on mobile, keep only on desktop */}
      <div className="lg:ml-64">
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;