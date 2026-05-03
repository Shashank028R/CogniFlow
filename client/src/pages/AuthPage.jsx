import React from "react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.css";

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

    try {
      if (isVerifying) {
        const url = `${BackendUrl}/api/auth/verify-email`;
        const { data } = await axios.post(url, {
          email: form.email,
          otp: form.otp,
        });

        toast.success("Email Verified!, You can login now");
        setIsVerifying(false);
        setIsLogin(true);
        return;
      }

      const url = isLogin
        ? `${BackendUrl}/api/auth/login`
        : `${BackendUrl}/api/auth/register`;

      const toastId = toast.loading("Processing...");
      const { data } = await axios.post(url, form);

      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userid", data.id);

        toast.success("Login Successful!");
        navigate("/dashboard", { replace: true });
      } else {
        setIsVerifying(true);
        toast.success("OTP Sent!, Please Verify Your Email.", { id: toastId });
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data?.message || "Backend error");
      } else if (error.request) {
        toast.error("Server not responding");
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <>
      <div className={styles.container}>
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <h2 className={styles.title}>
              Welcome to{" "}
              <span className={styles.brand}>
                Cogni<span className={styles.subBrand}>Flow</span>
              </span>
            </h2>

            <p className={styles.subtitle}>
              {isVerifying
                ? "Verify your email with OTP"
                : isLogin
                  ? "Login to your account"
                  : "Create your account"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && !isVerifying && (
                <input
                  type="text"
                  name="username"
                  required
                  minLength={3}
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  className={styles.input}
                />
              )}

              {!isVerifying && (
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className={styles.input}
                />
              )}

              {!isVerifying && (
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className={styles.input}
                />
              )}

              {isVerifying && (
                <input
                  type="text"
                  name="otp"
                  required
                  minLength={6}
                  maxLength={6}
                  placeholder="Enter OTP"
                  value={form.otp}
                  onChange={handleChange}
                  className={styles.input}
                />
              )}

              <button type="submit" className={styles.button}>
                {isVerifying ? "Verify OTP" : isLogin ? "Login" : "Register"}
              </button>
            </form>
            <p className={styles.switchText}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                className={styles.switchLink}
                onClick={() => {
                  setIsLogin(!isLogin);
                  setIsVerifying(false); // reset state
                }}
              >
                {isLogin ? "Register" : "Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
