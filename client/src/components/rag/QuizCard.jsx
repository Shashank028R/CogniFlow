import React, { useState } from "react";
import { Check, X, Award, RotateCcw, ChevronRight, BookOpen, Sparkles, HelpCircle } from "lucide-react";

export const QuizCard = ({ quiz, messageId }) => {
  const questions = quiz?.questions || [];
  const total = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionIdx]: selectedOptionIdx }
  const [showResults, setShowResults] = useState(false);

  if (!questions || total === 0) {
    return null;
  }

  const currentQ = questions[currentIndex];
  const hasAnsweredCurrent = selectedAnswers[currentIndex] !== undefined;
  const currentSelected = selectedAnswers[currentIndex];
  const isCurrentCorrect = hasAnsweredCurrent && currentSelected === currentQ.correctAnswerIndex;

  const handleSelectOption = (optionIdx) => {
    if (hasAnsweredCurrent) return; // prevent changing after reveal
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
  };

  // Calculate final score
  const correctCount = Object.entries(selectedAnswers).filter(
    ([idx, selected]) => questions[parseInt(idx, 10)]?.correctAnswerIndex === selected
  ).length;

  const percentage = Math.round((correctCount / total) * 100);

  // Render Completed Results Screen
  if (showResults) {
    return (
      <div className="w-full max-w-xl bg-gradient-to-br from-blue-50/90 to-indigo-50/90 dark:from-slate-900/90 dark:to-blue-950/40 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/60 rounded-2xl p-5 shadow-lg flex flex-col items-center text-center animate-[scaleUp_0.2s_ease]">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-900 flex items-center justify-center shadow-md mb-3">
          <Award size={32} />
        </div>

        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Quiz Completed!
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {quiz.title || "Document Knowledge Quiz"}
        </p>

        <div className="my-4 flex flex-col items-center">
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            {correctCount} / {total}
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            {percentage}% Mastery
          </span>
          <div className="w-48 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                percentage >= 80
                  ? "bg-emerald-500"
                  : percentage >= 50
                  ? "bg-blue-500"
                  : "bg-amber-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mb-4">
          {percentage >= 80
            ? "🎉 Excellent understanding of the source material! You're fully prepared."
            : percentage >= 50
            ? "👍 Good work! Review the cited document passages for the questions you missed."
            : "📚 Consider revisiting the source documents and testing yourself again."}
        </p>

        <div className="flex gap-2">
          <button
            onClick={handleRetake}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Retake Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-blue-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md flex flex-col gap-3 my-1">
      {/* Quiz Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
              {quiz.title || "Document Quiz"}
            </h4>
            <span className="text-[10px] text-slate-400">
              Question {currentIndex + 1} of {total}
            </span>
          </div>
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/40">
          <span>
            {Object.keys(selectedAnswers).length}/{total} Answered
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      {/* Question Text */}
      <div className="py-1">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
          {currentQ.question}
        </h3>
      </div>

      {/* Options List */}
      <div className="flex flex-col gap-2">
        {currentQ.options.map((option, optIdx) => {
          const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
          const isSelected = currentSelected === optIdx;
          const isCorrectAnswer = optIdx === currentQ.correctAnswerIndex;

          let btnStyles =
            "border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300";
          let badgeStyles =
            "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300";

          if (hasAnsweredCurrent) {
            if (isCorrectAnswer) {
              btnStyles =
                "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 font-medium";
              badgeStyles = "bg-emerald-500 text-white";
            } else if (isSelected && !isCorrectAnswer) {
              btnStyles =
                "border-rose-400 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300";
              badgeStyles = "bg-rose-500 text-white";
            } else {
              btnStyles = "opacity-50 border-slate-200 dark:border-slate-800";
            }
          }

          return (
            <button
              key={optIdx}
              type="button"
              disabled={hasAnsweredCurrent}
              onClick={() => handleSelectOption(optIdx)}
              className={`w-full text-left p-2.5 px-3 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${btnStyles} ${
                !hasAnsweredCurrent ? "active:scale-[0.99]" : ""
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${badgeStyles}`}
                >
                  {letter}
                </span>
                <span>{option}</span>
              </div>

              {hasAnsweredCurrent && isCorrectAnswer && (
                <Check size={16} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              )}
              {hasAnsweredCurrent && isSelected && !isCorrectAnswer && (
                <X size={16} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Explanation & Source Citation */}
      {hasAnsweredCurrent && (
        <div
          className={`p-3 rounded-xl text-xs flex flex-col gap-1.5 border animate-[fadeIn_0.2s_ease] ${
            isCurrentCorrect
              ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200"
              : "bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200"
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold">
            {isCurrentCorrect ? (
              <>
                <Check size={14} className="text-emerald-600" />
                <span>Correct!</span>
              </>
            ) : (
              <>
                <HelpCircle size={14} className="text-amber-600" />
                <span>Incorrect</span>
              </>
            )}
          </div>
          <p className="leading-relaxed opacity-90">{currentQ.explanation}</p>

          {currentQ.sourceTitle && (
            <div className="flex items-center gap-1 mt-1 text-[10px] opacity-75 font-medium">
              <BookOpen size={11} />
              <span>
                Source: {currentQ.sourceTitle} (Page {currentQ.sourcePage || 1})
              </span>
            </div>
          )}
        </div>
      )}

      {/* Next Question / Finish Button */}
      {hasAnsweredCurrent && (
        <div className="flex justify-end pt-1">
          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <span>{currentIndex < total - 1 ? "Next Question" : "Finish Quiz"}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizCard;
