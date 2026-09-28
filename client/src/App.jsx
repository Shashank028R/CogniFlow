import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ParticleBackground from "./components/ui/ParticleBackground";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="bg-[var(--bg)] min-h-screen relative z-0 transition-colors duration-500">
      <ParticleBackground />
      
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "rounded-[18px] px-4 py-3 bg-white dark:bg-[#272729] text-[#1d1d1f] dark:text-[#f5f5f7] border border-[#e0e0e0] dark:border-[#333336] shadow-none text-[14px]",
          success: {
            iconTheme: {
              primary: "#0066cc",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ff3b30",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;