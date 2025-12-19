// src/App.jsx (FIXED - remove BrowserRouter import)
import React from 'react'
import Register from './Pages/Register/Register'
import Login from './Pages/Login/Login'
import Home from './Pages/Home'
import { Routes, Route } from 'react-router-dom' // REMOVE BrowserRouter from here
import DetailsPage from './Pages/DetailsPage'
import Cart from './Pages/Cart'
import Payment from './Pages/Payment'
import About from './Pages/About'
import Wishlist from './Pages/WishList'

// Admin Components
import AdminLayout from './components/Admin/AdminLayout'
import Dashboard from './components/Admin/Dashboard.jsx'
import Products from './components/Admin/Products.jsx'
import AddProduct from './components/Admin/AddProduct.jsx'
import Users from './components/Admin/Users'
import Orders from './components/Admin/orders.jsx'
import ProtectedAdminRoute from './components/Admin/ProtectedAdminRoute'
import MyOrders from './Pages/MyOrders.jsx'
import { ToastContainer } from "react-toastify";
import NotFound from './Pages/NotFound.jsx'

function App() {
  return (
    <div>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/details/:productid' element={<DetailsPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/my-orders' element={<MyOrders />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedAdminRoute> 
            <AdminLayout />
          </ProtectedAdminRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<AddProduct />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  )
}

export default App