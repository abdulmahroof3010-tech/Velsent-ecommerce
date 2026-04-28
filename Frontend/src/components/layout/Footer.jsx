import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-12 mt-20">
      
      {/* 🔥 TOP CENTER - ABOUT */}
      <div className="text-center mb-10">
        <Link
          to="/about"
          className="text-sm tracking-[0.2em] uppercase text-gray-400 hover:text-white transition"
        >
          About Us
        </Link>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-10">

        {/* LEFT - BRAND */}
        <div className="text-center md:text-left max-w-md">
          <h2 className="text-white text-2xl font-semibold tracking-wide">
            VELSCENT
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            A world where sophistication meets aroma.  
            VELSCENT delivers timeless fragrances crafted to inspire elegance,
            confidence, and unforgettable moments.
          </p>
        </div>

        {/* RIGHT - CONTACT */}
        <div className="text-center md:text-right">
          <h3 className="text-white font-medium text-lg mb-3">
            Contact
          </h3>

          <p className="text-sm text-gray-400">velscent@gmail.com</p>
          <p className="text-sm text-gray-400 mt-1">9778363673</p>

          {/* Social */}
          <div className="flex justify-center md:justify-end gap-4 mt-4 text-gray-400">
            <FaFacebookF className="hover:text-white cursor-pointer" />
            <FaInstagram className="hover:text-white cursor-pointer" />
            <FaTwitter className="hover:text-white cursor-pointer" />
            <FaYoutube className="hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>

      {/* 🔻 BOTTOM */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-xs tracking-wide">
        © {new Date().getFullYear()} VELSCENT. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;