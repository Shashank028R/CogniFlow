import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import ConnectionCard from "./components/ConnectionCard";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <div className="flex justify-center min-h-screen items-center p-4 flex-col">
        <ConnectionCard />
      </div>
      
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#020617",
            color: "#22d3ee",
            border: "1px solid rgba(34,211,238,0.3)",
            boxShadow: "0 0 10px rgba(34,211,238,0.6)",
          },
        }}
      />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
