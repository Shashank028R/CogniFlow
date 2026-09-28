import React from "react";

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-normal transition-all duration-150 cursor-pointer select-none active:scale-[0.95] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants = {
    // Signature Apple primary blue pill CTA
    primary: "bg-[#0066cc] hover:bg-[#0071e3] text-white rounded-full px-5 py-2.5 text-[15px] sm:text-[17px] tracking-[-0.022em]",
    // Apple secondary ghost pill
    secondary: "bg-transparent text-[#0066cc] dark:text-[#2997ff] border border-[#0066cc] dark:border-[#2997ff] rounded-full px-5 py-2.5 text-[15px] sm:text-[17px] tracking-[-0.022em] hover:bg-[#0066cc]/5",
    // Apple dark utility button (8px radius)
    "dark-utility": "bg-[#1d1d1f] hover:bg-[#272729] dark:bg-[#333336] dark:hover:bg-[#424245] text-white rounded-[8px] px-3.5 py-2 text-[14px] tracking-[-0.015em]",
    // Pearl capsule button (11px radius)
    pearl: "bg-[#fafafc] hover:bg-[#f5f5f7] dark:bg-[#272729] dark:hover:bg-[#333336] text-[#1d1d1f] dark:text-white border border-[#e0e0e0] dark:border-[#333336] rounded-[11px] px-3.5 py-1.5 text-[14px]",
    // Danger button for deletion actions
    danger: "bg-[#e30000] hover:bg-[#ff1a1a] text-white rounded-full px-5 py-2.5 text-[15px] sm:text-[17px]",
  };

  const selectedVariant = variants[variant] || variants.primary;

  return (
    <button
      {...props}
      className={`${baseStyles} ${selectedVariant} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
