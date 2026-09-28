import React from "react";
import { Book, Sparkles, PowerOff } from "lucide-react";

export const ModeSelector = ({ mode = "strict", onSelectMode }) => {
  const modes = [
    {
      id: "strict",
      label: "Docs only",
      icon: Book,
      desc: "Answers exclusively from your uploaded documents with citations.",
    },
    {
      id: "hybrid",
      label: "Docs + General",
      icon: Sparkles,
      desc: "Uses docs first, falls back to general knowledge if not in documents.",
    },
    {
      id: "off",
      label: "Off",
      icon: PowerOff,
      desc: "Standard AI chatbot without grounding in uploaded files.",
    },
  ];

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 px-0.5">
        <span>Answering Mode</span>
        <span className="text-[11px] font-normal text-slate-400">
          {mode === "strict" ? "Strict grounding" : mode === "hybrid" ? "Hybrid fallback" : "RAG disabled"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMode(m.id)}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/40"
              }`}
              title={m.desc}
            >
              <Icon size={13} className="flex-shrink-0" />
              <span className="truncate">{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModeSelector;
