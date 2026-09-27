import React from "react";
import { Settings } from "lucide-react";

const SidebarHeader = ({ onSettingsClick }) => {
  return (
    <div className="mb-4 flex justify-between items-center px-1">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
          C
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Cogni<span className="text-blue-600 dark:text-blue-400">Flow</span>
        </h2>
      </div>

      <button
        onClick={onSettingsClick}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200
        hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700
        transition-colors duration-150 cursor-pointer outline-0"
        title="Profile & Settings"
      >
        <Settings size={18} />
      </button>
    </div>
  );
};

export default SidebarHeader;
