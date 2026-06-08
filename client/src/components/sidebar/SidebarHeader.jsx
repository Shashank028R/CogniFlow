import { Settings } from "lucide-react";

const SidebarHeader = ({ onSettingsClick }) => {
  return (
    <div className="mb-6 flex justify-between items-center px-2 pt-2">
      <h2 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 drop-shadow-sm transition-all duration-500">
        Cogni<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-cyan-400 dark:to-blue-500 drop-shadow-[0_0_8px_rgba(37,99,235,0.4)] dark:drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">Flow</span>
      </h2>

      <button
        onClick={onSettingsClick}
        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:text-blue-600
        transition-all duration-300 ease-out
        bg-[var(--card)]
        shadow-[5px_5px_10px_var(--shadow-dark),-5px_-5px_10px_var(--shadow-light)] 
        hover:shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)]
        active:shadow-[inset_5px_5px_10px_var(--shadow-dark),inset_-5px_-5px_10px_var(--shadow-light)]
        cursor-pointer outline-0 group"
        title="Profile & Settings"
      >
        <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500 ease-in-out" />
      </button>
    </div>
  );
};

export default SidebarHeader;
