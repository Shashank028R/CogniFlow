import React from "react";

const Input = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`
        w-full px-3.5 py-2.5 rounded-lg text-sm
        bg-white dark:bg-slate-800
        text-slate-900 dark:text-slate-100
        border border-slate-200 dark:border-slate-700
        placeholder:text-slate-400 dark:placeholder:text-slate-500
        focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
        transition-colors duration-150
        disabled:opacity-60 disabled:cursor-not-allowed
        ${className}
      `}
    />
  );
};

export default Input;