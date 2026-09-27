import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Code, Terminal, Mail, MessageSquare } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Card from "../components/ui/Card";

const AboutPage = () => {
  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <nav className="container mx-auto px-6 py-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </nav>

      <main className="container mx-auto px-6 flex-1 flex flex-col justify-center items-center py-12">
        <div className="text-center mb-10 max-w-xl">
          <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
            <Code size={24} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            About the Developer
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Hi, I'm Shashank Kumar. I built CogniFlow as an exploration of high-performance real-time WebSockets and native multimodal AI assistant integration.
          </p>
        </div>

        <Card className="w-full max-w-2xl border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="text-base font-semibold">Contact & Links</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Feel free to reach out for questions, feedback, or collaboration.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="mailto:shashankmuz3@gmail.com"
              className="flex items-center gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                <Mail size={18} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Email</span>
                <span className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">shashankmuz3@gmail.com</span>
              </div>
            </a>

            <a
              href="https://github.com/Shashank028R/CogniFlow"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center flex-shrink-0">
                <FaGithub size={18} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">GitHub</span>
                <span className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">Shashank028R/CogniFlow</span>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/shashank-kumar-70742b292/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                <FaLinkedin size={18} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">LinkedIn</span>
                <span className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">Shashank Kumar</span>
              </div>
            </a>

            <div className="flex items-center gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                <MessageSquare size={18} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Project</span>
                <span className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">CogniFlow v1.0 Production</span>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AboutPage;
