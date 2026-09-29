import React, { useState } from "react";
import { Sparkles, PlusCircle, Check } from "lucide-react";

export const FallbackActions = ({
  message,
  onAnswerGeneral,
  onOpenLearnModal,
}) => {
  const [loadingGeneral, setLoadingGeneral] = useState(false);

  if (!message) return null;

  const actions = message.actions || [];
  const showAnswerGeneral = actions.includes("answer_general");
  const showAddToKnowledge = actions.includes("add_to_knowledge") && !message.learned;
  const isLearned = message.learned;

  if (!showAnswerGeneral && !showAddToKnowledge && !isLearned) {
    return null;
  }

  const handleGeneralClick = async () => {
    try {
      setLoadingGeneral(true);
      await onAnswerGeneral(message._id);
    } catch {
      // toast handled in hook
    } finally {
      setLoadingGeneral(false);
    }
  };

  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-2">
      {showAnswerGeneral && (
        <button
          type="button"
          onClick={handleGeneralClick}
          disabled={loadingGeneral}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200/80 dark:border-blue-800/80 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
        >
          <Sparkles size={13} className={loadingGeneral ? "animate-spin" : ""} />
          <span>{loadingGeneral ? "Generating answer..." : "Answer from general knowledge"}</span>
        </button>
      )}

      {showAddToKnowledge && (
        <button
          type="button"
          onClick={() => onOpenLearnModal(message)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[var(--accent)] bg-[var(--accent-soft)] hover:bg-[var(--accent)]/20 border border-[var(--accent)]/30 shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle size={13} />
          <span>Add to knowledge</span>
        </button>
      )}

      {isLearned && (
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/30">
          <Check size={12} />
          <span>Added to knowledge</span>
        </div>
      )}
    </div>
  );
};

export default FallbackActions;
