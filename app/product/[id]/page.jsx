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
        <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="px-5 lg:px-16 xl:px-20">
                    <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
                        <Image
                            src={mainImage || productData.image?.[0] || assets.upload_area}
                            alt={productData.name}
                            className="w-full h-auto object-cover mix-blend-multiply"
                            width={1280}
                            height={720}
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {(productData.image || []).map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setMainImage(image)}
                                className={`cursor-pointer rounded-lg overflow-hidden bg-gray-500/10 border-2 ${mainImage === image ? 'border-blue-500' : 'border-transparent'}`}
                            >
                                <Image
                                    src={image}
                                    alt={`${productData.name} ${index}`}
                                    className="w-full h-auto object-cover mix-blend-multiply"
                                    width={1280}
                                    height={720}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
                        {productData.name}
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                            {[1,2,3,4].map((_, i) => (
                                <Image key={i} className="h-4 w-4" src={assets.star_icon} alt="star" />
                            ))}
                            <Image className="h-4 w-4" src={assets.star_dull_icon} alt="star" />
                        </div>
                        <p>({productData.rating || 4.5})</p>
                    </div>
                    <p className="text-gray-600 mt-3">
                        {productData.description}
                    </p>
                    <p className="text-3xl font-medium mt-6">
                        {process.env.NEXT_PUBLIC_CURRENCY || '₦'}{productData.offerPrice || productData.price}
                        {productData.offerPrice ? (
                            <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                                {process.env.NEXT_PUBLIC_CURRENCY || '₦'}{productData.price}
                            </span>
                        ) : null}
                    </p>
                    {productData.stock !== undefined && (
                        <p className={`text-sm mt-2 font-medium ${productData.stock > 5 ? 'text-green-600' : productData.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                            {productData.stock > 5 ? 'In Stock' : productData.stock > 0 ? `Only ${productData.stock} left` : 'Out of Stock'}
                        </p>
                    )}
                    <hr className="bg-gray-600 my-6" />
                    <div className="overflow-x-auto">
                        <table className="table-auto border-collapse w-full max-w-72">
                            <tbody>
                                <tr>
                                    <td className="text-gray-600 font-medium">Brand</td>
                                    <td className="text-gray-800/50">{productData.name?.split(' ')[0] || 'Generic'}</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Category</td>
                                    <td className="text-gray-800/50">{productData.category}</td>
                                </tr>
                                {productData.aiTags?.length > 0 && (
                                    <tr>
                                        <td className="text-gray-600 font-medium">Tags</td>
                                        <td className="text-gray-800/50">{productData.aiTags.join(', ')}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center mt-10 gap-4">
                        <button 
                            onClick={handleAddToCart} 
                            disabled={productData.stock === 0}
                            className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add to Cart
                        </button>
                        <button 
                            onClick={handleBuyNow} 
                            disabled={productData.stock === 0}
                            className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 mt-16">
                    <p className="text-3xl font-medium">Related <span className="font-medium text-orange-600">Products</span></p>
                    <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
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
