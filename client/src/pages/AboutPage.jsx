import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Code, Terminal, Sparkles } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";
import Card from "../components/ui/Card";

const AboutPage = () => {
  return (
    <div className="min-h-screen font-sans text-[var(--text)] relative z-10 overflow-hidden bg-[var(--bg)] flex flex-col">
      
      {/* Decorative background elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 relative z-20">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Home</span>
        </Link>
      </nav>

      <main className="container mx-auto px-6 flex-1 flex flex-col justify-center items-center py-12 relative z-20">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[var(--bg)] shadow-[10px_10px_20px_var(--shadow-dark),-10px_-10px_20px_var(--shadow-light)] text-blue-600 mb-6">
            <Code size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Developer</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg">
            Hi, I'm Shashank Kumar. I built CogniFlow to explore the intersection of real-time communication and native artificial intelligence.
          </p>
        </div>

        <Card className="w-full max-w-2xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-[var(--bg)] shadow-[inset_3px_3px_6px_var(--shadow-dark),inset_-3px_-3px_6px_var(--shadow-light)] flex items-center justify-center text-indigo-500">
              <Terminal size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Connect with me</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Feel free to reach out for queries, feedback, or collaboration!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <a href="mailto:shashankmuz3@gmail.com" className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg)] shadow-[4px_4px_10px_var(--shadow-dark),-4px_-4px_10px_var(--shadow-light)] hover:shadow-[inset_4px_4px_10px_var(--shadow-dark),inset_-4px_-4px_10px_var(--shadow-light)] transition-all group">
              <div className="w-12 h-12 rounded-full bg-[var(--bg)] flex items-center justify-center text-rose-500 shadow-[inset_2px_2px_5px_var(--shadow-dark),inset_-2px_-2px_5px_var(--shadow-light)]">
                <FaEnvelope size={20} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-slate-500 uppercase tracking-wider">Email</span>
                <span className="font-medium text-[var(--text)]">shashankmuz3@gmail.com</span>
              </div>
            </a>

            <a href="https://github.com/Shashank028R/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg)] shadow-[4px_4px_10px_var(--shadow-dark),-4px_-4px_10px_var(--shadow-light)] hover:shadow-[inset_4px_4px_10px_var(--shadow-dark),inset_-4px_-4px_10px_var(--shadow-light)] transition-all group">
              <div className="w-12 h-12 rounded-full bg-[var(--bg)] flex items-center justify-center text-slate-700 dark:text-white shadow-[inset_2px_2px_5px_var(--shadow-dark),inset_-2px_-2px_5px_var(--shadow-light)]">
                <FaGithub size={20} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-slate-500 uppercase tracking-wider">GitHub</span>
                <span className="font-medium text-[var(--text)]">Shashank028R</span>
              </div>
            </a>

            <a href="https://www.linkedin.com/in/shashank-kumar-70742b292/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg)] shadow-[4px_4px_10px_var(--shadow-dark),-4px_-4px_10px_var(--shadow-light)] hover:shadow-[inset_4px_4px_10px_var(--shadow-dark),inset_-4px_-4px_10px_var(--shadow-light)] transition-all group">
              <div className="w-12 h-12 rounded-full bg-[var(--bg)] flex items-center justify-center text-blue-600 shadow-[inset_2px_2px_5px_var(--shadow-dark),inset_-2px_-2px_5px_var(--shadow-light)]">
                <FaLinkedin size={20} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-slate-500 uppercase tracking-wider">LinkedIn</span>
                <span className="font-medium text-[var(--text)]">Shashank Kumar</span>
              </div>
            </a>

            <a href="https://www.instagram.com/shashank__.kumar/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg)] shadow-[4px_4px_10px_var(--shadow-dark),-4px_-4px_10px_var(--shadow-light)] hover:shadow-[inset_4px_4px_10px_var(--shadow-dark),inset_-4px_-4px_10px_var(--shadow-light)] transition-all group">
              <div className="w-12 h-12 rounded-full bg-[var(--bg)] flex items-center justify-center text-pink-500 shadow-[inset_2px_2px_5px_var(--shadow-dark),inset_-2px_-2px_5px_var(--shadow-light)]">
                <FaInstagram size={20} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-slate-500 uppercase tracking-wider">Instagram</span>
                <span className="font-medium text-[var(--text)]">@shashank__.kumar</span>
              </div>
            </a>

          </div>
        </Card>

      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-500 text-sm relative z-20">
        <p className="flex items-center justify-center gap-1">
          Built with <Sparkles size={14} className="text-yellow-500" /> by Shashank Kumar
        </p>
      </footer>
    </div>
  );
};

export default AboutPage;
