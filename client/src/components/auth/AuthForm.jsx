import { useState, useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

const AuthForm = ({
  isLogin,
  isVerifying,
  form,
  handleChange,
  handleSubmit,
  setIsLogin,
  setIsVerifying,
  handleResendOTP,
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
    if (timeLeft > 0) return;
    handleResendOTP();
    setTimeLeft(30);
  };

  return (
    <>
      <div className="text-center mb-6">
        <div className="w-10 h-10 mx-auto rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg mb-3 shadow-sm">
          C
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Cogni<span className="text-blue-600 dark:text-blue-400">Flow</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isVerifying
            ? "Enter the 6-digit verification code sent to your email"
            : isLogin
            ? "Sign in to access your chat workspace"
            : "Create a new account to get started"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {!isLogin && !isVerifying && (
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Username</label>
            <Input
              type="text"
              name="username"
              placeholder="e.g. alex_chen"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {!isVerifying && (
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
            <Input
              type="email"
              name="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {!isVerifying && (
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Password</label>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {isVerifying && (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">6-Digit Code</label>
            <Input
              type="text"
              name="otp"
              placeholder="123456"
              value={form.otp}
              onChange={handleChange}
              className="text-center tracking-widest text-lg font-mono"
              maxLength={6}
              required
            />
            <div className="text-right pt-1">
              <span
                onClick={onResendClick}
                className={`text-xs font-medium transition-colors ${
                  timeLeft > 0
                    ? "text-slate-400 cursor-not-allowed"
                    : "text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                }`}
              >
                {timeLeft > 0 ? `Resend code in ${timeLeft}s` : "Resend code"}
              </span>
            </div>
          </div>
        )}

        <div className="pt-2">
          <Button variant="primary">
            {isVerifying ? "Verify & Complete" : isLogin ? "Sign In" : "Create Account"}
          </Button>
        </div>
      </form>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
          onClick={() => {
            setIsLogin(!isLogin);
            setIsVerifying(false);
          }}
        >
          {isLogin ? "Sign Up" : "Sign In"}
        </button>
      </p>
    </>
  );
};

export default AuthForm;