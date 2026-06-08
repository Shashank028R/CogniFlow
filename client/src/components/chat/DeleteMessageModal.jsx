import React from "react";
import { X } from "lucide-react";

const DeleteMessageModal = ({ isOpen, onClose, onConfirm, canDeleteForEveryone }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease]">
      <div className="bg-[var(--bg)] w-full max-w-sm p-6 rounded-3xl shadow-[10px_10px_20px_var(--shadow-dark),-10px_-10px_20px_var(--shadow-light)] flex flex-col items-center animate-[slideIn_0.3s_ease] relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <h3 className="text-xl font-semibold text-[var(--text)] mb-2">Delete Message</h3>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Are you sure you want to delete this message?
        </p>

        <div className="flex flex-col gap-3 w-full">
          {canDeleteForEveryone && (
            <button
              onClick={() => onConfirm("everyone")}
              className="w-full py-3 rounded-xl bg-red-500 text-white font-bold shadow-[4px_4px_10px_rgba(239,68,68,0.3)] hover:bg-red-600 transition-all cursor-pointer"
            >
              Delete for everyone
            </button>
          )}
          
          <button
            onClick={() => onConfirm("me")}
            className="w-full py-3 rounded-xl bg-[var(--bg)] text-gray-700 font-bold shadow-[4px_4px_8px_var(--shadow-dark),-4px_-4px_8px_var(--shadow-light)] hover:shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)] transition-all cursor-pointer"
          >
            Delete for me
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gray-200 text-gray-600 font-bold shadow-sm hover:bg-gray-300 transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMessageModal;
