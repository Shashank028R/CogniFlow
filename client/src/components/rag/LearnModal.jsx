import React, { useState, useEffect } from "react";
import { X, BookPlus, AlertTriangle } from "lucide-react";

export const LearnModal = ({ isOpen, onClose, message, onSave }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (message) {
      setQuestion(message.replyToQuestion || "");
      setAnswer(message.content || "");
    }
  }, [message]);

  if (!isOpen || !message) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    try {
      setIsSubmitting(true);
      await onSave(message._id, {
        question: question.trim(),
        answer: answer.trim(),
      });
      onClose();
    } catch {
      // toast handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.15s_ease]">
      <div className="w-full max-w-lg bg-[var(--card)] rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col gap-4 animate-[scaleUp_0.15s_ease]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <BookPlus size={20} />
            <h3 className="font-bold text-base text-[var(--text)]">Add to Chat Knowledge</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Warning / Explanation note */}
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5 text-amber-500" />
          <p>
            Only add answers you trust. CogniBot will index this exact Q&A and use it to answer future questions in this chat.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Question */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Question (what users ask):
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What is the return policy?"
              required
              maxLength={500}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-sm text-[var(--text)] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          {/* Answer */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Answer (how CogniBot will answer):
            </label>
            <textarea
              rows={5}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Provide the accurate answer..."
              required
              maxLength={4000}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-sm text-[var(--text)] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !question.trim() || !answer.trim()}
              className="py-2 px-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Indexing..." : "Save to Knowledge Base"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default LearnModal;
