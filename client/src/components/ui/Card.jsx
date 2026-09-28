import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`
        p-6 rounded-[18px] bg-white dark:bg-[#272729]
        border border-[#e0e0e0] dark:border-[#333336]
        transition-colors duration-150
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
