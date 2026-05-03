import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen text-center flex justify-center items-center">
      <button className="p-4 border border-2 cursor-pointer rounded-2xl" onClick={() => navigate("/auth")}>
        Go To Auth
      </button>
    </div>
  );
};

export default HomePage;
