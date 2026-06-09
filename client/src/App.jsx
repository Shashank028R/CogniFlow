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
            "rounded-xl px-4 py-3 bg-[var(--bg)] text-[var(--text)] shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] border border-black/5",

          success: {
            className:
              "shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light),0_0_6px_rgba(37,99,235,0.3)]",
            iconTheme: {
              primary: "#2563eb",
              secondary: "#eef2f7",
            },
          },

          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#eef2f7",
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