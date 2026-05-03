import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const socket = io(import.meta.env.VITE_BACKEND_URL);

import React from "react";

const ConnectionCard = () => {
  const navigate = useNavigate();
  const [clientStatus, setClientStatus] = useState(false);
  const [serverStatus, setServerStatus] = useState("Disconnected");

  useEffect(() => {
    socket.on("message", (data) => {
      setServerStatus(data.message);
    });
    return () => {
      socket.off("message");
    };
  }, []);

  const handleConnect = () => {
    setServerStatus("Sending Message");
    setClientStatus(true);

    socket.emit("message", {
      message: "This is the message from client side.",
    });
    setTimeout(() => {
      navigate("/auth");
    }, 2000);
  };

  return (
    <>
      <p className="text-blue-400 flex items-center justify-center">
        <span className="font-bold drop-shadow-[0_0_8px_rgba(102,252,241,0.8)] mr-2">
          client:
        </span>
        {!clientStatus ? (
          <span className="text-gray-400 font-semibold">
            Click on the button
          </span>
        ) : (
          <span className="text-green-400 font-semibold">
            Button is Clicked.
          </span>
        )}
      </p>
      <p className="text-gray-400 mb-6 h-12 flex items-center justify-center">
        <span className="text-red-500 font-bold drop-shadow-[0_0_8px_rgba(102,252,241,0.8)] mr-2">
          Server:
        </span>
        {serverStatus === "Disconnected" ? (
          " Your context-aware AI study environment is initializing."
        ) : (
          <span className="text-green-400 font-semibold">{serverStatus}</span>
        )}
      </p>
      <div
        onClick={handleConnect}
        className="group glass w-3xl hover:scale-103 transition-all duration-300 text-center p-3 cursor-pointer w-full max-w-md hover:drop-shadow-[0_0_8px_rgba(102,252,241,0.8)]"
      >
        Welcome This is{" "}
        <span className="font-bold text-lg">
          Congi
          <span className="text-[rgba(66,224,245)] group-hover:drop-shadow-[0_0_8px_rgba(66,224,245,0.8)]">
            Flow
          </span>
        </span>
      </div>
    </>
  );
};

export default ConnectionCard;
