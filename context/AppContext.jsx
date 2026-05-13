'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

function getSessionId() {
  if (typeof window === 'undefined') return 'ssr';
  let sid = localStorage.getItem('qc_session_id');
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem('qc_session_id', sid);
  }
  return sid;
}

export const AppContextProvider = (props) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || '₦';
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [authChecked, setAuthChecked] = useState(false); // To track if we've attempted to fetch user at least once
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dark mode persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('qc_dark_mode');
    if (savedTheme === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'false') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newVal = !prev;
      localStorage.setItem('qc_dark_mode', newVal);
      if (newVal) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newVal;
    });
  };

  // Fetch current user on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        setUserData(data.user);
        setIsAdmin(data.user.role === 'admin');
        // Fetch persistent cart
        fetchCart();
      } else {
        setUserData(null);
        setIsAdmin(false);
        // Load local cart for guests
        const localCart = localStorage.getItem('qc_guest_cart');
        if (localCart) setCartItems(JSON.parse(localCart));
      }
    } catch {
      setUserData(null);
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart', { credentials: 'same-origin' });
      if (res.ok) {
        const data = await res.json();
        const cart = data.cartItems || {};
        // Handle both Map and plain object from backend
        const plainCart = cart instanceof Map ? Object.fromEntries(cart) : cart;
        setCartItems(plainCart);
      }
    } catch (err) {
      console.error('Fetch cart error:', err);
    }
  };

  const fetchProductData = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const addToCart = async (itemId) => {
    if (userData) {
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ productId: itemId, quantity: 1 }),
        });
        if (res.ok) {
          const data = await res.json();
          const plainCart = data.cartItems instanceof Map ? Object.fromEntries(data.cartItems) : data.cartItems;
          setCartItems(plainCart || {});
          toast.success('Added to cart');
        }
      } catch {
        toast.error('Failed to add to cart');
      }
    } else {
      // Guest cart stored in localStorage
      let cartData = structuredClone(cartItems);
      cartData[itemId] = (cartData[itemId] || 0) + 1;
      setCartItems(cartData);
      localStorage.setItem('qc_guest_cart', JSON.stringify(cartData));
      toast.success('Added to cart');
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    if (userData) {
      try {
        const res = await fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ productId: itemId, quantity }),
        });
        if (res.ok) {
          const data = await res.json();
          const plainCart = data.cartItems instanceof Map ? Object.fromEntries(data.cartItems) : data.cartItems;
          setCartItems(plainCart || {});
        }
      } catch {
        toast.error('Failed to update cart');
      }
    } else {
      let cartData = structuredClone(cartItems);
      if (quantity === 0) {
        delete cartData[itemId];
      } else {
        cartData[itemId] = quantity;
      }
      setCartItems(cartData);
      localStorage.setItem('qc_guest_cart', JSON.stringify(cartData));
    }
  };

  const clearCart = async () => {
    if (userData) {
      try {
        await fetch('/api/cart', {
          method: 'DELETE',
          credentials: 'same-origin',
        });
      } catch {
        // ignore
      }
    }
    setCartItems({});
    localStorage.removeItem('qc_guest_cart');
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      if (cartItems[items] > 0) {
        totalCount += cartItems[items];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (cartItems[items] > 0 && itemInfo) {
        const price = itemInfo.offerPrice || itemInfo.price;
        totalAmount += price * cartItems[items];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } catch {
      // ignore
    }
    setUserData(null);
    setIsAdmin(false);
    setCartItems({});
    localStorage.removeItem('qc_guest_cart');
    localStorage.removeItem('qc_session_id');
    toast.success('Logged out');
    router.push('/');
  };

  const trackInteraction = async (productId, actionType, metadata = {}) => {
    try {
      await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          productId,
          actionType,
          metadata,
        }),
      });
    } catch {
      // Silent fail for analytics
    }
  };

  const trackSearch = async (query) => {
    try {
      await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          actionType: 'search',
          searchQuery: query,
          productId: null,
          userId: userData?._id || null
        }),
      });
    } catch {
      // Silent fail
    }
  };

  const formatPrice = (price) => {
    return Number(price).toLocaleString('en-GB', {
      maximumFractionDigits: 0
    });
  };

  const value = {
    currency, router,
    isAdmin, setIsAdmin,
    userData, fetchUserData,
    products, fetchProductData,
    cartItems, setCartItems,
    addToCart, updateCartQuantity, clearCart,
    getCartCount, getCartAmount,
    searchQuery, setSearchQuery,
    logout,
    trackInteraction,
    trackSearch,
    loading,
    isDarkMode, toggleDarkMode,
    formatPrice,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
