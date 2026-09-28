import React from "react";

const Input = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`
        w-full px-4 py-2.5 rounded-full text-[15px] sm:text-[17px]
        bg-white dark:bg-[#1d1d1f]
        text-[#1d1d1f] dark:text-white
        border border-[#e0e0e0] dark:border-[#333336]
        placeholder:text-[#86868b]
        focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20
        transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    />
  );
};

export default Input;