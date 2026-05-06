import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product }) => {
    const { currency, router } = useAppContext();
    const price = product.offerPrice || product.price;
    const originalPrice = product.offerPrice ? product.price : null;

    return (
        <div
            onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
            className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
        >
            <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center overflow-hidden">
                <Image
                    src={product.image?.[0] || assets.upload_area}
                    alt={product.name}
                    className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
                    width={800}
                    height={800}
                />
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-white text-red-600 px-3 py-1 text-xs font-bold rounded-full">Out of Stock</span>
                    </div>
                )}
                <button 
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:scale-110 transition"
                    onClick={(e) => { e.stopPropagation(); }}
                >
                    <Image className="h-3 w-3" src={assets.heart_icon} alt="wishlist" />
                </button>
            </div>

            <p className="md:text-base font-medium pt-2 w-full truncate">{product.name}</p>
            <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">{product.category}</p>
            <div className="flex items-center gap-2">
                <p className="text-xs">{product.rating || 4.5}</p>
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Image
                            key={index}
                            className="h-3 w-3"
                            src={index < Math.floor(product.rating || 4.5) ? assets.star_icon : assets.star_dull_icon}
                            alt="star"
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-end justify-between w-full mt-1 gap-2">
                <div className="flex items-center gap-1.5">
                    <p className="text-base font-medium">{currency}{price}</p>
                    {originalPrice && (
                        <p className="text-xs text-gray-400 line-through">{currency}{originalPrice}</p>
                    )}
                </div>
                <button 
                    className="max-sm:hidden px-3 py-1 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition"
                    onClick={(e) => { e.stopPropagation(); router.push('/product/' + product._id); }}
                >
                    Buy now
                </button>
            </div>
        </div>
    )
}

export default ProductCard
