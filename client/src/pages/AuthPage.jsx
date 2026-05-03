import React from "react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { set } from "mongoose";
import { useNavigate } from "react-router-dom";

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

    if (isVerifying) {
      const url = `${BackendUrl}/api/auth/verify-email`;
      const { data } = await axios.post(url, form.email, form.otp);

      toast.success("Email Verified!, You can login now");
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
      localStorage.setItem("userid", data.id);

      toast.success("Login Successful!");
      navigate('/dashboard', {replace: true});
    }
  };
  return <></>;
};

export default AuthPage;
