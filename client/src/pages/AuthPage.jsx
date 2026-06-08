import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent p-4 z-10 relative">
      <div className="w-full max-w-md">
        <Card>
          <AuthForm
            isLogin={isLogin}
            isVerifying={isVerifying}
            form={form}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setIsLogin={setIsLogin}
            setIsVerifying={setIsVerifying}
          />
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
