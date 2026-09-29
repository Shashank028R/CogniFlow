import { Settings } from "lucide-react";

const SidebarHeader = ({ onSettingsClick }) => {
  return (
    <div className="mb-3 flex justify-between items-center px-1 pt-1">
      <div className="flex items-center gap-2.5">
        <img src="/images/CogniFlow.png" alt="CogniFlow" className="w-7 h-7 object-contain rounded-lg shadow-xs" />
        <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Cogni<span className="text-blue-600">Flow</span>
        </h2>
      </div>

      <button
        onClick={onSettingsClick}
        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200
        bg-slate-100/70 dark:bg-slate-800/70 hover:bg-slate-200/70 dark:hover:bg-slate-700/70
        border border-slate-200/80 dark:border-slate-700/80
        shadow-xs hover:-translate-y-[1px] transition-all duration-200
        active:scale-95 cursor-pointer outline-none group"
        title="Profile & Settings"
      >
        <Settings size={17} className="group-hover:rotate-45 transition-transform duration-300 ease-out" />
      </button>
    </div>
  );
};

export default SidebarHeader;
