'use client'
import { productsDummyData } from "@/assets/assets";
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function SeedData() {
  const [status, setStatus] = useState('idle');
  const [count, setCount] = useState(0);

  const seedProducts = async () => {
    setStatus('seeding');
    let seeded = 0;
    
    try {
      for (const product of productsDummyData) {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: product.name,
            description: product.description,
            price: product.price,
            offerPrice: product.offerPrice || product.price,
            category: product.category,
            image: product.image,
            aiTags: product.category ? [product.category.toLowerCase()] : [],
            stock: Math.floor(Math.random() * 50) + 10,
            stats: { views: Math.floor(Math.random() * 100), sales: Math.floor(Math.random() * 20) },
          }),
        });
        
        if (res.ok) seeded++;
        setCount(seeded);
      }
      
      setStatus('success');
      toast.success(`${seeded} products seeded!`);
    } catch (err) {
      setStatus('error');
      toast.error('Failed to seed products');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-2">QuickCart Database Seeder</h1>
        <p className="text-gray-600 mb-6">Seed products from existing data</p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500">Products to seed:</p>
          <p className="text-3xl font-bold text-blue-600">{productsDummyData.length}</p>
        </div>
        
        <button
          onClick={seedProducts}
          disabled={status === 'seeding' || status === 'success'}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {status === 'seeding' ? `Seeding ${count}/${productsDummyData.length}...` : 
           status === 'success' ? `${count} Products Seeded!` : 
           'Seed Products'}
        </button>
        
        {status === 'success' && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
            ✅ Successfully seeded {count} products!
          </div>
        )}
      </div>
    </div>
  );
}