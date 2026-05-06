import React from 'react';
import Link from 'next/link';
import { Package, Users, Settings, Home, Activity } from 'lucide-react';

export const metadata = {
  title: 'Admin Dashboard | QuickCart',
  description: 'Manage products, users, and settings',
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="text-xl font-bold text-blue-600">QuickCart Admin</Link>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-700 bg-blue-50 text-blue-600 rounded-lg transition-colors font-medium">
            <Activity size={20} />
            Dashboard
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
            <Package size={20} />
            Products
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
            <Users size={20} />
            Users
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
            <Settings size={20} />
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
            <Home size={20} />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:hidden">
          <span className="font-bold text-blue-600">Admin</span>
          <Link href="/" className="text-sm text-gray-600">Back to Store</Link>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
