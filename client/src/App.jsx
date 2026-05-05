import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <div className="bg-[#eef2f7] min-h-screen">
      
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "rounded-xl px-4 py-3 bg-[#eef2f7] text-slate-900 shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff] border border-black/5",

          success: {
            className:
              "shadow-[6px_6px_12px_#d1d9e6,-6px_-6px_12px_#ffffff,0_0_6px_rgba(37,99,235,0.3)]",
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
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;