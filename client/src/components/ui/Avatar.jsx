import React from "react";

const Avatar = ({ text, src, size = "w-10 h-10", className = "" }) => {
  return (
    <div
      className={`${size} rounded-full overflow-hidden flex items-center justify-center
      bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200
      border border-slate-200 dark:border-slate-700/80 flex-shrink-0 select-none ${className}`}
    >
      {src ? (
        <img src={src} alt="avatar" className="w-full h-full object-cover" />
      ) : (
        <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs sm:text-sm">
          {text}
        </span>
      )}
    </div>
  );
};

export default Avatar;
