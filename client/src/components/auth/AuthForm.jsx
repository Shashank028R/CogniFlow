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
}) => {
  return (
    <>
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
          <Input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={form.otp}
            onChange={handleChange}
          />
        )}

        <Button>
          {isVerifying ? "Verify OTP" : isLogin ? "Login" : "Register"}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-4">
        {isLogin
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
        <span
          className="text-blue-600 cursor-pointer font-medium hover:drop-shadow-[0_0_6px_rgba(37,99,235,0.4)]"
          onClick={() => {
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