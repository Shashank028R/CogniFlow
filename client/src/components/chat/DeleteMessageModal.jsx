import React from "react";
import { X, Trash2 } from "lucide-react";

const DeleteMessageModal = ({ isOpen, onClose, onConfirm, canDeleteForEveryone }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 animate-[fadeIn_0.15s_ease]">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center relative animate-[slideIn_0.2s_ease]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
          <Trash2 size={22} />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Delete Message</h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-5 text-center">
          Are you sure you want to delete this message?
        </p>

        <div className="flex flex-col gap-2 w-full">
          {canDeleteForEveryone && (
            <button
              onClick={() => onConfirm("everyone")}
              className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-medium text-sm shadow-sm transition-colors cursor-pointer"
            >
              Delete for everyone
            </button>
          )}
          
          <button
            onClick={() => onConfirm("me")}
            className="w-full py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium text-sm border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            Delete for me
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMessageModal;
