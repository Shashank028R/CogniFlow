import React from "react";
import { useNavigate } from "react-router-dom";
import { Bot, MessageSquare, FileText, Zap, Shield, Sparkles } from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans text-slate-800 relative z-10 overflow-hidden">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#eef2f7] shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] flex items-center justify-center text-blue-600">
            <Sparkles size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-700">CogniFlow</span>
        </div>
        <div className="w-32">
          <Button onClick={() => navigate("/auth")}>Login</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-800 mb-6 drop-shadow-sm">
          Real-Time Chat Meets <br />
          <span className="text-blue-600">Context-Aware AI</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Chat seamlessly like WhatsApp, but with a twist. Tag <strong className="text-blue-600">@ai</strong> in any room to instantly query your uploaded documents. Answers are visible to everyone, and powered strictly by the files you share.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 max-w-md mx-auto">
          <Button onClick={() => navigate("/auth")} className="text-lg py-4 px-8 w-full">
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="flex flex-col items-center text-center p-8 animate-breath">
            <div className="w-16 h-16 rounded-2xl bg-[#eef2f7] shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center text-blue-500 mb-6">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Real-time Messaging</h3>
            <p className="text-slate-500">Fast, socket-based communication. Create rooms and chat with friends or colleagues instantly with zero lag.</p>
          </Card>

          <Card className="flex flex-col items-center text-center p-8 animate-breath delay-100">
            <div className="w-16 h-16 rounded-2xl bg-[#eef2f7] shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center text-indigo-500 mb-6">
              <Bot size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Summon @AI</h3>
            <p className="text-slate-500">Just type @ai in the chat to bring an intelligent assistant into the conversation. It answers directly in the room for all to see.</p>
          </Card>

          <Card className="flex flex-col items-center text-center p-8 animate-breath delay-200">
            <div className="w-16 h-16 rounded-2xl bg-[#eef2f7] shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] flex items-center justify-center text-green-500 mb-6">
              <Shield size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Document Privacy</h3>
            <p className="text-slate-500">The AI is restricted to reading only the PDFs and files uploaded to the room. No hallucinations, complete data privacy.</p>
          </Card>
        </div>
      </section>

      {/* Interactive Mockup */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#eef2f7] shadow-[inset_10px_10px_20px_#d1d9e6,inset_-10px_-10px_20px_#ffffff] p-6 md:p-10 border-4 border-[#eef2f7]">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-300/50">
            <div className="w-12 h-12 rounded-full bg-[#eef2f7] shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] flex items-center justify-center text-slate-500">
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 className="font-bold text-lg">Project Alpha Room</h4>
              <p className="text-sm text-slate-500">3 participants, 1 PDF uploaded</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* User Message */}
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-full bg-[#eef2f7] shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] flex items-center justify-center text-blue-500 font-bold">U</div>
              <div className="bg-[#eef2f7] shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff] p-4 rounded-2xl rounded-tl-none">
                <p className="text-slate-700">Hey everyone, has anyone read the new Q3 report? <span className="font-semibold text-blue-600">@ai</span> can you summarize the key takeaways from the uploaded <span className="flex items-center inline-flex gap-1 bg-slate-200 px-2 py-0.5 rounded text-sm text-slate-600 mx-1"><FileText size={14} /> Q3_Report.pdf</span>?</p>
              </div>
            </div>

            {/* AI Response */}
            <div className="flex gap-4 flex-row-reverse">
              <div className="w-10 h-10 shrink-0 rounded-full bg-[#eef2f7] shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] flex items-center justify-center text-indigo-500">
                <Bot size={20} />
              </div>
              <div className="bg-[#eef2f7] shadow-[inset_4px_4px_10px_#d1d9e6,inset_-4px_-4px_10px_#ffffff] p-4 rounded-2xl rounded-tr-none text-left max-w-[80%] border border-white/40">
                <p className="text-slate-700 leading-relaxed">
                  Based on the uploaded <strong className="text-indigo-600">Q3_Report.pdf</strong>, here are the key takeaways:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Revenue grew by 15% year-over-year.</li>
                    <li>The new "CogniFlow" feature increased user retention by 22%.</li>
                    <li>Marketing spend decreased by 5% due to higher organic reach.</li>
                  </ul>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6">
            <div className="w-full bg-[#eef2f7] shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff] rounded-2xl p-4 flex items-center gap-3">
              <div className="flex-1 text-slate-400 text-sm">Type a message or use @ai to ask a question...</div>
              <div className="w-10 h-10 rounded-xl bg-[#eef2f7] shadow-[4px_4px_8px_#d1d9e6,-4px_-4px_8px_#ffffff] flex items-center justify-center text-blue-500 cursor-pointer">
                <Sparkles size={18} />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="container mx-auto px-6 py-10 text-center text-slate-500 text-sm">
        <p>© 2026 CogniFlow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
