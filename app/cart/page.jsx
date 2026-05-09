'use client'
import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";

const Cart = () => {
  const { products, router, cartItems, addToCart, updateCartQuantity, getCartCount } = useAppContext();

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20 transition-colors duration-300">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500 dark:text-gray-400">
              Your <span className="font-bold text-orange-600">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500/80 dark:text-gray-500">{getCartCount()} Items</p>
          </div>
          
          {getCartCount() === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Image src={assets.cart_icon} alt="Empty cart" className="w-20 h-20 opacity-30 mb-4 dark:invert" />
              <p className="text-xl text-gray-400 dark:text-gray-500 mb-6">Your cart is empty</p>
              <button 
                onClick={() => router.push('/all-products')} 
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-xl font-semibold transition shadow-lg shadow-blue-600/20"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="text-left border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="text-nowrap pb-6 md:px-4 px-1 text-gray-600 dark:text-gray-400 font-semibold uppercase text-xs tracking-wider">
                      Product Details
                    </th>
                    <th className="pb-6 md:px-4 px-1 text-gray-600 dark:text-gray-400 font-semibold uppercase text-xs tracking-wider">
                      Price
                    </th>
                    <th className="pb-6 md:px-4 px-1 text-gray-600 dark:text-gray-400 font-semibold uppercase text-xs tracking-wider">
                      Quantity
                    </th>
                    <th className="pb-6 md:px-4 px-1 text-gray-600 dark:text-gray-400 font-semibold uppercase text-xs tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {Object.keys(cartItems).map((itemId) => {
                    const product = products.find(product => product._id === itemId);
                    if (!product || cartItems[itemId] <= 0) return null;
                    const price = product.offerPrice || product.price;

                    return (
                      <tr key={itemId} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors">
                        <td className="flex items-center gap-4 py-6 md:px-4 px-1">
                          <div className="relative group">
                            <div className="rounded-xl overflow-hidden bg-gray-500/10 dark:bg-gray-800/40 p-2 transition-colors">
                              <Image
                                src={product.image?.[0] || assets.upload_area}
                                alt={product.name}
                                className="w-16 h-auto object-cover mix-blend-multiply dark:mix-blend-normal"
                                width={1280}
                                height={720}
                              />
                            </div>
                            <button
                              className="md:hidden absolute -top-2 -left-2 bg-red-100 dark:bg-red-900/50 text-red-600 p-1 rounded-full shadow-sm"
                              onClick={() => updateCartQuantity(product._id, 0)}
                            >
                              &times;
                            </button>
                          </div>
                          <div className="text-sm hidden md:block">
                            <p className="text-gray-900 dark:text-gray-100 font-medium">{product.name}</p>
                            <button
                              className="text-xs text-orange-600 dark:text-orange-500 hover:underline mt-1 font-medium"
                              onClick={() => updateCartQuantity(product._id, 0)}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                        <td className="py-6 md:px-4 px-1 text-gray-700 dark:text-gray-300 font-medium">
                          {process.env.NEXT_PUBLIC_CURRENCY || '₦'}{price}
                        </td>
                        <td className="py-6 md:px-4 px-1">
                          <div className="flex items-center md:gap-3 gap-2 bg-gray-50 dark:bg-gray-800 w-fit px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700">
                            <button onClick={() => updateCartQuantity(product._id, cartItems[itemId] - 1)} className="hover:scale-110 active:scale-95 transition">
                              <Image src={assets.decrease_arrow} alt="decrease" className="w-4 h-4 dark:invert" />
                            </button>
                            <input 
                              onChange={e => updateCartQuantity(product._id, Number(e.target.value))} 
                              type="number" 
                              value={cartItems[itemId]} 
                              className="w-10 bg-transparent text-center font-bold text-gray-900 dark:text-gray-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              min={1}
                            />
                            <button onClick={() => addToCart(product._id)} className="hover:scale-110 active:scale-95 transition">
                              <Image src={assets.increase_arrow} alt="increase" className="w-4 h-4 dark:invert" />
                            </button>
                          </div>
                        </td>
                        <td className="py-6 md:px-4 px-1 text-gray-900 dark:text-gray-100 font-bold">
                          {process.env.NEXT_PUBLIC_CURRENCY || '₦'}{(price * cartItems[itemId]).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          
          {getCartCount() > 0 && (
            <button onClick={()=> router.push('/all-products')} className="group flex items-center mt-8 gap-2 text-orange-600 dark:text-orange-500 font-semibold hover:underline transition-all">
              <Image className="group-hover:-translate-x-1 transition dark:invert" src={assets.arrow_right_icon_colored} alt="arrow" />
              Continue Shopping
            </button>
          )}
        </div>
        {getCartCount() > 0 && <OrderSummary />}
      </div>
    </>
  );
};

export default Cart;
