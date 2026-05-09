import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 dark:border-gray-800 text-gray-500 dark:text-gray-400">
        <div className="w-4/5">
          <Image className="w-28 md:w-32 dark:brightness-110" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm leading-relaxed">
            QuickCart is your ultimate destination for premium tech and lifestyle products. We combine AI-driven insights with a seamless shopping experience to bring you the best deals and personalized recommendations.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:text-blue-600 dark:hover:text-blue-400 transition" href="#">Home</a>
              </li>
              <li>
                <a className="hover:text-blue-600 dark:hover:text-blue-400 transition" href="#">About us</a>
              </li>
              <li>
                <a className="hover:text-blue-600 dark:hover:text-blue-400 transition" href="#">Contact us</a>
              </li>
              <li>
                <a className="hover:text-blue-600 dark:hover:text-blue-400 transition" href="#">Privacy policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+1-234-567-890</p>
              <p>support@quickcart.ai</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-6 text-center text-xs md:text-sm text-gray-500 dark:text-gray-500">
        Copyright 2026 © QuickCart. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;