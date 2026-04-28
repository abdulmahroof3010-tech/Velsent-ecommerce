// src/App.jsx (FIXED - remove BrowserRouter import)
import React from 'react'
import Register from './Pages/Register/Register'
import VerifyOtp from './Pages/Register/verifyOtp.jsx'
import Login from './Pages/Login/Login'
import Home from './Pages/Home'
import { Routes, Route } from 'react-router-dom' // REMOVE BrowserRouter from here
import DetailsPage from './Pages/DetailsPage'
import Cart from './Pages/Cart'
import Payment from './Pages/Payment'
import About from './Pages/About'
import Wishlist from './Pages/WishList'
import Products from './Pages/product.jsx'

// Admin Components
import AdminLayout from './components/Admin/AdminLayout'
import Dashboard from './components/Admin/Dashboard.jsx'
import AdminProducts from './components/Admin/Products.jsx'
import AddProduct from './components/Admin/AddProduct.jsx'
import Users from './components/Admin/Users'
import Orders from './components/Admin/orders.jsx'
import ProtectedAdminRoute from './components/Admin/ProtectedAdminRoute'
import MyOrders from './Pages/MyOrders.jsx'
import { ToastContainer } from "react-toastify";
import NotFound from './Pages/NotFound.jsx'
import Layout from './components/layout/layout.jsx'
import BannerManagement from "./components/Admin/adminbanner.jsx"
import AdminOffer from './components/Admin/offerManagment.jsx'

function App() {
  return (
    <div>
      <Routes>
        <Route element={<Layout/>} >

        {/* User Routes */}

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/products" element={<Products />} />
        <Route path='/details/:id' element={<DetailsPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/my-orders' element={<MyOrders />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedAdminRoute> 
            <AdminLayout />
          </ProtectedAdminRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<AddProduct />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
          <Route path="banners" element={<BannerManagement />} />
         <Route path="offers" element={<AdminOffer />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  )
}

export default App