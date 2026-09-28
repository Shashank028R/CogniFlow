import { Settings } from "lucide-react";

const SidebarHeader = ({ onSettingsClick }) => {
  return (
    <div className="mb-4 flex justify-between items-center px-1 pt-1">
      <h2 className="text-[22px] font-semibold tracking-[-0.025em] text-[#1d1d1f] dark:text-white flex items-center gap-1">
        Cogni<span className="text-[#0066cc] dark:text-[#2997ff]">Flow</span>
      </h2>

      <button
        onClick={onSettingsClick}
        className="w-9 h-9 rounded-full flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white
        bg-white dark:bg-[#272729]
        border border-[#e0e0e0] dark:border-[#333336]
        active:scale-[0.95] transition-all duration-150
        cursor-pointer outline-none"
        title="Profile & Settings"
      >
        <Settings size={18} />
      </button>
    </div>
  );
};

export default SidebarHeader;
