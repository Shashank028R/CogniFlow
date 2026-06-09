import React, { useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bot, MessageSquare, FileText, Zap, Shield, Sparkles, CheckCheck, ImageIcon, Eye, CloudUpload, Key, X } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const HomePage = () => {
  const navigate = useNavigate();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="min-h-screen font-sans text-[var(--text)] relative z-10 overflow-hidden">
      
      {/* Particles Background for Hero */}
      <div className="absolute inset-0 z-0 h-[70vh] pointer-events-none opacity-40 dark:opacity-20">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            background: { color: { value: "transparent" } },
            fpsLimit: 60,
            interactivity: { events: { resize: true } },
            particles: {
              color: { value: "#3b82f6" },
              links: { color: "#3b82f6", distance: 150, enable: true, opacity: 0.3, width: 1 },
              move: { enable: true, random: true, speed: 1, straight: false },
              number: { density: { enable: true, area: 800 }, value: 40 },
              opacity: { value: 0.5 },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 3 } },
            },
            detectRetina: true,
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg)] shadow-[4px_4px_8px_var(--shadow-dark),-4px_-4px_8px_var(--shadow-light)] flex items-center justify-center text-blue-600">
            <Sparkles size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-700 dark:text-white">CogniFlow</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/about" className="font-medium text-slate-500 hover:text-blue-600 transition-colors">
            About Us
          </Link>
          <div className="w-28">
            <Button onClick={() => navigate("/auth")}>Login</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-24 text-center relative z-20">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-semibold text-sm shadow-sm">
          Powered by Google Gemini Vision
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[var(--text)] mb-6 drop-shadow-sm leading-tight">
          Real-Time Chat Meets <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Context-Aware AI</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Experience seamless collaboration with WhatsApp-style read receipts, typing indicators, and a native multimodal AI assistant that can instantly analyze your images and documents right inside the chat.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 max-w-md mx-auto">
          <Button onClick={() => navigate("/auth")} className="text-lg py-4 px-8 w-full shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform">
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16 relative z-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything you need to collaborate</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">CogniFlow combines standard chat features with next-generation AI workflows.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <Card className="flex flex-col items-start p-8 animate-breath">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg)] shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] flex items-center justify-center text-blue-500 mb-6">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Real-time Messaging</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Lightning-fast, socket-based communication. Create group rooms or 1-on-1 chats with zero lag.</p>
          </Card>

          <Card className="flex flex-col items-start p-8 animate-breath delay-100">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg)] shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] flex items-center justify-center text-indigo-500 mb-6">
              <Bot size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Summon CogniBot</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Just type <strong className="text-indigo-500">@cogni</strong> in any group chat to bring an intelligent assistant into the conversation. It answers directly in the room for all to see.</p>
          </Card>

          <Card className="flex flex-col items-start p-8 animate-breath delay-200">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg)] shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] flex items-center justify-center text-purple-500 mb-6">
              <Eye size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Multimodal AI Vision</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Upload images or PDFs and the AI can actually "see" them. Ask CogniBot to describe pictures or summarize documents instantly.</p>
          </Card>

          <Card className="flex flex-col items-start p-8 animate-breath delay-100">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg)] shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] flex items-center justify-center text-cyan-500 mb-6">
              <CheckCheck size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">WhatsApp-Style Receipts</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Never guess if a message was seen. Track real-time status with Sent, Delivered (Gray), and Seen (Blue) checkmarks.</p>
          </Card>

          <Card className="flex flex-col items-start p-8 animate-breath delay-200">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg)] shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] flex items-center justify-center text-rose-500 mb-6">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Live Typing Indicators</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">See when humans or the AI are actively generating a response with smooth, animated triple-dot typing indicators.</p>
          </Card>

          <Card className="flex flex-col items-start p-8 animate-breath delay-300">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg)] shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] flex items-center justify-center text-emerald-500 mb-6">
              <CloudUpload size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Cloud Attachments</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Securely share images and files powered by Cloudinary. Preview attachments locally before hitting send.</p>
          </Card>

        </div>
      </section>

      {/* Interactive Mockup */}
      <section className="container mx-auto px-6 py-20 relative z-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">See it in action</h2>
        </div>
        
        <div className="max-w-4xl mx-auto rounded-3xl bg-[var(--bg)] shadow-[inset_10px_10px_20px_var(--shadow-dark),inset_-10px_-10px_20px_var(--shadow-light)] p-6 md:p-10 border-4 border-[var(--bg)] flex flex-col h-[600px]">
          
          {/* Mockup Header */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-300/50 dark:border-slate-700/50 shrink-0">
            <div className="w-12 h-12 rounded-full bg-[var(--bg)] shadow-[4px_4px_8px_var(--shadow-dark),-4px_-4px_8px_var(--shadow-light)] flex items-center justify-center text-slate-500">
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 className="font-bold text-lg">Project Alpha Room</h4>
              <p className="text-sm text-slate-500">3 participants, 1 PDF uploaded</p>
            </div>
          </div>
          
          {/* Mockup Chat Area */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
            
            {/* User Message */}
            <div className="flex gap-4 w-full justify-end">
              <div className="flex flex-col items-end max-w-[80%]">
                <div className="bg-blue-500 text-white shadow-[4px_4px_10px_rgba(37,99,235,0.2)] p-4 rounded-2xl rounded-tr-none flex flex-col gap-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-600 transition-all shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.1)]">
                    <FileText size={24} className="text-white" />
                    <span className="truncate max-w-[150px] font-medium text-sm">Q3_Report.pdf</span>
                  </div>
                  <p className="text-white text-sm">Hey everyone, has anyone read the new Q3 report? <span className="font-semibold text-blue-200">@cogni</span> can you summarize the key takeaways from the attached file?</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-blue-100 text-[10px]">
                    <span>10:42 AM</span>
                    <span className="ml-1 flex items-center">
                      <CheckCheck size={14} className="text-cyan-300 drop-shadow-[0_0_2px_rgba(0,255,255,0.8)]" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex gap-4 flex-row-reverse justify-end w-full">
              <div className="w-10 h-10 shrink-0 rounded-full bg-[var(--bg)] shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)] flex items-center justify-center text-indigo-500 overflow-hidden">
                <img src="/ai logo.webp" alt="CogniBot" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                <Bot size={20} className="absolute -z-10" />
              </div>
              <div className="bg-[var(--card)] shadow-[6px_6px_14px_#00000066,-6px_-6px_14px_var(--shadow-light)] p-4 rounded-2xl rounded-tl-none text-left max-w-[80%]">
                <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed markdown-body [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:mb-2">
                  <p className="mb-2">Based on the uploaded <strong className="text-indigo-500">Q3_Report.pdf</strong>, here are the key takeaways:</p>
                  <ul>
                    <li>Revenue grew by 15% year-over-year.</li>
                    <li>The new "CogniFlow" feature increased user retention by 22%.</li>
                    <li>Marketing spend decreased by 5% due to higher organic reach.</li>
                  </ul>
                </div>
                <div className="flex justify-start gap-1 mt-2 text-gray-400 text-[10px]">
                  <span>10:42 AM</span>
                </div>
              </div>
            </div>

            {/* User 2 Typing Indicator */}
            <div className="flex gap-4 flex-row-reverse justify-end w-full mt-2">
              <div className="w-8 h-8 shrink-0 rounded-full bg-[var(--bg)] shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)] flex items-center justify-center text-slate-500 text-xs font-bold">
                J
              </div>
              <div className="bg-[var(--card)] px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-200/50 dark:border-gray-800/50 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
              </div>
            </div>

          </div>

          {/* Mockup Input Area */}
          <div className="mt-4 pt-4 shrink-0">
            {/* Fake attachment preview */}
            <div className="mx-4 mb-2 p-3 bg-[var(--bg)] rounded-xl border border-blue-500/30 flex items-center justify-between shadow-[4px_4px_8px_var(--shadow-dark),-4px_-4px_8px_var(--shadow-light)]">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 bg-[var(--card)] text-blue-500 rounded-md flex items-center justify-center shadow-inner">
                  <ImageIcon size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[var(--text)]">graph_screenshot.png</span>
                  <span className="text-xs text-gray-500">1.2 MB</span>
                </div>
              </div>
              <X size={16} className="text-gray-400" />
            </div>

            <div className="p-4 flex items-end gap-3 z-10 border-t border-gray-200/30 dark:border-gray-700/30">
              <div className="w-10 h-10 mb-1 shrink-0 flex items-center justify-center rounded-full text-gray-500 bg-[var(--bg)] font-bold shadow-[4px_4px_8px_var(--shadow-dark),-4px_-4px_8px_var(--shadow-light)]">
                <div className="rotate-45"><Key size={18} className="opacity-0" /></div>
                <div className="absolute"><span className="text-xl leading-none -mt-1 block transform rotate-45">📎</span></div>
              </div>
              <div className="relative flex-1 rounded-xl shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] bg-[var(--card)] p-3 overflow-hidden">
                <span className="text-gray-400 text-sm">Look at this graph...</span>
              </div>
              <div className="w-10 h-10 mb-1 shrink-0 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold shadow-[4px_4px_8px_var(--shadow-dark),-4px_-4px_8px_var(--shadow-light)]">
                ➤
              </div>
            </div>
          </div>

        </div>
      </section>
      
      {/* Footer */}
      <footer className="container mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm border-t border-slate-200 dark:border-slate-800 mt-10 relative z-20">
        <p>© 2026 CogniFlow. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link to="/about" className="hover:text-blue-500 transition-colors">Contact Developer</Link>
          <a href="https://github.com/Shashank028R/CogniFlow" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">GitHub</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
