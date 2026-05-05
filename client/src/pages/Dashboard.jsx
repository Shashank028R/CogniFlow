import React from "react";
import RoomSideBar from "../components/sidebar/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-[#eef2f7]">
      <div className="w-full md:w-[450px] ">
        <RoomSideBar />
      </div>

      <div className="hidden md:flex flex-1 items-center justify-center p-5">
        <div
          className="p-10 rounded-2xl text-center bg-[#eef2f7]
      shadow-[8px_8px_18px_#d1d9e6,-8px_-8px_18px_#ffffff]"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Welcome to <span className="text-blue-600">CogniFlow</span>
          </h2>

          <p className="mt-2 text-gray-500">
            Select a chat to start messaging 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
