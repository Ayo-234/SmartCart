import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 dark:border-gray-800 text-gray-500 dark:text-gray-400">
        <div className="w-full md:w-1/3">
          <Image className="w-32 dark:brightness-110 mb-6" src={assets.logo} alt="logo" />
          <p className="text-sm leading-relaxed mb-6">
            QuickCart is Nigeria's premier destination for high-quality tech and lifestyle essentials. We leverage AI to bring you the best deals, personalized specifically for your needs.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition-all">
              <Image className="w-5 h-5 dark:invert" src={assets.facebook_icon} alt="facebook" />
            </a>
            <a href="#" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-pink-50 dark:hover:bg-gray-700 transition-all">
              <Image className="w-5 h-5 dark:invert" src={assets.instagram_icon} alt="instagram" />
            </a>
            <a href="#" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition-all">
              <Image className="w-5 h-5 dark:invert" src={assets.twitter_icon} alt="twitter" />
            </a>
          </div>
        </div>

        <div className="w-full md:w-1/4">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-6 uppercase tracking-wider text-sm">Quick Links</h2>
          <ul className="text-sm space-y-3">
            <li><a className="hover:text-orange-600 dark:hover:text-orange-500 transition" href="/">Home</a></li>
            <li><a className="hover:text-orange-600 dark:hover:text-orange-500 transition" href="/all-products">Shop</a></li>
            <li><a className="hover:text-orange-600 dark:hover:text-orange-500 transition" href="/contact">About Us</a></li>
            <li><a className="hover:text-orange-600 dark:hover:text-orange-500 transition" href="#">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="w-full md:w-1/4">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-6 uppercase tracking-wider text-sm">Contact Us</h2>
          <div className="text-sm space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-orange-600 font-bold">📍</span>
              <p>123 Victoria Island, Lagos, Nigeria</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-orange-600 font-bold">📞</span>
              <p>+234 812 345 6789</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-orange-600 font-bold">✉️</span>
              <p>hello@quickcart.com.ng</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-8 text-center text-xs md:text-sm text-gray-500 dark:text-gray-600 border-t border-gray-100 dark:border-gray-900">
        Copyright 2026 © QuickCart Nigeria. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;