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
      <h2 className="text-center text-[24px] font-semibold text-[#1d1d1f] dark:text-white tracking-tight mb-1">
        Cogni<span className="text-[#0066cc] dark:text-[#2997ff]">Flow</span>
      </h2>

      <p className="text-center text-[14px] text-[#86868b] mb-6 font-normal">
        {isVerifying
          ? "Verify your email with the one-time code"
          : isLogin
          ? "Sign in with your CogniFlow account"
          : "Create your new CogniFlow account"}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && !isVerifying && (
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
        )}

        {!isVerifying && (
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
        )}

        {!isVerifying && (
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
        )}

        {isVerifying && (
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              name="otp"
              placeholder="Enter 6-digit code"
              value={form.otp}
              onChange={handleChange}
            />
            <div className="text-right">
              <span
                onClick={onResendClick}
                className={`text-xs font-normal transition-colors ${
                  timeLeft > 0
                    ? "text-[#86868b] cursor-not-allowed"
                    : "text-[#0066cc] dark:text-[#2997ff] cursor-pointer hover:underline"
                }`}
              >
                {timeLeft > 0 ? `Resend code in ${timeLeft}s` : "Resend code"}
              </span>
            </div>
          </div>
        )}

        <Button>
          {isVerifying ? "Verify Code" : isLogin ? "Sign In" : "Create Account"}
        </Button>
      </form>

      <p className="text-center text-[14px] text-[#86868b] mt-5">
        {isLogin
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
        <span
          className="text-[#0066cc] dark:text-[#2997ff] cursor-pointer hover:underline"
          onClick={() => {
            setIsLogin(!isLogin);
            setIsVerifying(false);
          }}
        >
          {isLogin ? "Sign up" : "Sign in"}
        </span>
      </p>
    </>
  );
};

export default AuthForm;