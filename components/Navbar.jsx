"use client"
import React, { useState, useRef, useEffect } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { Search, User, ShoppingCart, Menu, LogOut, Settings, Package, Sun, Moon } from "lucide-react";

const Navbar = () => {
  const { isAdmin, router, searchQuery, setSearchQuery, getCartCount, userData, logout, loading: authLoading, isDarkMode, toggleDarkMode } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm transition-all">
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-4 text-gray-700 dark:text-gray-200">
        {/* Logo */}
        <div className="flex-shrink-0 cursor-pointer" onClick={() => router.push('/')}>
          <Image
            className="w-28 md:w-36 transition-transform hover:scale-105"
            src={assets.logo}
            alt="QuickCart Logo"
            priority
          />
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative group">
          <form onSubmit={handleSearch} className="w-full relative flex items-center">
            <input 
              type="text" 
              placeholder="Search for products, brands and more..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-5 pr-12 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 group-hover:shadow-md dark:text-white"
            />
            <button 
              type="submit" 
              className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors flex items-center justify-center"
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* Desktop Links & Actions */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/all-products" className="font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Shop
          </Link>
          
          {isAdmin && (
            <button onClick={() => router.push('/admin')} className="font-medium text-sm text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 px-4 py-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
              Admin Panel
            </button>
          )}

          <div className="flex items-center gap-5 pl-4 border-l border-gray-200 dark:border-gray-800">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Account Dropdown */}
            <div className="relative" ref={accountRef}>
              <button 
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              >
                {authLoading ? (
                  <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                ) : userData ? (
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {userData.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                ) : (
                  <User size={22} className="group-hover:scale-110 transition-transform" />
                )}
                <span className="text-[10px] font-semibold">
                  {authLoading ? '...' : userData ? userData.name?.split(' ')[0] : 'Account'}
                </span>
              </button>

              {isAccountOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {userData ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{userData.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userData.email}</p>
                      </div>
                      <Link href="/my-orders" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <Package size={16} /> My Orders
                      </Link>
                      <button onClick={() => { logout(); setIsAccountOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left">
                        <LogOut size={16} /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <User size={16} /> Sign In
                      </Link>
                      <Link href="/register" onClick={() => setIsAccountOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <Settings size={16} /> Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button onClick={() => router.push('/cart')} className="relative flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
              <div className="relative">
                <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {getCartCount()}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold">Cart</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => router.push('/cart')} className="relative text-gray-600 dark:text-gray-300">
             <ShoppingCart size={24} />
             {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {getCartCount()}
                </span>
             )}
          </button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Search & Menu (Dropdown) */}
      {isMenuOpen && (
        <div className="md:hidden px-6 pb-4 pt-2 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-inner animate-in slide-in-from-top-2">
          <form onSubmit={handleSearch} className="relative flex items-center mb-4">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="absolute right-3 text-gray-500">
              <Search size={20} />
            </button>
          </form>
          <div className="flex flex-col gap-3">
            <Link href="/all-products" className="text-gray-700 dark:text-gray-200 font-medium py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2" onClick={() => setIsMenuOpen(false)}>Shop</Link>
            {authLoading ? (
               <div className="py-2 px-2 h-10 w-24 bg-gray-100 animate-pulse rounded" />
            ) : userData ? (
              <>
                <Link href="/my-orders" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2" onClick={() => setIsMenuOpen(false)}>
                  <Package size={20} /> My Orders
                </Link>
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="flex items-center gap-2 text-red-600 font-medium py-2 hover:bg-red-50 rounded px-2 text-left">
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2" onClick={() => setIsMenuOpen(false)}>
                  <User size={20} /> Sign In
                </Link>
                <Link href="/register" className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2" onClick={() => setIsMenuOpen(false)}>
                  <Settings size={20} /> Register
                </Link>
              </>
            )}
            {isAdmin && (
              <button onClick={() => { router.push('/admin'); setIsMenuOpen(false); }} className="text-blue-600 font-medium py-2 border border-blue-200 bg-blue-50 rounded px-4 text-center mt-2">
                Admin Panel
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
