import React from "react";
import { X } from "lucide-react";

const DeleteMessageModal = ({ isOpen, onClose, onConfirm, canDeleteForEveryone }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md animate-[fadeIn_0.2s_ease] p-4">
      <div className="bg-white dark:bg-[#272729] border border-[#e0e0e0] dark:border-[#333336] w-full max-w-sm p-6 rounded-[18px] flex flex-col items-center relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        <h3 className="text-[19px] font-semibold text-[#1d1d1f] dark:text-white mb-2 tracking-tight">Delete Message</h3>
        <p className="text-sm text-[#86868b] mb-6 text-center">
          Are you sure you want to delete this message?
        </p>

        <div className="flex flex-col gap-2.5 w-full">
          {canDeleteForEveryone && (
            <button
              onClick={() => onConfirm("everyone")}
              className="w-full py-2.5 rounded-full bg-[#ff3b30] hover:bg-[#d70015] text-white font-normal text-sm active:scale-[0.95] transition-all cursor-pointer"
            >
              Delete for everyone
            </button>
          )}
          
          <button
            onClick={() => onConfirm("me")}
            className="w-full py-2.5 rounded-full bg-[#f5f5f7] dark:bg-[#1d1d1f] border border-[#e0e0e0] dark:border-[#333336] text-[#1d1d1f] dark:text-white font-normal text-sm active:scale-[0.95] transition-all cursor-pointer"
          >
            Delete for me
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white font-normal text-sm active:scale-[0.95] transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMessageModal;
