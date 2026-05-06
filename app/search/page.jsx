'use client'
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Loading from "@/components/Loading";
import { Search, Sparkles } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { trackSearch, router } = useAppContext();
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiTerms, setAiTerms] = useState(null);

  useEffect(() => {
    if (query) {
      searchProducts();
      trackSearch(query);
    }
  }, [query]);

  const searchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&ai=true`);
      const data = await res.json();
      setResults(data.products || []);
      setAiTerms(data.aiTerms);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-8 mb-20">
        <div className="flex flex-col items-center mb-8">
          <p className="text-3xl font-medium">Search Results</p>
          <p className="text-gray-500 mt-2">
            Showing results for "<span className="font-semibold text-gray-700">{query}</span>"
            {aiTerms && aiTerms.length > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                <Sparkles size={12} /> AI Enhanced
              </span>
            )}
          </p>
        </div>

        {loading ? (
          <Loading />
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center py-20">
            <Search size={48} className="text-gray-300 mb-4" />
            <p className="text-xl text-gray-400">No products found</p>
            <button onClick={() => router.push('/all-products')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">
              Browse All Products
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">{results.length} products found</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {results.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loading /></div>}>
      <SearchContent />
    </Suspense>
  );
}