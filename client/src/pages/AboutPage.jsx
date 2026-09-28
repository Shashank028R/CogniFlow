import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Code, Terminal } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="min-h-screen font-sans text-[#1d1d1f] dark:text-white bg-[#f5f5f7] dark:bg-[#000000] flex flex-col">
      {/* Navbar */}
      <nav className="max-w-[980px] w-full mx-auto px-6 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#0066cc] dark:text-[#2997ff] hover:underline transition-colors">
          <ArrowLeft size={16} />
          <span>CogniFlow Overview</span>
        </Link>
      </nav>

      <main className="max-w-[800px] w-full mx-auto px-6 flex-1 flex flex-col justify-center items-center py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[18px] bg-white dark:bg-[#1d1d1f] border border-[#e0e0e0] dark:border-[#333336] text-[#0066cc] dark:text-[#2997ff] mb-4">
            <Code size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-[-0.025em] mb-3 text-[#1d1d1f] dark:text-white">
            Meet the Developer
          </h1>
          <p className="text-[#86868b] max-w-xl mx-auto text-base md:text-lg font-normal leading-relaxed">
            Crafted by Shashank Kumar to explore the synthesis of real-time communication protocols and native multimodal vision models.
          </p>
        </div>

        <div className="w-full bg-white dark:bg-[#1d1d1f] rounded-[18px] border border-[#e0e0e0] dark:border-[#333336] p-6 md:p-10">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#e0e0e0] dark:border-[#333336]">
            <div className="w-10 h-10 rounded-[11px] bg-[#f5f5f7] dark:bg-[#272729] border border-[#e0e0e0] dark:border-[#333336] flex items-center justify-center text-[#1d1d1f] dark:text-white">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-white tracking-tight">Connect with Shashank</h2>
              <p className="text-xs text-[#86868b]">Reach out for architecture discussions, questions, or collaboration.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="mailto:shashankmuz3@gmail.com"
              className="flex items-center gap-4 p-4 rounded-[14px] bg-[#f5f5f7] dark:bg-[#272729] border border-[#e0e0e0] dark:border-[#333336] hover:border-[#0066cc] dark:hover:border-[#2997ff] active:scale-[0.98] transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1d1d1f] border border-[#e0e0e0] dark:border-[#333336] flex items-center justify-center text-[#ff3b30]">
                <FaEnvelope size={18} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs text-[#86868b] uppercase tracking-wider font-semibold">Email</span>
                <span className="text-sm font-medium text-[#1d1d1f] dark:text-white truncate">shashankmuz3@gmail.com</span>
              </div>
            </a>

            <a
              href="https://github.com/Shashank028R/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-[14px] bg-[#f5f5f7] dark:bg-[#272729] border border-[#e0e0e0] dark:border-[#333336] hover:border-[#0066cc] dark:hover:border-[#2997ff] active:scale-[0.98] transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1d1d1f] border border-[#e0e0e0] dark:border-[#333336] flex items-center justify-center text-[#1d1d1f] dark:text-white">
                <FaGithub size={18} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs text-[#86868b] uppercase tracking-wider font-semibold">GitHub</span>
                <span className="text-sm font-medium text-[#1d1d1f] dark:text-white truncate">Shashank028R</span>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/shashank-kumar-70742b292/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-[14px] bg-[#f5f5f7] dark:bg-[#272729] border border-[#e0e0e0] dark:border-[#333336] hover:border-[#0066cc] dark:hover:border-[#2997ff] active:scale-[0.98] transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1d1d1f] border border-[#e0e0e0] dark:border-[#333336] flex items-center justify-center text-[#0066cc] dark:text-[#2997ff]">
                <FaLinkedin size={18} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs text-[#86868b] uppercase tracking-wider font-semibold">LinkedIn</span>
                <span className="text-sm font-medium text-[#1d1d1f] dark:text-white truncate">Shashank Kumar</span>
              </div>
            </a>

            <a
              href="https://www.instagram.com/shashank__.kumar/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-[14px] bg-[#f5f5f7] dark:bg-[#272729] border border-[#e0e0e0] dark:border-[#333336] hover:border-[#0066cc] dark:hover:border-[#2997ff] active:scale-[0.98] transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-white dark:bg-[#1d1d1f] border border-[#e0e0e0] dark:border-[#333336] flex items-center justify-center text-[#e1306c]">
                <FaInstagram size={18} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs text-[#86868b] uppercase tracking-wider font-semibold">Instagram</span>
                <span className="text-sm font-medium text-[#1d1d1f] dark:text-white truncate">@shashank__.kumar</span>
              </div>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-[#86868b]">
        <p>© 2026 CogniFlow. Designed with Apple Design System principles.</p>
      </footer>
    </div>
  );
};

export default AboutPage;
