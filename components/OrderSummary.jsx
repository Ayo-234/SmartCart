import { useAppContext } from "@/context/AppContext";
import React, { useState } from "react";
import toast from "react-hot-toast";

const OrderSummary = () => {
  const { currency, router, getCartCount, getCartAmount, userData, cartItems, products, clearCart, loading: authLoading } = useAppContext();
  const [address, setAddress] = useState({
    fullName: '',
    phoneNumber: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const tax = Math.floor(getCartAmount() * 0.02 * 100) / 100;
  const total = Math.floor((getCartAmount() + tax) * 100) / 100;

  const handleCheckout = async () => {
    if (authLoading) return;

    if (!userData) {
      toast.error('Please sign in to checkout');
      router.push('/login');
      return;
    }

    if (getCartCount() === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!address.fullName || !address.phoneNumber || !address.area || !address.city || !address.state) {
      toast.error('Please fill in all address fields');
      return;
    }

    setLoading(true);

    try {
      // Initialize Paystack payment
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          email: userData.email,
          amount: total,
          metadata: {
            address,
            cartItems,
            callback_url: typeof window !== 'undefined' ? `${window.location.origin}/order-placed` : '/order-placed',
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment initialization failed');

      // Store order draft in localStorage for after-payment processing
      localStorage.setItem('qc_pending_order', JSON.stringify({
        items: Object.entries(cartItems).map(([productId, quantity]) => {
          const product = products.find(p => p._id === productId);
          return { product: { ...product, _id: productId }, quantity };
        }),
        amount: total,
        address,
        reference: data.reference,
      }));

      // Redirect to Paystack
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />

      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Shipping Address
          </label>
          <div className="space-y-3">
            <input name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleChange} className="w-full border p-2 text-sm outline-none focus:border-blue-500" />
            <input name="phoneNumber" placeholder="Phone Number" value={address.phoneNumber} onChange={handleChange} className="w-full border p-2 text-sm outline-none focus:border-blue-500" />
            <input name="area" placeholder="Street / Area" value={address.area} onChange={handleChange} className="w-full border p-2 text-sm outline-none focus:border-blue-500" />
            <div className="grid grid-cols-2 gap-2">
              <input name="city" placeholder="City" value={address.city} onChange={handleChange} className="w-full border p-2 text-sm outline-none focus:border-blue-500" />
              <input name="state" placeholder="State" value={address.state} onChange={handleChange} className="w-full border p-2 text-sm outline-none focus:border-blue-500" />
            </div>
            <input name="pincode" placeholder="Postal Code (Optional)" value={address.pincode} onChange={handleChange} className="w-full border p-2 text-sm outline-none focus:border-blue-500" />
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">{currency}{getCartAmount().toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">{currency}{tax.toFixed(2)}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{currency}{total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={handleCheckout} 
        disabled={loading || authLoading || getCartCount() === 0}
        className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : authLoading ? 'Checking Auth...' : 'Proceed to Payment'}
      </button>

      {!userData && !authLoading && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          You need to <button onClick={() => router.push('/login')} className="text-blue-600 underline">sign in</button> to checkout
        </p>
      )}
    </div>
  );
};

export default OrderSummary;
