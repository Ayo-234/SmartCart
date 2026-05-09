import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 bg-[#E6E9F2] dark:bg-gray-900 my-16 rounded-xl overflow-hidden transition-colors duration-300">
      <Image
        className="max-w-56 object-contain"
        src={assets.jbl_soundbox_image}
        alt="jbl_soundbox_image"
      />
      <div className="flex flex-col items-center justify-center text-center space-y-4 px-4 md:px-0 py-10 md:py-14">
        <h2 className="text-2xl md:text-4xl font-bold max-w-[350px] text-gray-900 dark:text-white leading-tight">
          Level Up Your Gaming Experience
        </h2>
        <p className="max-w-[343px] font-medium text-gray-800/60 dark:text-gray-400">
          From immersive sound to precise controls—everything you need to win
        </p>
        <button className="group flex items-center justify-center gap-2 px-12 py-3 bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 rounded-full text-white font-semibold transition-all">
          Buy now
          <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon_white} alt="arrow_icon_white" />
        </button>
      </div>
      <Image
        className="hidden md:block max-w-80 object-contain"
        src={assets.md_controller_image}
        alt="md_controller_image"
      />
      <Image
        className="md:hidden max-w-64 object-contain"
        src={assets.sm_controller_image}
        alt="sm_controller_image"
      />
    </div>
  );
};

export default Banner;