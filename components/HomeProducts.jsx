import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {
  const { products, router } = useAppContext();
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      // Calculate popularity score: (sales * 5) + (views * 1) + (rating * 2)
      const scored = products.map(p => ({
        ...p,
        _score: ((p.stats?.sales || 0) * 5) + ((p.stats?.views || 0) * 1) + ((p.rating || 4.5) * 2)
      }));

      // Sort by score
      const sorted = scored.sort((a, b) => b._score - a._score);

      // Take top 30 most popular
      const top30 = sorted.slice(0, 30);

      // Shuffle the top 30 to make it feel fresh on each load
      const shuffled = [...top30].sort(() => Math.random() - 0.5);

      setTrending(shuffled);
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
      <div className="w-full flex overflow-x-auto gap-6 mt-6 pb-6 snap-x snap-mandatory transition-all scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {Array.from({ length: Math.ceil(trending.slice(0, 40).length / 2) }).map((_, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-6 flex-shrink-0 snap-start w-[180px] md:w-[220px]">
            {trending.slice(colIndex * 2, colIndex * 2 + 2).map((product, pIndex) => (
              <ProductCard key={pIndex} product={product} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeProducts;
