'use client'
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { assets } from "@/assets/assets";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit, Package, DollarSign, Users, ShoppingCart, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const { isAdmin, router } = useAppContext();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', offerPrice: '', category: 'Laptop', image: '', aiTags: '', stock: 0
  });

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
      return;
    }
    fetchDashboard();
  }, [isAdmin]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/admin/dashboard', { credentials: 'same-origin' });
      const data = await res.json();
      setStats(data.stats);
      setOrders(data.recentOrders || []);
      setProducts(data.lowStockProducts || []);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          ...productForm,
          price: Number(productForm.price),
          offerPrice: Number(productForm.offerPrice) || Number(productForm.price),
          aiTags: productForm.aiTags.split(',').map(t => t.trim()).filter(Boolean),
          image: productForm.image ? [productForm.image] : [assets.upload_area.src],
        }),
      });
      if (res.ok) {
        toast.success('Product created!');
        setShowProductForm(false);
        setProductForm({ name: '', description: '', price: '', offerPrice: '', category: 'Laptop', image: '', aiTags: '', stock: 0 });
        fetchDashboard();
      } else {
        throw new Error('Failed');
      }
    } catch {
      toast.error('Failed to create product');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (res.ok) {
        toast.success('Product deleted');
        fetchDashboard();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-8">
        <h1 className="text-3xl font-medium mb-8">Admin <span className="text-orange-600">Dashboard</span></h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Package className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{stats?.totalProducts || 0}</p>
            <p className="text-gray-500 text-sm">Products</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <ShoppingCart className="w-8 h-8 text-orange-500 mb-2" />
            <p className="text-2xl font-bold">{stats?.totalOrders || 0}</p>
            <p className="text-gray-500 text-sm">Orders</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <Users className="w-8 h-8 text-green-500 mb-2" />
            <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
            <p className="text-gray-500 text-sm">Users</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <DollarSign className="w-8 h-8 text-purple-500 mb-2" />
            <p className="text-2xl font-bold">{process.env.NEXT_PUBLIC_CURRENCY || '₦'}{(stats?.totalRevenue || 0).toFixed(0)}</p>
            <p className="text-gray-500 text-sm">Revenue</p>
          </div>
        </div>

        {/* Low Stock Alert */}
        {products.length > 0 && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-8">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="font-medium text-red-600">Low Stock Alert</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {products.map((p) => (
                <div key={p._id} className="text-sm bg-white p-2 rounded">
                  {p.name}: <span className="text-red-500 font-bold">{p.stock} left</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Product Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Products</h2>
          <button 
            onClick={() => setShowProductForm(!showProductForm)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* Product Form */}
        {showProductForm && (
          <form onSubmit={handleProductSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <input 
                placeholder="Product Name" 
                value={productForm.name}
                onChange={e => setProductForm({...productForm, name: e.target.value})}
                className="border p-2 rounded"
                required
              />
              <input 
                placeholder="Description" 
                value={productForm.description}
                onChange={e => setProductForm({...productForm, description: e.target.value})}
                className="border p-2 rounded"
                required
              />
              <input 
                type="number"
                placeholder="Price" 
                value={productForm.price}
                onChange={e => setProductForm({...productForm, price: e.target.value})}
                className="border p-2 rounded"
                required
              />
              <input 
                type="number"
                placeholder="Offer Price" 
                value={productForm.offerPrice}
                onChange={e => setProductForm({...productForm, offerPrice: e.target.value})}
                className="border p-2 rounded"
              />
              <select 
                value={productForm.category}
                onChange={e => setProductForm({...productForm, category: e.target.value})}
                className="border p-2 rounded"
              >
                <option>Laptop</option>
                <option>Smartphone</option>
                <option>Earphone</option>
                <option>Headphone</option>
                <option>Camera</option>
                <option>Smartwatch</option>
                <option>Accessories</option>
              </select>
              <input 
                type="number"
                placeholder="Stock" 
                value={productForm.stock}
                onChange={e => setProductForm({...productForm, stock: e.target.value})}
                className="border p-2 rounded"
              />
              <input 
                placeholder="Image URL" 
                value={productForm.image}
                onChange={e => setProductForm({...productForm, image: e.target.value})}
                className="border p-2 rounded"
              />
              <input 
                placeholder="AI Tags (comma separated)" 
                value={productForm.aiTags}
                onChange={e => setProductForm({...productForm, aiTags: e.target.value})}
                className="border p-2 rounded"
              />
            </div>
            <button type="submit" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save Product
            </button>
          </form>
        )}

        {/* Recent Orders */}
        <h2 className="text-xl font-medium mb-4 mt-8">Recent Orders</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">Order</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="p-4">#{order._id?.slice(-8)}</td>
                  <td className="p-4">{order.userId?.name || 'Guest'}</td>
                  <td className="p-4 font-medium">{process.env.NEXT_PUBLIC_CURRENCY || '₦'}{order.amount?.toFixed(2)}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-sm">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}