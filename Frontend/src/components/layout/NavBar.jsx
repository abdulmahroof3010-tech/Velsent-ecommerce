import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishList } from "../../contexts/WishListContext";

function NavBar() {
  const { user, logoutUser, role, loading } = useAuth();
  const { count } = useCart();
  const cartCount = count;
  const { countWishlist } = useWishList();
  const WishListCount = countWishlist;
  const [openMenu, setOpenMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="h-20 flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-black shadow-2xl border-b border-amber-900/30">

      {/* ================= DESKTOP (UNCHANGED) ================= */}
      <div className="hidden md:flex items-center justify-between px-8 py-5">
        <div className="w-1/3"></div>

        <div className="flex-1 flex justify-center">
          <h2 className="text-[32px] font-light text-amber-50 tracking-[0.3em] uppercase relative">
            VELSCENT
          </h2>
        </div>

        <div className="w-1/3 flex items-center justify-end gap-8">

          <Link to="/" className="text-amber-100 hover:text-amber-300">
            HOME
          </Link>

          <Link to="/products" className="text-amber-100 hover:text-amber-300">
            Products
          </Link>

          <Link to="/wishlist" className="relative text-amber-100">
            <i className="fa-regular fa-heart text-xl"></i>
            {WishListCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-amber-600 px-1 rounded-full">
                {WishListCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative text-amber-100">
            <i className="fa-solid fa-cart-shopping text-xl"></i>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-amber-600 px-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* ✅ LOGIN / USER (FIXED - ALWAYS PRESENT) */}
          <div className="relative" ref={menuRef}>
            {user ? (
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="text-amber-100 hover:text-amber-300"
              >
                <i className="fa-regular fa-circle-user text-xl"></i>
              </button>
            ) : (
              <Link to="/login" className="text-amber-100 hover:text-amber-300">
                <i className="fa-regular fa-circle-user text-xl"></i>
              </Link>
            )}

            {openMenu && user && (
              <div className="absolute right-0 mt-3 w-48 bg-gray-900 rounded-lg shadow-lg p-3">
                <Link to="/my-orders" className="block py-2 text-sm text-amber-100">
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    logoutUser();
                    setOpenMenu(false);
                    navigate("/");
                  }}
                  className="block py-2 text-sm text-red-400"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ================= MOBILE NAVBAR ================= */}
      <div className="md:hidden flex items-center justify-between px-3 py-2">

        {/* Menu Button */}
        <button
          className="text-amber-100 p-1.5"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"} text-lg`}></i>
        </button>

        {/* Logo */}
        <div className="flex-1 flex justify-center">
          <h2 className="text-lg font-light text-amber-50 tracking-[0.15em]">
            VELSCENT
          </h2>
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative text-amber-100">
          <i className="fa-solid fa-cart-shopping text-base"></i>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 text-[10px] bg-amber-600 px-1 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 px-4 py-2">
          <div className="space-y-1 text-sm">

            <Link to="/" className="block py-2 text-amber-100">Home</Link>
            <Link to="/products" className="block py-2 text-amber-100">Products</Link>
            <Link to="/wishlist" className="block py-2 text-amber-100">Wishlist</Link>

            {user ? (
              <>
                <Link to="/my-orders" className="block py-2 text-amber-100">
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    logoutUser();
                    navigate("/");
                  }}
                  className="block py-2 text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block py-2 text-amber-100">
                Login
              </Link>
            )}

          </div>
        </div>
      )}

    </nav>
  );
}

export default NavBar;