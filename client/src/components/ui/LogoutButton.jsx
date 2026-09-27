import React from "react";
import { LogOut } from "lucide-react";

const LogoutButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-2.5 px-3 rounded-lg font-medium text-xs sm:text-sm text-rose-600 dark:text-rose-400
      bg-rose-50/60 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/30
      border border-rose-200/60 dark:border-rose-900/40
      transition-colors duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
    >
      <LogOut size={15} />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;