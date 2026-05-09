import React from "react";

const NewsLetter = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-3 pt-8 pb-14 transition-colors duration-300">
      <h1 className="md:text-4xl text-2xl font-bold text-gray-900 dark:text-gray-100">
        Subscribe now & get 20% off
      </h1>
      <p className="md:text-base text-gray-500/80 dark:text-gray-400 pb-8 max-w-lg">
        Join our newsletter to receive the latest updates, exclusive deals, and personalized AI tech tips.
      </p>
      <div className="flex items-center justify-between max-w-2xl w-full md:h-14 h-12 shadow-sm rounded-xl overflow-hidden">
        <input
          className="border border-gray-500/30 dark:border-gray-700 h-full border-r-0 outline-none w-full px-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
          type="email"
          placeholder="Enter your email address"
        />
        <button className="md:px-12 px-8 h-full text-white bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 font-semibold transition-colors">
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default NewsLetter;
