import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, MessageCircle, Send, Heart } from 'lucide-react';

const Footer = () => {
  const openWhatsApp = () => {
    const phoneNumber = '+923030291107'; // Replace with your actual WhatsApp number
    const message = 'Hello! I am interested in your premium men shoes collection.';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const socialLinks = [
    // {
    //   name: 'Facebook',
    //   icon: Facebook,
    //   url: 'https://facebook.com/stylishmen',
    //   color: 'hover:text-blue-500',
    //   bgColor: 'hover:bg-blue-500/20'
    // },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/stylishmenshoe/?igsh=MWZ2bXh6N3I5eHZkNg%3D%3D&utm_source=ig_contact_invite#',
      color: 'hover:text-pink-500',
      bgColor: 'hover:bg-pink-500/20'
    },
    // {
    //   name: 'Twitter',
    //   icon: Twitter,
    //   url: 'https://twitter.com/stylishmen',
    //   color: 'hover:text-sky-500',
    //   bgColor: 'hover:bg-sky-500/20'
    // },
    // {
    //   name: 'YouTube',
    //   icon: Youtube,
    //   url: 'https://youtube.com/stylishmen',
    //   color: 'hover:text-red-500',
    //   bgColor: 'hover:bg-red-500/20'
    // }
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-black text-white relative overflow-hidden">
      {/* Decorative Top Border */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border border-white/10 rounded-full"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 border border-white/10 rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-7 h-7 text-white"
                  fill="currentColor"
                >
                  <path d="M2,18H22L20,15.27C19.24,14.04 18.25,13 17.27,12.41L16.86,12.23C16.31,11.94 15.5,11.94 14.95,12.23L14.54,12.41C13.56,13 12.57,14.04 11.81,15.27L10.19,15.27C9.43,14.04 8.44,13 7.46,12.41L7.05,12.23C6.5,11.94 5.69,11.94 5.14,12.23L4.73,12.41C3.75,13 2.76,14.04 2,15.27L2,18M4,6H20C20.55,6 21,6.45 21,7V11C21,11.55 20.55,12 20,12H4C3.45,12 3,11.55 3,11V7C3,6.45 3.45,6 4,6Z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Stylish Men
                </h3>
                <span className="text-sm text-gray-400 tracking-wider">PREMIUM SHOES</span>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Elevate your style with our premium collection of men's shoes. Quality craftsmanship meets modern design.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-gray-400 ${social.color} ${social.bgColor} transition-all duration-300 hover:scale-110 hover:shadow-lg group`}
                  >
                    <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Shop'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-2 h-px bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">Contact Us</h4>
            {/* <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                <span>123 Fashion Street, Style City, SC 12345</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span>info@stylishmen.com</span>
              </li>
            </ul> */}

            {/* WhatsApp Chat Button */}
            <button
              onClick={openWhatsApp}
              className="mt-6 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>

          {/* Newsletter */}
          {/* <div>
            <h4 className="text-xl font-bold mb-6 text-white">Stay Updated</h4>
            <p className="text-gray-400 mb-6">Subscribe to get updates on new collections and exclusive offers.</p>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white p-2 rounded-md transition-all duration-300 hover:scale-105">
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <input type="checkbox" className="rounded border-gray-600 bg-white/10 text-amber-500 focus:ring-amber-500" />
                <span>I agree to receive marketing emails</span>
              </div>
            </div>

           
            <div className="mt-8 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Free Shipping Over $100</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>30-Day Returns</span>
              </div>
            </div>
          </div> */}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Stylish Men Shoes. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>by Team Stylish</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={openWhatsApp}
          className="w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl hover:shadow-green-500/25 flex items-center justify-center transition-all duration-300 hover:scale-110 animate-bounce"
        >
          <MessageCircle className="w-8 h-8" />
        </button>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
          !
        </div>
      </div>
    </footer>
  );
};

export default Footer;