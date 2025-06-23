import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Menu, X, Home, Settings } from 'lucide-react';
import MyOrders from '../pages/myOrders';
import { getMyOrders, updateOrder, cancelOrder } from '../config/api';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [orders, setOrders] = useState([]);

useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userId = localStorage.getItem('userId');
    const authToken = localStorage.getItem('authToken');

    

    const fetchOrders = async () => {
      try {
       

        const data = await getMyOrders(userId);
        setOrders(data);

        

      } catch (err) {
        console.error('Error fetching orders:', err);

    };
  }
    fetchOrders();
  }, );
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 shadow-2xl border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            {/* Custom Shoe Logo */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-7 h-7 text-white"
                  fill="currentColor"
                >
                  <path d="M2,18H22L20,15.27C19.24,14.04 18.25,13 17.27,12.41L16.86,12.23C16.31,11.94 15.5,11.94 14.95,12.23L14.54,12.41C13.56,13 12.57,14.04 11.81,15.27L10.19,15.27C9.43,14.04 8.44,13 7.46,12.41L7.05,12.23C6.5,11.94 5.69,11.94 5.14,12.23L4.73,12.41C3.75,13 2.76,14.04 2,15.27L2,18M4,6H20C20.55,6 21,6.45 21,7V11C21,11.55 20.55,12 20,12H4C3.45,12 3,11.55 3,11V7C3,6.45 3.45,6 4,6Z"/>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            
            {/* Brand Name */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Stylish Men
              </h1>
              <span className="text-sm text-gray-400 font-medium tracking-wider">
                PREMIUM SHOES
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="group flex items-center space-x-2 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Home</span>
            </a>
            
            <a
              href="/admin"
              className="group flex items-center space-x-2 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Admin Dashboard</span>
            </a>
            
            <a
              href="/myorder"
              className="group relative flex items-center space-x-2 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {/* Cart Badge */}
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                  {orders.length}
                </span>
              </div>
              <span className="font-medium">My Order</span>
            </a>

            {/* CTA Button */}
            {/* <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <span className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Account</span>
              </span>
            </button> */}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white p-2 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800/95 backdrop-blur-md rounded-xl mt-4 mb-4 shadow-2xl border border-gray-700">
            <div className="px-6 py-4 space-y-4">
              <a
                href="/"
                className="flex items-center space-x-3 text-gray-300 hover:text-white py-3 px-4 rounded-lg transition-all duration-300 hover:bg-white/10"
                onClick={toggleMobileMenu}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </a>
              
              <a
                href="/admin"
                className="flex items-center space-x-3 text-gray-300 hover:text-white py-3 px-4 rounded-lg transition-all duration-300 hover:bg-white/10"
                onClick={toggleMobileMenu}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Admin Dashboard</span>
              </a>
              
              <a
                href="/myorder"
                className="flex items-center space-x-3 text-gray-300 hover:text-white py-3 px-4 rounded-lg transition-all duration-300 hover:bg-white/10"
                onClick={toggleMobileMenu}
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">{orders.length}</span>
                </div>
                <span className="font-medium">My Order</span>
              </a>

              {/* <div className="border-t border-gray-700 pt-4">
                <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-all duration-300">
                  <span className="flex items-center justify-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Account</span>
                  </span>
                </button>
              </div> */}
            </div>
          </div>
        )}
      </div>

      {/* Decorative Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
    </nav>
  );
};

export default Navbar;