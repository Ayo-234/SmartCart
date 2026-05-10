'use client'
import { productsDummyData } from "@/assets/assets";
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Database, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

export default function SeedData() {
  const [status, setStatus] = useState('idle');
  const [count, setCount] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [deleted, setDeleted] = useState(0);
  const [overwrite, setOverwrite] = useState(true); // Default to true for "Update Mode"
  const [cleanup, setCleanup] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const seedProducts = async () => {
    setStatus('seeding');
    let seeded = 0;
    let skipCount = 0;
    let deleteCount = 0;
    setCount(0);
    setSkipped(0);
    setDeleted(0);
    
    try {
      if (cleanup) {
        const names = productsDummyData.map(p => p.name);
        const cleanRes = await fetch('/api/products', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ names, cleanup: true }),
        });
        const cleanData = await cleanRes.json();
        deleteCount = cleanData.deletedCount || 0;
        setDeleted(deleteCount);
      }

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
            stock: product.stock || Math.floor(Math.random() * 50) + 10,
            upsert: overwrite
          }),
        });
        
        if (res.ok) {
          seeded++;
          setCount(seeded);
        } else if (res.status === 409) {
          skipCount++;
          setSkipped(skipCount);
        }
      }
      
      setStatus('success');
      toast.success(`${seeded} products processed!`);
    } catch (err) {
      setStatus('error');
      toast.error('Failed to seed products');
      console.error(err);
    }
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Database size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Catalog Seeder</h1>
            <p className="text-sm text-gray-500">Inventory Management Tool</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Source Items</p>
            <p className="text-2xl font-black text-gray-800 dark:text-white">{productsDummyData.length}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Processed</p>
            <p className="text-2xl font-black text-blue-600">{count + skipped}</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {/* Update Toggle */}
          <div 
            onClick={() => status !== 'seeding' && setOverwrite(!overwrite)}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
              overwrite 
                ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800' 
                : 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800'
            }`}
          >
            <div className={`p-2 rounded-xl ${overwrite ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
              {overwrite ? <RefreshCw size={20} /> : <ShieldCheck size={20} />}
            </div>
            <div className="flex-1">
              <p className={`font-bold text-sm ${overwrite ? 'text-blue-800 dark:text-blue-400' : 'text-green-800 dark:text-green-400'}`}>
                {overwrite ? 'Update Existing' : 'Safe Mode (Skip)'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {overwrite ? 'Refreshes existing products' : 'Only adds missing products'}
              </p>
            </div>
            <div className={`w-10 h-6 rounded-full relative transition-colors ${overwrite ? 'bg-blue-400' : 'bg-green-400'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${overwrite ? 'left-5' : 'left-1'}`} />
            </div>
          </div>

          {/* Cleanup Toggle */}
          <div 
            onClick={() => status !== 'seeding' && setCleanup(!cleanup)}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
              cleanup 
                ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800' 
                : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
            }`}
          >
            <div className={`p-2 rounded-xl ${cleanup ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-600'}`}>
              <AlertCircle size={20} />
            </div>
            <div className="flex-1">
              <p className={`font-bold text-sm ${cleanup ? 'text-red-800 dark:text-red-400' : 'text-gray-800 dark:text-gray-400'}`}>
                Cleanup Legacy
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Delete products not in the new list
              </p>
            </div>
            <div className={`w-10 h-6 rounded-full relative transition-colors ${cleanup ? 'bg-red-400' : 'bg-gray-400'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${cleanup ? 'left-5' : 'left-1'}`} />
            </div>
          </div>
        </div>
        
        <button
          onClick={seedProducts}
          disabled={status === 'seeding'}
          className="w-full px-6 py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          {status === 'seeding' ? (
            <span className="flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin" size={18} />
              Seeding {count + skipped}/{productsDummyData.length}
            </span>
          ) : 'Populate Catalog'}
        </button>
        
        {status === 'success' && (
          <div className="mt-6 space-y-2">
            {deleted > 0 && (
              <div className="flex items-center justify-between text-sm p-3 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 rounded-xl font-medium">
                <span>Removed Legacy:</span>
                <span>{deleted}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-sm p-3 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 rounded-xl font-medium">
              <span>New / Updated:</span>
              <span>{count}</span>
            </div>
            <div className="flex items-center justify-between text-sm p-3 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 rounded-xl font-medium">
              <span>Skipped:</span>
              <span>{skipped}</span>
            </div>
          </div>
        )}

        {status === 'idle' && (
          <div className="mt-6 flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 rounded-xl text-xs">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <p>Ready to deploy 200 verified products. Manual additions are preserved unless "Cleanup Legacy" is enabled.</p>
          </div>
        )}
      </div>
    </div>
  );
}