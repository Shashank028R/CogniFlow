import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Code, Terminal, Sparkles } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";
import Card from "../components/ui/Card";

const AboutPage = () => {
  return (
    <div className="min-h-screen font-sans text-[var(--text)] relative z-10 overflow-hidden bg-transparent flex flex-col">
      
      {/* Decorative background elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 relative z-20">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </nav>

      <main className="container mx-auto px-6 flex-1 flex flex-col justify-center items-center py-8 relative z-20">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 text-blue-600 mb-4 shadow-xs">
            <Code size={28} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Developer</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Hi, I'm Shashank Kumar. I built CogniFlow to explore the intersection of real-time communication and native artificial intelligence.
          </p>
        </div>

        <Card className="w-full max-w-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200/80 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-500 shadow-xs">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Connect with me</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Feel free to reach out for queries, feedback, or collaboration!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <a href="mailto:shashankmuz3@gmail.com" className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-sm hover:border-blue-500/40 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/60 flex items-center justify-center text-rose-500 flex-shrink-0">
                <FaEnvelope size={16} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-semibold text-[11px] text-slate-400 uppercase tracking-wider">Email</span>
                <span className="font-medium text-xs text-[var(--text)] truncate">shashankmuz3@gmail.com</span>
              </div>
            </a>

            <a href="https://github.com/Shashank028R/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-sm hover:border-blue-500/40 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-slate-700 dark:text-white flex-shrink-0">
                <FaGithub size={16} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-semibold text-[11px] text-slate-400 uppercase tracking-wider">GitHub</span>
                <span className="font-medium text-xs text-[var(--text)] truncate">Shashank028R</span>
              </div>
            </a>

            <a href="https://www.linkedin.com/in/shashank-kumar-70742b292/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-sm hover:border-blue-500/40 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-center text-blue-600 flex-shrink-0">
                <FaLinkedin size={16} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-semibold text-[11px] text-slate-400 uppercase tracking-wider">LinkedIn</span>
                <span className="font-medium text-xs text-[var(--text)] truncate">Shashank Kumar</span>
              </div>
            </a>

            <a href="https://www.instagram.com/shashank__.kumar/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-sm hover:border-blue-500/40 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-pink-50 dark:bg-pink-950/40 border border-pink-200/60 dark:border-pink-800/60 flex items-center justify-center text-pink-500 flex-shrink-0">
                <FaInstagram size={16} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-semibold text-[11px] text-slate-400 uppercase tracking-wider">Instagram</span>
                <span className="font-medium text-xs text-[var(--text)] truncate">@shashank__.kumar</span>
              </div>
            </a>

          </div>
        </Card>

      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-slate-500 text-xs relative z-20">
        <p className="flex items-center justify-center gap-1">
          Built with <Sparkles size={13} className="text-amber-500" /> by Shashank Kumar
        </p>
      </footer>
    </div>
  );
};

export default AboutPage;
