'use client';
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { productsDummyData } from '@/assets/assets';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

const categories = ['Earphone', 'Headphone', 'Smartphone', 'Laptop', 'Camera', 'Accessories', 'Watch', 'Fashion', 'Home Decor', 'Kitchen', 'Beauty', 'Fitness', 'Furniture'];

const emptyForm = { name: '', description: '', price: '', category: '', image: '', stock: '', aiTags: '' };

export default function AdminProductsPage() {
  const { currency, isAdmin, router } = useAppContext();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (!isAdmin) {
      router.push('/');
      return;
    }
    fetchProducts();
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => { setForm(emptyForm); setEditProduct(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      image: Array.isArray(p.image) ? p.image[0] : p.image,
      stock: p.stock || '',
      aiTags: (p.aiTags || []).join(', '),
    });
    setEditProduct(p);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (res.ok) {
        toast.success('Product deleted');
        fetchProducts();
      } else {
        throw new Error('Failed');
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category || !form.image) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        offerPrice: parseFloat(form.price),
        stock: parseInt(form.stock || '0'),
        image: [form.image],
        aiTags: form.aiTags.split(',').map(t => t.trim()).filter(Boolean),
      };

      const url = editProduct ? `/api/products/${editProduct._id}` : '/api/products';
      const method = editProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editProduct ? 'Product updated!' : 'Product added!');
        setShowForm(false);
        fetchProducts();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Products</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{products.length} total products</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Product Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400">
                    <Package size={40} className="mx-auto mb-2 opacity-30" />
                    No products found
                  </td>
                </tr>
              ) : filtered.map(p => (
                <tr key={p._id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                        <Image
                          src={Array.isArray(p.image) ? p.image[0] : p.image}
                          alt={p.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100 truncate max-w-[180px]">{p.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[180px]">{p.description?.slice(0, 50)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full text-xs font-medium">{p.category}</span>
                  </td>
                  <td className="p-4 font-semibold text-gray-800 dark:text-gray-100">{currency}{p.offerPrice || p.price}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{p.stock ?? 'N/A'}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-transparent dark:border-gray-800">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Product Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 dark:text-white" placeholder="e.g. Apple AirPods Pro" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 dark:text-white resize-none" placeholder="Product description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Price (₦) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} required min="0"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 dark:text-white" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Stock</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} min="0"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 dark:text-white" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                <select name="category" value={form.category} onChange={handleChange} required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 dark:text-white">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Image URL *</label>
                <input name="image" value={form.image} onChange={handleChange} required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 dark:text-white" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">AI Tags <span className="text-gray-400 font-normal dark:text-gray-500">(comma separated)</span></label>
                <input name="aiTags" value={form.aiTags} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800 dark:text-white" placeholder="e.g. wireless, earbuds, premium" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-60">
                  {submitting ? 'Saving...' : (editProduct ? 'Save Changes' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
