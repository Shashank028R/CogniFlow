import React, { useState, useRef } from "react";
import { X, UploadCloud, Plus, FileText, BookOpen, Layers, Sparkles } from "lucide-react";
import ModeSelector from "./ModeSelector";
import SourceItem from "./SourceItem";

export const KnowledgePanel = ({
  isOpen,
  onClose,
  sources = [],
  ragMode = "strict",
  isUploading = false,
  uploadProgress = 0,
  onUploadFile,
  onUploadText,
  onToggleSource,
  onDeleteSource,
  onUpdateMode,
  onGenerateQuiz,
}) => {
  const [activeTab, setActiveTab] = useState("file"); // "file" | "text"
  const [textTitle, setTextTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadFile(e.target.files[0]);
      e.target.value = "";
    }
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textContent.trim()) return;
    await onUploadText(textTitle.trim(), textContent.trim());
    setTextTitle("");
    setTextContent("");
    setActiveTab("file");
  };

  const readyCount = sources.filter((s) => s.status === "ready" && s.enabled).length;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-[var(--card)]/95 backdrop-blur-2xl shadow-2xl border-l border-slate-200/80 dark:border-slate-800 z-50 flex flex-col animate-[slideIn_0.2s_ease]">
      
      {/* Header */}
      <div className="p-4 px-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <BookOpen size={20} />
          <div>
            <h3 className="font-bold text-base text-[var(--text)] leading-tight">Chat Knowledge</h3>
            <p className="text-[11px] text-slate-400">
              {readyCount} ready {readyCount === 1 ? "source" : "sources"} in this room
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 scrollbar-hide">
        
        {/* Mode Selector */}
        <ModeSelector mode={ragMode} onSelectMode={onUpdateMode} />

        {/* Quick Quiz on Documents Action */}
        {readyCount > 0 && onGenerateQuiz && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-violet-600/10 border border-blue-500/25 flex items-center justify-between shadow-xs">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles size={14} className="text-blue-500" />
                Test Your Knowledge
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Generate an interactive quiz from your docs
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onGenerateQuiz();
                onClose();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs active:scale-95 transition-all cursor-pointer flex-shrink-0"
            >
              <span>Take Quiz</span>
            </button>
          </div>
        )}

        {/* Upload Tabs */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Add Knowledge</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("file")}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                  activeTab === "file"
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("text")}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                  activeTab === "text"
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Paste Text
              </button>
            </div>
          </div>

          {activeTab === "file" ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[0.99]"
                  : "border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/70"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 shadow-xs">
                <UploadCloud size={24} />
              </div>
              <p className="text-xs font-semibold text-[var(--text)]">
                Click to upload or drag & drop
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                PDF, PNG, JPG, WEBP (Max 10 MB, up to 200 pages)
              </p>

              {isUploading && (
                <div className="w-full mt-3 flex flex-col gap-1">
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-200"
                      style={{ width: `${uploadProgress || 30}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-blue-500 font-medium">Uploading & vectorizing...</span>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleTextSubmit} className="flex flex-col gap-2 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40">
              <input
                type="text"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                placeholder="Note Title (e.g. Project Specifications)"
                className="w-full py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-[var(--text)] outline-none focus:border-blue-500"
              />
              <textarea
                rows={4}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste key notes, FAQs, or raw facts here..."
                required
                className="w-full py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-[var(--text)] outline-none focus:border-blue-500 resize-none"
              />
              <button
                type="submit"
                disabled={isUploading || !textContent.trim()}
                className="py-1.5 px-3 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors self-end disabled:opacity-50"
              >
                Add Note
              </button>
            </form>
          )}
        </div>

        {/* Sources List */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Knowledge Sources ({sources.length})</span>
          </div>

          {sources.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center text-slate-400">
              <Layers size={28} className="mb-2 opacity-40 text-blue-500" />
              <p className="text-xs font-medium">No documents uploaded yet</p>
              <p className="text-[11px] mt-1 max-w-[220px]">
                Upload a PDF or image above to ground CogniBot's answers in your data.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {sources.map((s) => (
                <SourceItem
                  key={s._id}
                  source={s}
                  onToggle={onToggleSource}
                  onDelete={onDeleteSource}
                />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default KnowledgePanel;
