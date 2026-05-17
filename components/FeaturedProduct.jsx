import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";
import Image from "next/image";

const FeaturedProduct = () => {
  const { products, router } = useAppContext();

  // Get top 3 rated products as featured
  const featured = [...products]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium text-gray-900 dark:text-gray-100">Featured Products</p>
        <div className="w-28 h-0.5 bg-orange-600 dark:bg-orange-500 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
        {featured.map((product) => (
          <div key={product._id} onClick={() => router.push(`/product/${product._id}`)} className="cursor-pointer relative group overflow-hidden rounded-xl shadow-lg border border-transparent dark:border-gray-800 h-[300px]">
            <Image
              src={product.image?.[0] || assets.upload_area}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="group-hover:scale-110 group-hover:brightness-75 transition duration-500 object-cover"
            />
            <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2 drop-shadow-lg z-10">
              <p className="font-bold text-xl lg:text-2xl">{product.name}</p>
              <p className="text-sm lg:text-base leading-5 max-w-60 font-medium opacity-90 line-clamp-2">
                {product.description}
              </p>
              <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 px-5 py-2.5 rounded-full font-semibold transition-colors shadow-md text-sm">
                Buy now <Image className="h-3 w-3" src={assets.redirect_icon} alt="Redirect Icon" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
