import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`
        p-6 sm:p-8 rounded-xl bg-white dark:bg-slate-900
        border border-slate-200 dark:border-slate-800
        shadow-sm hover:shadow transition-shadow duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
