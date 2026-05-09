import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router } = useAppContext();
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      // Get trending or highest viewed products
      const sorted = [...products].sort((a, b) => (b.stats?.sales || 0) - (a.stats?.sales || 0));
      setTrending(sorted);
    }
  }, [products]);

  return (
    <div className="flex flex-col items-center pt-14">
      <div className="w-full flex items-center justify-between mb-2">
        <p className="text-2xl font-semibold text-left text-gray-900 dark:text-gray-100">Popular Products</p>
        <button onClick={() => router.push('/all-products')} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
          View All
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-center gap-6 mt-6 pb-14 w-full">
        {trending.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomeProducts;
