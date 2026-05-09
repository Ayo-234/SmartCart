"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import toast from "react-hot-toast";

const Product = () => {
    const { id } = useParams();
    const { products, router, addToCart, trackInteraction } = useAppContext();

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (products.length > 0) {
            const product = products.find(p => p._id === id);
            if (product) {
                setProductData(product);
                setMainImage(product.image?.[0] || '');
                setLoading(false);
                // Track view
                trackInteraction(id, 'view');
            } else {
                // Try fetching single product from API
                fetchSingleProduct();
            }
        } else if (id) {
            fetchSingleProduct();
        }
    }, [id, products.length]);

    const fetchSingleProduct = async () => {
        try {
            const res = await fetch(`/api/products/${id}`);
            if (res.ok) {
                const data = await res.json();
                setProductData(data.product);
                setMainImage(data.product.image?.[0] || '');
                trackInteraction(id, 'view');
            } else {
                toast.error('Product not found');
                router.push('/all-products');
            }
        } catch {
            toast.error('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        addToCart(productData._id);
        trackInteraction(productData._id, 'add_to_cart');
    };

    const handleBuyNow = () => {
        addToCart(productData._id);
        trackInteraction(productData._id, 'add_to_cart');
        router.push('/cart');
    };

    if (loading) return <Loading />;
    if (!productData) return <Loading />;

    return (<>
        <Navbar />
        <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10 transition-colors duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="px-5 lg:px-16 xl:px-20">
                    <div className="rounded-2xl overflow-hidden bg-gray-500/10 dark:bg-gray-800/40 mb-4 transition-colors">
                        <Image
                            src={mainImage || productData.image?.[0] || assets.upload_area}
                            alt={productData.name}
                            className="w-full h-auto object-cover dark:mix-blend-normal mix-blend-multiply"
                            width={1280}
                            height={720}
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {(productData.image || []).map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setMainImage(image)}
                                className={`cursor-pointer rounded-xl overflow-hidden bg-gray-500/10 dark:bg-gray-800/40 border-2 transition-all ${mainImage === image ? 'border-blue-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                            >
                                <Image
                                    src={image}
                                    alt={`${productData.name} ${index}`}
                                    className="w-full h-auto object-cover dark:mix-blend-normal mix-blend-multiply"
                                    width={1280}
                                    height={720}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
                        {productData.name}
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-0.5">
                            {[1,2,3,4].map((_, i) => (
                                <Image key={i} className="h-4 w-4" src={assets.star_icon} alt="star" />
                            ))}
                            <Image className="h-4 w-4" src={assets.star_dull_icon} alt="star" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">({productData.rating || 4.5})</p>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-5 leading-relaxed text-lg">
                        {productData.description}
                    </p>
                    <p className="text-4xl font-bold mt-8 text-gray-900 dark:text-gray-100 flex items-baseline gap-3">
                        {process.env.NEXT_PUBLIC_CURRENCY || '₦'}{productData.offerPrice || productData.price}
                        {productData.offerPrice ? (
                            <span className="text-lg font-normal text-gray-400 line-through">
                                {process.env.NEXT_PUBLIC_CURRENCY || '₦'}{productData.price}
                            </span>
                        ) : null}
                    </p>
                    {productData.stock !== undefined && (
                        <p className={`text-sm mt-3 font-semibold px-3 py-1 rounded-full w-fit ${productData.stock > 5 ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : productData.stock > 0 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>
                            {productData.stock > 5 ? '● In Stock' : productData.stock > 0 ? `● Only ${productData.stock} left in stock` : '● Out of Stock'}
                        </p>
                    )}
                    <hr className="border-gray-200 dark:border-gray-800 my-8" />
                    <div className="overflow-x-auto">
                        <table className="table-auto border-collapse w-full max-w-sm">
                            <tbody className="text-sm">
                                <tr className="border-b border-transparent">
                                    <td className="py-2 text-gray-500 dark:text-gray-400 font-medium w-1/3">Brand</td>
                                    <td className="py-2 text-gray-800 dark:text-gray-200">{productData.name?.split(' ')[0] || 'Generic'}</td>
                                </tr>
                                <tr className="border-b border-transparent">
                                    <td className="py-2 text-gray-500 dark:text-gray-400 font-medium">Category</td>
                                    <td className="py-2 text-gray-800 dark:text-gray-200">{productData.category}</td>
                                </tr>
                                {productData.aiTags?.length > 0 && (
                                    <tr>
                                        <td className="py-2 text-gray-500 dark:text-gray-400 font-medium">AI Tags</td>
                                        <td className="py-2 flex flex-wrap gap-1.5">
                                            {productData.aiTags.map(tag => (
                                                <span key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs text-gray-600 dark:text-gray-400">{tag}</span>
                                            ))}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center mt-12 gap-5">
                        <button 
                            onClick={handleAddToCart} 
                            disabled={productData.stock === 0}
                            className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-transparent dark:border-gray-700"
                        >
                            Add to Cart
                        </button>
                        <button 
                            onClick={handleBuyNow} 
                            disabled={productData.stock === 0}
                            className="flex-1 py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-600/20"
                        >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center mb-8 mt-20">
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">Related <span className="text-orange-600">Products</span></p>
                    <div className="w-28 h-0.5 bg-orange-600 dark:bg-orange-500 mt-2"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-20 w-full">
                    {products.filter(p => p.category === productData.category && p._id !== productData._id).slice(0, 5).map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>
            </div>
        </div>
        <Footer />
    </>
    );
};

export default Product;
