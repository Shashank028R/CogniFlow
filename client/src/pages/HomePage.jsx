import { useNavigate, Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { MessageSquare, Zap, Eye, CheckCheck, CloudUpload, Key, Image as ImageIcon, X, FileText } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-transparent text-[var(--text)] transition-colors duration-300 relative selection:bg-blue-500 selection:text-white">

      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative z-20 border-b border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md bg-[var(--bg)]/70 sticky top-0">
        <div className="flex items-center gap-2.5">
          <img src="/images/CogniFlow.png" alt="CogniFlow" className="w-8 h-8 object-contain rounded-lg shadow-xs" />
          <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">CogniFlow</span>
        </div>
        <div className="flex items-center gap-5">
          <Link to="/about" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
            About Us
          </Link>
          <div className="w-24">
            <Button onClick={() => navigate("/auth")} className="text-xs py-2 px-3">Login</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-10 pb-16 text-center relative z-20">
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl p-2.5 bg-white dark:bg-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center">
            <img src="/images/CogniFlow.png" alt="CogniFlow AI Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="inline-block mb-3 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 font-medium text-xs shadow-xs">
          Powered by Google Gemini Vision
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--text)] mb-4 leading-tight">
          Real-Time Chat Meets <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Context-Aware AI</span>
        </h1>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Experience seamless collaboration with WhatsApp-style read receipts, typing indicators, and a native multimodal AI assistant that can instantly analyze your images and documents right inside the chat.
        </p>
        <div className="flex justify-center items-center max-w-xs mx-auto">
          <Button onClick={() => navigate("/auth")} className="text-sm py-3 px-6 w-full shadow-[0_4px_16px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)]">
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-12 relative z-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Everything you need to collaborate</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">CogniFlow combines standard chat features with next-generation AI workflows.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          <Card className="flex flex-col items-start p-5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-500 mb-4 shadow-xs">
              <Zap size={22} />
            </div>
            <h3 className="text-base font-bold mb-1.5">Real-time Messaging</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Lightning-fast, socket-based communication. Create group rooms or 1-on-1 chats with zero lag.</p>
          </Card>

          <Card className="flex flex-col items-start p-5">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center p-2 mb-4 shadow-xs">
              <img src="/images/ai-button-logo.png" alt="CogniBot" className="w-7 h-7 object-contain" />
            </div>
            <h3 className="text-base font-bold mb-1.5">Summon CogniBot</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Just type <strong className="text-blue-600 font-semibold">@cogni</strong> in any group chat to bring an intelligent assistant into the conversation. It answers directly in the room for all to see.</p>
          </Card>

          <Card className="flex flex-col items-start p-5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-center text-purple-500 mb-4 shadow-xs">
              <Eye size={22} />
            </div>
            <h3 className="text-base font-bold mb-1.5">Multimodal AI Vision</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Upload images or PDFs and the AI can actually "see" them. Ask CogniBot to describe pictures or summarize documents instantly.</p>
          </Card>

          <Card className="flex flex-col items-start p-5">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200/60 dark:border-cyan-800/60 flex items-center justify-center text-cyan-600 mb-4 shadow-xs">
              <CheckCheck size={22} />
            </div>
            <h3 className="text-base font-bold mb-1.5">WhatsApp-Style Receipts</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Never guess if a message was seen. Track real-time status with Sent, Delivered (Gray), and Seen (Blue) checkmarks.</p>
          </Card>

          <Card className="flex flex-col items-start p-5">
            <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/60 flex items-center justify-center text-rose-500 mb-4 shadow-xs">
              <MessageSquare size={22} />
            </div>
            <h3 className="text-base font-bold mb-1.5">Live Typing Indicators</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">See when humans or the AI are actively generating a response with smooth, animated triple-dot typing indicators.</p>
          </Card>

          <Card className="flex flex-col items-start p-5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 mb-4 shadow-xs">
              <CloudUpload size={22} />
            </div>
            <h3 className="text-base font-bold mb-1.5">Cloud Attachments</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Securely share images and files powered by Cloudinary. Preview attachments locally before hitting send.</p>
          </Card>

        </div>
      </section>

      {/* Interactive Mockup */}
      <section className="container mx-auto px-6 py-14 relative z-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">See it in action</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">A realistic preview of the CogniFlow collaborative workspace.</p>
        </div>
        
        <div className="max-w-4xl mx-auto rounded-2xl bg-[var(--card)]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)] p-5 md:p-7 border border-slate-200/80 dark:border-slate-800 flex flex-col h-[540px]">
          
          {/* Mockup Header */}
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-slate-500 shadow-xs">
              <MessageSquare size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-base leading-tight">Project Alpha Room</h4>
              <p className="text-xs text-slate-500 mt-0.5">3 participants, 1 PDF uploaded</p>
            </div>
          </div>
          
          {/* Mockup Chat Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
            
            {/* User Message */}
            <div className="flex gap-3 w-full justify-end">
              <div className="flex flex-col items-end max-w-[80%]">
                <div className="bg-blue-600 text-white shadow-xs p-3 rounded-2xl rounded-tr-xs flex flex-col gap-2">
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-blue-700/80">
                    <FileText size={20} className="text-white flex-shrink-0" />
                    <span className="truncate max-w-[150px] font-medium text-xs">Q3_Report.pdf</span>
                  </div>
                  <p className="text-white text-xs leading-relaxed">Hey everyone, has anyone read the new Q3 report? <span className="font-semibold text-blue-200">@cogni</span> can you summarize the key takeaways from the attached file?</p>
                  <div className="flex items-center justify-end gap-1 mt-0.5 text-blue-100 text-[10px]">
                    <span>10:42 AM</span>
                    <span className="ml-1 flex items-center">
                      <CheckCheck size={13} className="text-cyan-300" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex gap-3 flex-row-reverse justify-end w-full">
              <div className="w-8 h-8 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center overflow-hidden p-1 shadow-xs">
                <img src="/images/ai-button-logo.png" alt="CogniBot" className="w-full h-full object-contain" />
              </div>
              <div className="bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/60 shadow-xs p-3.5 rounded-2xl rounded-tl-xs text-left max-w-[80%]">
                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed markdown-body [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:mb-1">
                  <p className="mb-1.5">Based on the uploaded <strong className="text-blue-600 dark:text-blue-400">Q3_Report.pdf</strong>, here are the key takeaways:</p>
                  <ul className="space-y-0.5">
                    <li>Revenue grew by 15% year-over-year.</li>
                    <li>The new "CogniFlow" feature increased user retention by 22%.</li>
                    <li>Marketing spend decreased by 5% due to higher organic reach.</li>
                  </ul>
                </div>
                <div className="flex justify-start gap-1 mt-1 text-slate-400 text-[10px]">
                  <span>10:42 AM</span>
                </div>
              </div>
            </div>

            {/* User 2 Typing Indicator */}
            <div className="flex gap-3 flex-row-reverse justify-end w-full mt-1">
              <div className="w-7 h-7 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 text-[11px] font-bold">
                J
              </div>
              <div className="bg-slate-100/90 dark:bg-slate-800/90 px-3 py-2 rounded-xl rounded-tl-xs shadow-xs border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"></div>
              </div>
            </div>

          </div>

          {/* Mockup Input Area */}
          <div className="mt-3 pt-3 shrink-0 border-t border-slate-200/80 dark:border-slate-800">
            {/* Fake attachment preview */}
            <div className="mx-2 mb-2 p-2 bg-slate-100/70 dark:bg-slate-800/60 rounded-xl border border-blue-500/20 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-lg flex items-center justify-center">
                  <ImageIcon size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[var(--text)]">graph_screenshot.png</span>
                  <span className="text-[10px] text-slate-500">1.2 MB</span>
                </div>
              </div>
              <X size={14} className="text-slate-400" />
            </div>

            <div className="flex items-end gap-2 z-10">
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl text-slate-500 bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                <span className="text-sm">📎</span>
              </div>
              <div className="relative flex-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/60 p-2 px-3 overflow-hidden shadow-xs">
                <span className="text-slate-400 text-xs">Look at this graph...</span>
              </div>
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-xs text-xs">
                ➤
              </div>
            </div>
          </div>

        </div>
      </section>
      
      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs border-t border-slate-200/70 dark:border-slate-800/70 mt-8 relative z-20">
        <div className="flex items-center gap-2">
          <img src="/images/CogniFlow.png" alt="CogniFlow" className="w-5 h-5 object-contain" />
          <p>© 2026 CogniFlow. All rights reserved.</p>
        </div>
        <div className="flex gap-4 mt-3 md:mt-0">
          <Link to="/about" className="hover:text-blue-500 transition-colors">Contact Developer</Link>
          <a href="https://github.com/Shashank028R/CogniFlow" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">GitHub</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
