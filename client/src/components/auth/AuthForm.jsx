import { useState, useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

const AuthForm = ({
  isLogin,
  isVerifying,
  isProcessing = false,
  form,
  handleChange,
  handleSubmit,
  setIsLogin,
  setIsVerifying,
  handleResendOTP,
  handleFillDemo,
  handleQuickDemoLogin,
}) => {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!isVerifying) {
      setTimeLeft(30);
      return;
    }
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isVerifying, timeLeft]);

  const onResendClick = () => {
    if (timeLeft > 0 || isProcessing) return;
    handleResendOTP();
    setTimeLeft(30);
  };

  return (
    <>
      <div className="flex justify-center mb-3">
        <div className="w-14 h-14 rounded-2xl bg-white/20 dark:bg-white/5 p-2 shadow-sm border border-white/20 flex items-center justify-center">
          <img src="/images/CogniFlow.png" alt="CogniFlow Logo" className="w-full h-full object-contain" />
        </div>
      </div>
      <h2 className="text-center text-xl font-semibold text-[var(--text)] mb-1">
        Welcome to{" "}
        <span className="text-blue-600 drop-shadow-[0_0_6px_rgba(37,99,235,0.5)]">
          Cogni
          <span className="text-green-500 drop-shadow-[0_0_6px_rgba(37,235,67,0.5)]">
            Flow
          </span>
        </span>
      </h2>

      <p className="text-center text-sm text-slate-500 mb-4">
        {isVerifying
          ? "Verify your email with OTP"
          : isLogin
          ? "Login to your account"
          : "Create your account"}
      </p>

      {/* QUICK DEMO ACCOUNTS SECTION (LOGIN MODE ONLY) */}
      {isLogin && !isVerifying && (
        <div className="mb-5 p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 shadow-xs animate-[fadeIn_0.2s_ease]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold tracking-wide uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <span>🚀</span>
              <span>Quick Demo Testing</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              1-Click Instant Login
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleQuickDemoLogin && handleQuickDemoLogin("Demo1")}
              className="group flex flex-col items-center justify-center p-2.5 rounded-xl border border-blue-200/90 dark:border-blue-800/80 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-400 shadow-xs hover:shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
              title="1-Click Login as Demo1"
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-blue-600 dark:text-blue-400">
                <span className="text-sm transition-transform duration-200 group-hover:scale-110">👤</span>
                <span>Demo 1</span>
              </div>
              <span className="text-[10px] text-slate-400 truncate max-w-[120px] mt-0.5">
                demo1@cogniflow.com
              </span>
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleQuickDemoLogin && handleQuickDemoLogin("Demo2")}
              className="group flex flex-col items-center justify-center p-2.5 rounded-xl border border-indigo-200/90 dark:border-indigo-800/80 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:border-indigo-400 shadow-xs hover:shadow-[0_4px_12px_rgba(99,102,241,0.2)] active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
              title="1-Click Login as Demo2"
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-600 dark:text-indigo-400">
                <span className="text-sm transition-transform duration-200 group-hover:scale-110">👤</span>
                <span>Demo 2</span>
              </div>
              <span className="text-[10px] text-slate-400 truncate max-w-[120px] mt-0.5">
                demo2@cogniflow.com
              </span>
            </button>
          </div>

          <div className="mt-2 text-center text-[10px] text-slate-400">
            Pass: <code className="bg-slate-200/60 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-slate-600 dark:text-slate-300">DemoUser@123</code>
          </div>

          <div className="relative flex py-1.5 items-center my-1.5">
            <div className="flex-grow border-t border-slate-200/80 dark:border-slate-800"></div>
            <span className="flex-shrink mx-2 text-[10px] text-slate-400 uppercase font-semibold">Or enter manually</span>
            <div className="flex-grow border-t border-slate-200/80 dark:border-slate-800"></div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && !isVerifying && (
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            disabled={isProcessing}
            required
          />
        )}

        {!isVerifying && (
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            disabled={isProcessing}
            required
          />
        )}

        {!isVerifying && (
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            disabled={isProcessing}
            required
          />
        )}

        {isVerifying && (
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={form.otp}
              onChange={handleChange}
              disabled={isProcessing}
              maxLength={6}
              required
            />
            <div className="text-right">
              <span
                onClick={onResendClick}
                className={`text-xs font-medium transition-colors ${
                  timeLeft > 0 || isProcessing
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 cursor-pointer hover:text-blue-500"
                }`}
              >
                {timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : "Resend OTP?"}
              </span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isProcessing}
          className={`flex items-center justify-center gap-2 transition-all ${
            isProcessing ? "opacity-75 cursor-not-allowed scale-[0.99]" : ""
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : isVerifying ? (
            "Verify OTP"
          ) : isLogin ? (
            "Login"
          ) : (
            "Register"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-4">
        {isLogin
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
        <span
          className={`text-blue-600 font-medium hover:drop-shadow-[0_0_6px_rgba(37,99,235,0.4)] ${
            isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={() => {
            if (isProcessing) return;
            setIsLogin(!isLogin);
            setIsVerifying(false);
          }}
        >
          {isLogin ? "Register" : "Login"}
        </span>
      </p>
    </>
  );
};

export default AuthForm;