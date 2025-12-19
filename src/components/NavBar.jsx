import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useWishList } from '../contexts/WishListContext'

function NavBar() {
  const { user, logoutUser, role } = useAuth()
  const { getCartItemCount, clearCart } = useCart()
  const cartCount = getCartItemCount()
  const { getWishListCount } = useWishList();
  const WishListCount = getWishListCount();
  const [openMenu, setOpenMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-black shadow-2xl border-b border-amber-900/30">
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between px-8 py-5">
        {/* Empty div on left for balance */}
        <div className="w-1/3"></div>
        
        {/* Centered Brand Name */}
        <div className="flex-1 flex justify-center">
          <h2 className="text-[32px] font-light text-amber-50 tracking-[0.3em] uppercase relative">
            VELSCENT
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
          </h2>
        </div>
        
        {/* Right Side Navigation */}
        <div className="w-1/3 flex items-center justify-end gap-8">
          {/* Home */}
          <Link 
            to="/" 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group text-amber-100 hover:text-amber-300 transition-all duration-500"
            title="Home"
          >
            <div className="relative">
              HOME
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-500"></div>
            </div>
          </Link>
          
          {/* About */}
          <Link 
            to="/about" 
            className="group text-amber-100 hover:text-amber-300 transition-all duration-500 font-light tracking-wider text-sm uppercase relative"
            title="About"
          >
            <span className="relative">
              About
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-500"></div>
            </span>
          </Link>

          {/* Admin Dashboard Link (Visible only for admin users) */}
          {role === 'admin' && (
            <Link 
              to="/admin/dashboard" 
              className="group text-amber-100 hover:text-amber-300 transition-all duration-500"
              title="Admin Dashboard"
            >
              <div className="relative">
                <i className="fa-solid fa-shield text-xl"></i>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-500"></div>
              </div>
            </Link>
          )}

          {/* Wishlist */}
          <Link 
            to="/wishlist" 
            className="group relative text-amber-100 hover:text-amber-300 transition-all duration-500"
            title="Wishlist"
          >
            <div className="relative">
              <i className="fa-regular fa-heart text-xl"></i>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-500"></div>

               {WishListCount > 0 && (
                <span className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-600 to-amber-800 text-amber-50 text-xs font-bold px-2 py-1 rounded-full min-w-[24px] h-6 flex items-center justify-center shadow-lg ring-2 ring-amber-900/50">
                  {WishListCount}
                </span>
              )}
            </div>
          </Link>

          {/* Cart */}
          <Link 
            to="/cart" 
            className="group relative text-amber-100 hover:text-amber-300 transition-all duration-500"
            title="Cart"
          >
            <div className="relative">
              <i className="fa-solid fa-cart-shopping text-xl"></i>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-500"></div>
              
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-600 to-amber-800 text-amber-50 text-xs font-bold px-2 py-1 rounded-full min-w-[24px] h-6 flex items-center justify-center shadow-lg ring-2 ring-amber-900/50">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>

          {/* Login/User Menu */}
          <div className="relative" ref={menuRef}>
            {user ? (
              <button 
                onClick={() => setOpenMenu(!openMenu)}
                className="group text-amber-100 hover:text-amber-300 transition-all duration-500"
              >
                <div className="relative">
                  <i className="fa-regular fa-circle-user text-xl"></i>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-500"></div>
                </div>
              </button>
            ) : (
              <Link 
                to="/login" 
                className="group text-amber-100 hover:text-amber-300 transition-all duration-500"
                title="Login"
              >
                <div className="relative">
                  <i className="fa-regular fa-circle-user text-xl"></i>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-500"></div>
                </div>
              </Link>
            )}

            {openMenu && user && (
              <div className="absolute right-0 mt-4 w-56 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl border border-amber-900/30 rounded-xl p-4 backdrop-blur-sm animate-fadeIn">
                <div className="pb-3 border-b border-amber-900/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-700 to-amber-900 flex items-center justify-center">
                      <i className="fa-solid fa-user text-amber-100"></i>
                    </div>
                    <div>
                      <p className="text-sm font-light text-amber-100">{user.email}</p>
                      <p className="text-xs text-amber-300/70 mt-1">
                        {role === 'admin' ? 'Administrator' : 'Customer'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 space-y-1">
                  {/* Admin Dashboard option in dropdown menu */}
                  {role === 'admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setOpenMenu(false)}
                      className="w-full text-left px-3 py-2.5 text-amber-300 hover:text-amber-100 hover:bg-amber-900/20 rounded-lg transition-all duration-300 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <i className="fa-solid fa-shield mr-3 text-sm"></i>
                        <span className="font-light">Admin Dashboard</span>
                      </div>
                      <i className="fa-solid fa-chevron-right text-xs"></i>
                    </Link>
                  )}

                  {/* My Orders Link - Added Here */}
                  <Link
                    to="/my-orders"
                    onClick={() => setOpenMenu(false)}
                    className="w-full text-left px-3 py-2.5 text-amber-300 hover:text-amber-100 hover:bg-amber-900/20 rounded-lg transition-all duration-300 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <i className="fa-solid fa-box-open mr-3 text-sm"></i>
                      <span className="font-light">My Orders</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-xs"></i>
                  </Link>

                  <button
                    onClick={() => {
                      logoutUser()
                      setOpenMenu(false)
                      navigate("/",{replace:true})
                    }}
                    className="w-full text-left px-3 py-2.5 text-red-300 hover:text-red-100 hover:bg-red-900/20 rounded-lg transition-all duration-300 flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <i className="fa-solid fa-arrow-right-from-bracket mr-3 text-sm"></i>
                      <span className="font-light">Logout</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-xs"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex items-center justify-between px-4 py-3">
        {/* Mobile Menu Button */}
        <button
          className="text-amber-100 hover:text-amber-300 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
        </button>

        {/* Centered Brand Name - Mobile */}
        <div className="flex-1 flex justify-center">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <h2 className="text-xl font-light text-amber-50 tracking-[0.2em] uppercase relative">
              VELSCENT
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            </h2>
          </Link>
        </div>

        {/* Cart Icon on Mobile (always visible) */}
        <div className="relative">
          <Link to="/cart" className="text-amber-100 hover:text-amber-300">
            <i className="fa-solid fa-cart-shopping text-lg"></i>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-600 to-amber-800 text-amber-50 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-4.5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-gray-900 to-gray-800 border-t border-amber-900/30 shadow-2xl px-4 py-3">
          <div className="space-y-3">
            {/* Home */}
            <Link 
              to="/" 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" })
                setMobileMenuOpen(false)
              }}
              className="flex items-center text-amber-100 hover:text-amber-300 py-2"
            >
              <i className="fa-solid fa-house mr-3 w-6 text-center"></i>
              Home
            </Link>
            
            {/* About */}
            <Link 
              to="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center text-amber-100 hover:text-amber-300 py-2"
            >
              <i className="fa-solid fa-info-circle mr-3 w-6 text-center"></i>
              About
            </Link>

            {/* Admin Dashboard (Mobile - visible only for admin users) */}
            {role === 'admin' && (
              <Link 
                to="/admin/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center text-amber-100 hover:text-amber-300 py-2"
              >
                <i className="fa-solid fa-shield mr-3 w-6 text-center"></i>
                Admin Dashboard
              </Link>
            )}

            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center text-amber-100 hover:text-amber-300 py-2"
            >
              <i className="fa-regular fa-heart mr-3 w-6 text-center"></i>
              Wishlist
            </Link>

            {/* User Section */}
            {user ? (
              <>
                <div className="pt-3 border-t border-amber-900/30">
                  <div className="flex items-center space-x-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-700 to-amber-900 flex items-center justify-center">
                      <i className="fa-solid fa-user text-amber-100 text-sm"></i>
                    </div>
                    <div>
                      <p className="text-sm font-light text-amber-100 truncate">{user.email}</p>
                      <p className="text-xs text-amber-300/70">
                        {role === 'admin' ? 'Administrator' : 'Customer'}
                      </p>
                    </div>
                  </div>

                  {/* My Orders Link - Added Here for Mobile */}
                  <Link
                    to="/my-orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center text-amber-100 hover:text-amber-300 py-2"
                  >
                    <i className="fa-solid fa-box-open mr-3 w-6 text-center"></i>
                    My Orders
                  </Link>
                  
                  <button
                    onClick={() => {
                      logoutUser()
                      setMobileMenuOpen(false)
                      navigate("/",{replace:true})
                    }}
                    className="w-full flex items-center text-red-300 hover:text-red-100 py-2 mt-2"
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket mr-3 w-6 text-center"></i>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center text-amber-100 hover:text-amber-300 py-2"
              >
                <i className="fa-regular fa-circle-user mr-3 w-6 text-center"></i>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar