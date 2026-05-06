'use client'
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";
import { Package, Truck, CheckCircle, XCircle } from "lucide-react";

const MyOrders = () => {
  const { userData, router, loading: authLoading } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!userData) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [userData, authLoading]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', { credentials: 'same-origin' });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Shipped': return <Truck className="w-5 h-5 text-blue-500" />;
      case 'Processing': return <Package className="w-5 h-5 text-orange-500" />;
      case 'Cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14 mb-20">
        <div className="flex flex-col items-center mb-12">
          <p className="text-3xl font-medium">My <span className="text-orange-600">Orders</span></p>
          <div className="w-24 h-0.5 bg-orange-600 mt-2"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center py-20">
            <Image src={assets.order_icon} alt="No orders" className="w-20 h-20 opacity-30 mb-4" />
            <p className="text-xl text-gray-400">No orders yet</p>
            <button 
              onClick={() => router.push('/all-products')} 
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-lg p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="font-medium">Order #{order._id?.slice(-8)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className={`font-medium ${
                      order.status === 'Delivered' ? 'text-green-600' :
                      order.status === 'Cancelled' ? 'text-red-600' :
                      order.status === 'Paid' ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Image 
                        src={item.product?.image?.[0] || assets.upload_area} 
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded"
                        width={64}
                        height={64}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product?.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">
                        {process.env.NEXT_PUBLIC_CURRENCY || '₦'}{((item.product?.offerPrice || item.product?.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 flex justify-between font-medium">
                  <span>Total</span>
                  <span>{process.env.NEXT_PUBLIC_CURRENCY || '₦'}{order.amount?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;