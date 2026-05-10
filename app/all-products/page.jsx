'use client'
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";
import Image from "next/image";

const AllProducts = () => {
  const { products, router } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("");
  
  const categories = ["All", "Fashion", "Home Decor", "Kitchen", "Beauty", "Fitness", "Furniture", "Laptop", "Smartphone", "Earphone", "Headphone", "Camera", "Accessories", "Watch"];

  useEffect(() => {
    if (products.length > 0) {
      if (!category || category === "All") {
        setFilteredProducts(products);
      } else {
        setFilteredProducts(products.filter(p => p.category === category));
      }
    }
  }, [products, category]);

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-8 mb-20">
        <div className="flex flex-col items-center mb-12">
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">All <span className="text-orange-600">Products</span></p>
          <div className="w-24 h-0.5 bg-orange-600 dark:bg-orange-500 mt-2"></div>
        </div>

        {/* Category Filter - Scrollable */}
        <div className="flex overflow-x-auto gap-3 mb-10 pb-4 no-scrollbar snap-x snap-mandatory">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat === "All" ? "" : cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition snap-start shadow-sm border ${
                (category === cat || (cat === "All" && !category))
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent"
                  : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center py-20">
            <Image src={assets.product_list_icon} alt="No products" className="w-20 h-20 opacity-30 mb-4 dark:invert" />
            <p className="text-xl text-gray-400 dark:text-gray-500">No products found</p>
            <button 
              onClick={() => { setCategory(""); router.push('/all-products'); }} 
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;