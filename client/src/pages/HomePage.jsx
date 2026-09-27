import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { MessageSquare, Bot, Eye, CheckCheck, FileText, Zap, Shield, ArrowRight } from "lucide-react";
import Button from "../components/ui/Button";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 relative z-10 flex flex-col">

      {/* NAVBAR */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              C
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Cogni<span className="text-blue-600 dark:text-blue-400">Flow</span>
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/about"
              className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              About
            </Link>
            <button
              onClick={() => navigate("/auth")}
              className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <div className="w-24 sm:w-28">
              <Button onClick={() => navigate("/auth")} variant="primary" className="py-2 text-xs sm:text-sm">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="container mx-auto px-6 pt-16 sm:pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          <span>Multimodal Intelligence Powered by Google Gemini</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 max-w-4xl mx-auto leading-tight">
          Real-Time Messaging with <br className="hidden sm:inline" />
          <span className="text-blue-600 dark:text-blue-400">Native Context-Aware AI</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Collaborate seamlessly with lightning-fast WebSockets, verified read receipts, Cloudinary file uploads, and a multimodal AI bot that analyzes images and documents directly in your chats.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-md mx-auto">
          <Button
            onClick={() => navigate("/auth")}
            variant="primary"
            className="text-sm py-3 px-6 w-full sm:w-auto"
          >
            <span>Start Messaging Free</span>
            <ArrowRight size={16} />
          </Button>
          <Button
            onClick={() => navigate("/about")}
            variant="secondary"
            className="text-sm py-3 px-6 w-full sm:w-auto"
          >
            Learn More
          </Button>
        </div>
      </section>

      {/* PRODUCT PREVIEW MOCKUP */}
      <section className="container mx-auto px-6 pb-20">
        <div className="max-w-4xl mx-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden flex flex-col">
          {/* Mockup Topbar */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-semibold text-slate-700 dark:text-slate-300"># general-discussion</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-medium text-slate-500">CogniBot Ready</span>
            </div>
          </div>

          {/* Mockup Chat Body */}
          <div className="p-6 space-y-4 bg-white dark:bg-slate-900">
            {/* User Message */}
            <div className="flex justify-end">
              <div className="max-w-[80%] sm:max-w-[70%] bg-blue-600 text-white p-3.5 rounded-2xl rounded-tr-sm shadow-sm space-y-2">
                <div className="flex items-center gap-2.5 p-2 bg-blue-700 rounded-lg">
                  <FileText size={18} className="text-blue-200" />
                  <span className="text-xs font-medium truncate">architecture_spec.pdf</span>
                </div>
                <p className="text-xs sm:text-sm">@cogni Can you review the uploaded specification and summarize the key security recommendations?</p>
                <div className="flex items-center justify-end gap-1 text-[10px] text-blue-200">
                  <span>10:42 AM</span>
                  <CheckCheck size={13} className="text-white" />
                </div>
              </div>
            </div>

            {/* CogniBot Reply */}
            <div className="flex justify-start items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-xs border border-blue-200 dark:border-blue-800">
                AI
              </div>
              <div className="max-w-[85%] sm:max-w-[75%] bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 p-3.5 rounded-2xl rounded-tl-sm text-slate-800 dark:text-slate-200 space-y-1.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">CogniBot</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-[9px] border border-blue-200 dark:border-blue-800">BOT</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  Based on the document, here are the top 3 recommendations:
                </p>
                <ul className="text-xs list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
                  <li><strong>Stateless JWT Verification:</strong> Enforce strict expiration on bearer tokens.</li>
                  <li><strong>Rate Limiting:</strong> Implement IP throttles on authentication endpoints.</li>
                  <li><strong>Presence Heartbeats:</strong> Clean up socket session maps on disconnect.</li>
                </ul>
                <div className="flex items-center justify-end text-[10px] text-slate-400 pt-1">
                  <span>10:42 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="container mx-auto px-6 py-16 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Engineered for Modern Collaboration
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto mt-2">
            Every feature is built around performance, clean design, and intelligent automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Zap size={20} />
            </div>
            <h3 className="text-base font-semibold mb-2">Real-Time WebSockets</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Bi-directional messaging powered by Socket.IO with automatic reconnection, room partitions, and minimal latency.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Bot size={20} />
            </div>
            <h3 className="text-base font-semibold mb-2">CogniBot Integration</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Engage directly in 1-on-1 chats or mention @cogni in any group chat to retrieve automated AI assistance in-thread.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Eye size={20} />
            </div>
            <h3 className="text-base font-semibold mb-2">Multimodal AI Vision</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload images or diagrams to the chat and CogniBot inspects the content directly using Google Gemini's vision models.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <CheckCheck size={20} />
            </div>
            <h3 className="text-base font-semibold mb-2">Delivery & Read Receipts</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Fine-grained delivery tracking showing sent, delivered, and read checkmarks with multi-device synchronization.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <MessageSquare size={20} />
            </div>
            <h3 className="text-base font-semibold mb-2">Live Typing Indicators</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Real-time animated indicators for human team members and CogniBot while messages are being composed.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Shield size={20} />
            </div>
            <h3 className="text-base font-semibold mb-2">Secure Cloud Uploads</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Cloudinary media pipeline with local disk cleanups, instant CDN delivery, and support for high-res images and documents.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>&copy; {new Date().getFullYear()} CogniFlow. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</Link>
            <Link to="/auth" className="hover:text-slate-900 dark:hover:text-white transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
