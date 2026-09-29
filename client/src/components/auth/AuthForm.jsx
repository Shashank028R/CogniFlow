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

      <p className="text-center text-sm text-slate-500 mb-6">
        {isVerifying
          ? "Verify your email with OTP"
          : isLogin
          ? "Login to your account"
          : "Create your account"}
      </p>

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