import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, Bot, Zap, Shield, CheckCheck, Eye, CloudUpload, FileText, ArrowRight } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-[#1d1d1f] dark:text-white antialiased font-sans">
      
      {/* 1. GLOBAL NAV (Apple 44px Black Nav Bar) */}
      <header className="bg-black text-[#f5f5f7] h-[44px] flex items-center justify-between px-6 text-[12px] font-normal tracking-[-0.12px] z-50 relative">
        <div className="max-w-[1020px] w-full mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-white hover:opacity-80 transition-opacity">
            <span className="font-semibold text-sm tracking-tight">CogniFlow</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-8 text-[#86868b]">
            <a href="#overview" className="hover:text-white transition-colors">Overview</a>
            <a href="#intelligence" className="hover:text-white transition-colors">Intelligence</a>
            <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-[#2997ff] hover:underline text-[12px]">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* 2. SUB-NAV FROSTED (Apple 52px Sticky Strip) */}
      <div className="sticky top-0 bg-[#f5f5f7]/80 dark:bg-[#1d1d1f]/80 backdrop-blur-md border-b border-[#e0e0e0] dark:border-[#333336] h-[52px] px-6 z-40 flex items-center">
        <div className="max-w-[1020px] w-full mx-auto flex items-center justify-between">
          <span className="text-[19px] font-semibold tracking-[0.231px] text-[#1d1d1f] dark:text-white">
            CogniFlow
          </span>
          <div className="flex items-center gap-5">
            <span className="text-xs text-[#86868b] hidden md:inline">Real-Time Messaging with Multimodal AI</span>
            <button
              onClick={() => navigate("/auth")}
              className="bg-[#0066cc] hover:bg-[#0071e3] text-white text-[12px] font-normal px-4 py-1.5 rounded-full active:scale-[0.95] transition-all cursor-pointer"
            >
              Launch App
            </button>
          </div>
        </div>
      </div>

      {/* 3. TILE 1: HERO TILE (Light Museum Canvas) */}
      <section id="overview" className="bg-white dark:bg-black py-20 md:py-28 px-6 text-center border-b border-[#e0e0e0] dark:border-[#333336]">
        <div className="max-w-[980px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0066cc] dark:text-[#2997ff] mb-3">
            Next-Generation Collaboration
          </p>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-[-0.025em] text-[#1d1d1f] dark:text-white leading-[1.07] mb-4">
            CogniFlow.
          </h1>
          <p className="text-xl md:text-2xl text-[#86868b] max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            Real-time chat meets multimodal intelligence. Impossibly fast, wonderfully quiet.
          </p>

          <div className="flex flex-row justify-center items-center gap-4 mb-16">
            <button
              onClick={() => navigate("/auth")}
              className="bg-[#0066cc] hover:bg-[#0071e3] text-white text-[16px] font-normal px-6 py-2.5 rounded-full active:scale-[0.95] transition-all cursor-pointer"
            >
              Get Started Free
            </button>
            <Link
              to="/about"
              className="border border-[#0066cc] text-[#0066cc] dark:text-[#2997ff] dark:border-[#2997ff] text-[16px] font-normal px-6 py-2.5 rounded-full active:scale-[0.95] hover:bg-[#0066cc]/5 transition-all"
            >
              Learn more
            </Link>
          </div>

          {/* Product Photography Surface Display with Apple Product Shadow */}
          <div className="relative max-w-4xl mx-auto">
            <div className="rounded-[18px] bg-[#f5f5f7] dark:bg-[#1d1d1f] border border-[#e0e0e0] dark:border-[#333336] p-4 md:p-6 shadow-apple-product text-left overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e0e0e0] dark:border-[#333336]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white dark:bg-[#272729] border border-[#e0e0e0] dark:border-[#333336] flex items-center justify-center font-semibold text-xs text-[#0066cc] dark:text-[#2997ff]">
                    CF
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-white">Product Strategy Room</h3>
                    <p className="text-xs text-[#86868b]">3 participants • Active socket</p>
                  </div>
                </div>
                <span className="text-xs text-[#34c759] font-medium bg-[#34c759]/10 px-2.5 py-1 rounded-full">
                  Live
                </span>
              </div>

              <div className="space-y-4 py-2">
                {/* Outgoing Message */}
                <div className="flex justify-end">
                  <div className="bg-[#0066cc] text-white rounded-[18px] rounded-br-[4px] px-4 py-2.5 max-w-md text-sm">
                    <p>Attached the latest architectural roadmap. <span className="font-semibold text-white/90">@cogni</span> can you summarize the key shifts?</p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-white/70 text-[10px]">
                      <span>10:24 AM</span>
                      <CheckCheck size={13} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* CogniBot Reply */}
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#272729] text-[#1d1d1f] dark:text-white border border-[#e0e0e0] dark:border-[#333336] rounded-[18px] rounded-bl-[4px] px-4 py-3 max-w-lg text-sm">
                    <div className="flex items-center gap-1.5 mb-1.5 text-xs text-[#0066cc] dark:text-[#2997ff] font-semibold">
                      <Sparkles size={13} />
                      <span>CogniBot Intelligence</span>
                    </div>
                    <p className="text-sm text-[#1d1d1f] dark:text-[#f5f5f7] leading-relaxed">
                      Based on the roadmap, the primary shifts are: 1) transition to single-tone Apple design grammar, 2) multimodal vision attachments, and 3) real-time state delivery tracking.
                    </p>
                    <div className="text-[10px] text-[#86868b] mt-1 text-right">
                      10:24 AM
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. TILE 2: COGNIBOT AI (Edge-to-Edge Dark Museum Tile #272729) */}
      <section id="intelligence" className="bg-[#272729] text-white py-24 md:py-32 px-6 text-center">
        <div className="max-w-[980px] mx-auto">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2997ff] mb-3">
            CogniBot Architecture
          </p>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.025em] text-white leading-[1.1] mb-6">
            Intelligence built right into every room.
          </h2>
          <p className="text-lg md:text-xl text-[#cccccc] max-w-2xl mx-auto font-normal leading-relaxed mb-10">
            Type <strong className="text-white font-medium">@cogni</strong> in any group discussion. CogniBot inspects file attachments, visualizes diagrams, and answers queries with native Gemini vision capabilities.
          </p>

          <div className="inline-flex items-center gap-2 text-[#2997ff] text-[17px] hover:underline cursor-pointer mb-16" onClick={() => navigate("/auth")}>
            <span>Experience CogniBot in real time</span>
            <ArrowRight size={16} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
            <div className="bg-[#2a2a2c] border border-[#333336] rounded-[18px] p-6">
              <Eye size={24} className="text-[#2997ff] mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Multimodal Vision</h3>
              <p className="text-sm text-[#cccccc] leading-relaxed">CogniBot reads uploaded PNGs, JPEGs, and PDFs directly in context, describing diagrams and charts with precision.</p>
            </div>
            <div className="bg-[#2a2a2c] border border-[#333336] rounded-[18px] p-6">
              <Zap size={24} className="text-[#2997ff] mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">In-Room Context</h3>
              <p className="text-sm text-[#cccccc] leading-relaxed">No separate AI chat tabs. CogniBot participates inside the shared conversation where your team already collaborates.</p>
            </div>
            <div className="bg-[#2a2a2c] border border-[#333336] rounded-[18px] p-6">
              <FileText size={24} className="text-[#2997ff] mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Document Synthesis</h3>
              <p className="text-sm text-[#cccccc] leading-relaxed">Synthesize lengthy briefs, extract data points, and verify figures in seconds right within the thread.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TILE 3: PARCHMENT UTILITY GRID (#f5f5f7) */}
      <section id="capabilities" className="bg-[#f5f5f7] dark:bg-[#1d1d1f] py-24 md:py-32 px-6 border-b border-[#e0e0e0] dark:border-[#333336]">
        <div className="max-w-[1020px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#86868b] mb-2">
              Capabilities
            </p>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.025em] text-[#1d1d1f] dark:text-white">
              Engineered for speed. Built for focus.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white dark:bg-[#272729] rounded-[18px] border border-[#e0e0e0] dark:border-[#333336] p-7 flex flex-col justify-between">
              <div>
                <Zap size={24} className="text-[#0066cc] dark:text-[#2997ff] mb-4" />
                <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-white mb-2">Instant WebSockets</h3>
                <p className="text-sm text-[#86868b] leading-relaxed">Socket.IO real-time event pipeline ensures zero polling and zero latency across 1-on-1 and group chats.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-[#272729] rounded-[18px] border border-[#e0e0e0] dark:border-[#333336] p-7 flex flex-col justify-between">
              <div>
                <CheckCheck size={24} className="text-[#0066cc] dark:text-[#2997ff] mb-4" />
                <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-white mb-2">Delivery Receipts</h3>
                <p className="text-sm text-[#86868b] leading-relaxed">Three-stage message verification: sent to server, delivered to devices, and read by participants.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-[#272729] rounded-[18px] border border-[#e0e0e0] dark:border-[#333336] p-7 flex flex-col justify-between">
              <div>
                <CloudUpload size={24} className="text-[#0066cc] dark:text-[#2997ff] mb-4" />
                <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-white mb-2">Cloudinary Media</h3>
                <p className="text-sm text-[#86868b] leading-relaxed">Instant upload and compression for images and documents with client-side crop preview controls.</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white dark:bg-[#272729] rounded-[18px] border border-[#e0e0e0] dark:border-[#333336] p-7 flex flex-col justify-between">
              <div>
                <Shield size={24} className="text-[#0066cc] dark:text-[#2997ff] mb-4" />
                <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-white mb-2">Granular Room Controls</h3>
                <p className="text-sm text-[#86868b] leading-relaxed">Create public or restricted rooms, manage members, rename groups, and administer permissions effortlessly.</p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white dark:bg-[#272729] rounded-[18px] border border-[#e0e0e0] dark:border-[#333336] p-7 flex flex-col justify-between">
              <div>
                <Sparkles size={24} className="text-[#0066cc] dark:text-[#2997ff] mb-4" />
                <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-white mb-2">Live Typing Feed</h3>
                <p className="text-sm text-[#86868b] leading-relaxed">Visual feedback indicates when teammates or CogniBot are assembling responses.</p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-white dark:bg-[#272729] rounded-[18px] border border-[#e0e0e0] dark:border-[#333336] p-7 flex flex-col justify-between">
              <div>
                <Bot size={24} className="text-[#0066cc] dark:text-[#2997ff] mb-4" />
                <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-white mb-2">Edit & Delete for Everyone</h3>
                <p className="text-sm text-[#86868b] leading-relaxed">Fine-grained message lifecycle: edit typos in real time or remove messages for all participants.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TILE 4: PRIVACY EDITORIAL TILE (Near-Black #252527) */}
      <section id="privacy" className="bg-[#252527] text-white py-24 md:py-32 px-6 text-center">
        <div className="max-w-[800px] mx-auto">
          <Shield size={36} className="text-[#2997ff] mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.025em] text-white mb-4">
            Privacy. That's CogniFlow.
          </h2>
          <p className="text-xl md:text-2xl text-[#cccccc] font-light leading-relaxed mb-8">
            Your conversations belong to you and your team. Protected authentication, isolated room boundaries, and zero third-party telemetry.
          </p>
          <div className="inline-flex items-center gap-1.5 text-[#2997ff] hover:underline cursor-pointer" onClick={() => navigate("/about")}>
            <span>Read our security architecture</span>
            <ArrowRight size={15} />
          </div>
        </div>
      </section>

      {/* 7. FOOTER (Apple Relaxed Leading Links) */}
      <footer className="bg-[#f5f5f7] dark:bg-[#1d1d1f] py-16 px-6 text-xs text-[#86868b] border-t border-[#e0e0e0] dark:border-[#333336]">
        <div className="max-w-[1020px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold text-[#1d1d1f] dark:text-white mb-3">Product</h4>
              <ul className="space-y-2.5">
                <li><a href="#overview" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">Overview</a></li>
                <li><a href="#intelligence" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">CogniBot AI</a></li>
                <li><a href="#capabilities" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">Capabilities</a></li>
                <li><Link to="/auth" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">Launch Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1d1d1f] dark:text-white mb-3">Explore</h4>
              <ul className="space-y-2.5">
                <li><Link to="/about" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">About Us</Link></li>
                <li><a href="https://github.com/Shashank028R/CogniFlow" target="_blank" rel="noopener noreferrer" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">GitHub Repository</a></li>
                <li><a href="#privacy" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">Privacy Architecture</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1d1d1f] dark:text-white mb-3">Account</h4>
              <ul className="space-y-2.5">
                <li><Link to="/auth" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/auth" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">Create Account</Link></li>
                <li><Link to="/profile" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">User Settings</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1d1d1f] dark:text-white mb-3">Developer</h4>
              <p className="leading-relaxed mb-3">
                Crafted by Shashank R. Full-stack intelligent communication system.
              </p>
              <a href="https://github.com/Shashank028R" target="_blank" rel="noopener noreferrer" className="text-[#0066cc] dark:text-[#2997ff] hover:underline">
                GitHub Profile →
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-[#e0e0e0] dark:border-[#333336] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 CogniFlow. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#privacy" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">Privacy Policy</a>
              <a href="#overview" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">Terms of Use</a>
              <Link to="/about" className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
