'use client';
import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Sparkles, TrendingUp } from 'lucide-react';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [recType, setRecType] = useState('trending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const sid = getOrCreateSessionId();
      const userRes = await fetch('/api/auth/me', { credentials: 'same-origin' });
      let url = `/api/recommendations?sessionId=${sid}`;
      if (userRes.ok) {
        const userData = await userRes.json();
        url += `&userId=${userData.user._id}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setRecommendations(data.products || []);
      setRecType(data.type || 'trending');
    } catch {
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center pt-14">
        <div className="w-full flex items-center justify-between mb-6">
          <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded w-56 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-52 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  const isAI = recType === 'ai-personalized';

  return (
    <div className="flex flex-col items-center pt-14">
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          {isAI ? (
            <Sparkles className="text-purple-500" size={22} />
          ) : (
            <TrendingUp className="text-orange-500" size={22} />
          )}
          <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {isAI ? 'Recommended for You' : 'Trending Right Now'}
          </p>
        </div>
        {isAI && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full">
            <Sparkles size={12} /> AI Personalized
          </span>
        )}
      </div>

      <div className="w-full flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory transition-all scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {Array.from({ length: Math.ceil(recommendations.length / 2) }).map((_, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-6 flex-shrink-0 snap-start w-[180px] md:w-[220px]">
            {recommendations.slice(colIndex * 2, colIndex * 2 + 2).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

function getOrCreateSessionId() {
  if (typeof window === 'undefined') return 'ssr';
  let sid = localStorage.getItem('qc_session_id');
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem('qc_session_id', sid);
  }
  return sid;
}

export default AIRecommendations;