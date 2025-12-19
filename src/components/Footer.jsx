import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">

        {/* Brand + About */}
        <div>
          <h2 className="text-white text-2xl font-semibold tracking-wide">VELSCENT</h2>
          <p className="mt-4 text-sm leading-relaxed">
            A world where sophistication meets aroma.  
            VELSCENT delivers timeless fragrances crafted to inspire elegance,  
            confidence, and unforgettable moments.
          </p>

        
         
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-white font-medium text-lg mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Email: velscent@gmail.com</li>
            <li className="hover:text-white cursor-pointer">9778363673</li>
           
          </ul>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} VELSCENT. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
