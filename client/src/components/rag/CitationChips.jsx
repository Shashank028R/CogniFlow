import React, { useState } from "react";
import { FileText, ExternalLink, X, BookOpen } from "lucide-react";

export const CitationChips = ({ sources = [] }) => {
  const [activeChip, setActiveChip] = useState(null);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
        <BookOpen size={12} />
        <span>Sources ({sources.length}):</span>
      </div>

      <div className="flex flex-wrap gap-1.5 relative">
        {sources.map((s, idx) => {
          const num = idx + 1;
          const isSelected = activeChip === idx;
          const title = s.title || "Document";
          const pageStr = s.page ? ` · p.${s.page}` : "";

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveChip(isSelected ? null : idx)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all duration-150 cursor-pointer ${
                isSelected
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-200/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 border border-slate-300/50 dark:border-slate-600/50"
              }`}
              title={`View citation [${num}]`}
            >
              <span className="font-bold opacity-80">[{num}]</span>
              <span className="max-w-[140px] truncate">{title}</span>
              <span className="text-[10px] opacity-70">{pageStr}</span>
            </button>
          );
        })}

        {/* Popover snippet preview */}
        {activeChip !== null && sources[activeChip] && (
          <div className="w-full mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg text-left text-xs animate-[fadeIn_0.15s_ease] z-20">
            <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400 truncate">
                <FileText size={13} className="flex-shrink-0" />
                <span className="truncate">
                  [{activeChip + 1}] {sources[activeChip].title || "Document"}
                  {sources[activeChip].page ? ` (Page ${sources[activeChip].page})` : ""}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveChip(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed italic bg-white/50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200/40 dark:border-slate-700/40">
              "{sources[activeChip].snippet || "Snippet text not available"}"
            </p>

            {sources[activeChip].score && (
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                <span>Relevance score: {(sources[activeChip].score * 100).toFixed(0)}%</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitationChips;
