import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import ConnectionCard from "./components/ConnectionCard";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#eef2f7",
            color: "#0f172a",
            borderRadius: "12px",
            padding: "12px 16px",

            boxShadow: "6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff",

            border: "1px solid rgba(0,0,0,0.03)",
          },

          success: {
            iconTheme: {
              primary: "#2563eb",
              secondary: "#eef2f7",
            },
            style: {
              boxShadow:
                "6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff, 0 0 6px rgba(37,99,235,0.3)",
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
