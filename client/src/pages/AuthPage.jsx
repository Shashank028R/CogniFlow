import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Card from "../components/ui/Card";
import AuthForm from "../components/auth/AuthForm";

const AuthPage = () => {
  const navigate = useNavigate();
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLogin, setIsLogin] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    otp: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Processing...");

    try {
      if (isVerifying) {
        await axios.post(`${BackendUrl}/api/auth/verify-email`, {
          email: form.email,
          otp: form.otp,
        });

        toast.success("Email Verified!", { id: toastId });
        setIsVerifying(false);
        setIsLogin(true);
        return;
      }

      const url = isLogin
        ? `${BackendUrl}/api/auth/login`
        : `${BackendUrl}/api/auth/register`;

      const { data } = await axios.post(url, form);

      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userid", data.user.id);

        toast.success("Login Successful!", { id: toastId });
        navigate("/dashboard", { replace: true });
      } else {
        setIsVerifying(true);
        toast.success("OTP Sent!", { id: toastId });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred", {
        id: toastId,
      });
    }
  };

  const handleResendOTP = async () => {
    const toastId = toast.loading("Resending OTP...");
    try {
      await axios.post(`${BackendUrl}/api/auth/register`, {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      toast.success("A new OTP has been sent!", { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP", {
        id: toastId,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 z-10 relative">
      <div className="w-full max-w-md mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={14} /> Back to home
        </Link>
      </div>

      <div className="w-full max-w-md">
        <Card className="shadow-lg border-slate-200 dark:border-slate-800">
          <AuthForm
            isLogin={isLogin}
            isVerifying={isVerifying}
            form={form}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setIsLogin={setIsLogin}
            setIsVerifying={setIsVerifying}
            handleResendOTP={handleResendOTP}
          />
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
