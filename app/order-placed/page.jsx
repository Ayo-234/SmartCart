'use client'
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import { CheckCircle, Package, Truck, Home } from "lucide-react";

function OrderPlacedContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') || '';
  const { userData, clearCart } = useAppContext();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    processOrder();
  }, []);

  const processOrder = async () => {
    setLoading(true);
    try {
      if (reference) {
        const res = await fetch(`/api/paystack/verify?reference=${reference}`);
        const data = await res.json();
        
        if (data.status === 'success') {
          const pending = localStorage.getItem('qc_pending_order');
          if (pending) {
            const orderData = JSON.parse(pending);
            await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'same-origin',
              body: JSON.stringify({
                items: orderData.items,
                amount: orderData.amount,
                address: orderData.address,
                paymentDetails: { reference, status: 'success', paidAt: new Date() },
              }),
            });
            clearCart();
            localStorage.removeItem('qc_pending_order');
            setOrder(orderData);
          }
        } else {
          toast.error('Payment verification failed');
        }
      } else {
        const pending = localStorage.getItem('qc_pending_order');
        if (pending) {
          const orderData = JSON.parse(pending);
          await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({
              items: orderData.items,
              amount: orderData.amount,
              address: orderData.address,
              paymentDetails: { status: 'pending' },
            }),
          });
          clearCart();
          localStorage.removeItem('qc_pending_order');
          setOrder(orderData);
        }
      }
    } catch (err) {
      console.error('Order processing error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 md:px-16 lg:px-32 pt-14 mb-20">
      {loading ? (
        <div className="flex flex-col items-center py-20">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl text-gray-600">Processing your order...</p>
        </div>
      ) : order ? (
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <p className="text-3xl font-medium mt-4">Order Placed!</p>
            <p className="text-gray-500 mt-2">Thank you for your purchase</p>
            {reference && <p className="text-sm text-gray-400 mt-2">Ref: {reference}</p>}
          </div>
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="font-medium mb-4 flex items-center gap-2"><Package size={18} /> Order Details</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.product?.name} x {item.quantity}</span>
                  <span className="font-medium">{process.env.NEXT_PUBLIC_CURRENCY || '₦'}{((item.product?.offerPrice || item.product?.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-medium">
              <span>Total</span>
              <span>{process.env.NEXT_PUBLIC_CURRENCY || '₦'}{order.amount?.toFixed(2)}</span>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="font-medium mb-4 flex items-center gap-2"><Home size={18} /> Shipping Address</h3>
            <p className="text-sm text-gray-600">{order.address?.fullName}<br />{order.address?.area}<br />{order.address?.city}, {order.address?.state}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={() => window.location.href = '/my-orders'} className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">View My Orders</button>
            <button onClick={() => window.location.href = '/'} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Continue Shopping</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-20">
          <p className="text-xl text-gray-400">Order not found</p>
          <button onClick={() => window.location.href = '/'} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">Go Home</button>
        </div>
      )}
    </div>
  );
}

export default function OrderPlaced() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div></div>}>
        <OrderPlacedContent />
      </Suspense>
      <Footer />
    </>
  );
}