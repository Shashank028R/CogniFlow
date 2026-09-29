import React from "react";
import { X } from "lucide-react";

const DeleteMessageModal = ({ isOpen, onClose, onConfirm, canDeleteForEveryone }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[modalBackdrop_0.2s_ease-out] p-4">
      <div className="bg-[var(--card)] w-full max-w-sm p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_16px_40px_rgba(0,0,0,0.18)] flex flex-col items-center animate-[modalContent_0.25s_cubic-bezier(0.16,1,0.3,1)] relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold text-[var(--text)] mb-1">Delete Message</h3>
        <p className="text-xs text-slate-500 mb-5 text-center">
          Are you sure you want to delete this message?
        </p>

        <div className="flex flex-col gap-2.5 w-full">
          {canDeleteForEveryone && (
            <button
              onClick={() => onConfirm("everyone")}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-[0_2px_8px_rgba(239,68,68,0.25)] hover:shadow-[0_4px_14px_rgba(239,68,68,0.35)] hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-150 cursor-pointer"
            >
              Delete for everyone
            </button>
          )}
          
          <button
            onClick={() => onConfirm("me")}
            className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--text)] font-semibold text-xs border border-slate-200/80 dark:border-slate-700 hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            Delete for me
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium text-xs hover:bg-slate-100 dark:hover:bg-slate-800/60 active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMessageModal;
