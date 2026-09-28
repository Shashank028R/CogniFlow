import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import io from "socket.io-client";
import { Settings, Sun, Moon, Sparkles } from "lucide-react";

import SidebarHeader from "./SidebarHeader";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import RoomList from "./RoomList";
import LogoutButton from "../ui/LogoutButton";
import RoomModal from "./RoomModal";
import CogniAiModal from "../rag/CogniAiModal";

const Sidebar = ({ selectedChat, setSelectedChat, onlineUsers, setOnlineUsers }) => {
  const navigate = useNavigate();
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  const socketRef = useRef(null);

  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [isCogniModalOpen, setIsCogniModalOpen] = useState(false);
  const [cogniRoom, setCogniRoom] = useState(null);
  const [cogniModalTab, setCogniModalTab] = useState("quiz");

  const currentUserId = localStorage.getItem("userid");
  const token = localStorage.getItem("token");

  useEffect(() => {
    socketRef.current = io(BackendUrl);

    socketRef.current.on("connect", () => {
      console.log("Socket connected");
      socketRef.current.emit("setup", currentUserId);
    });

    socketRef.current.on("get online users", (users) => {
      setOnlineUsers(users);
    });

    socketRef.current.on("message received", (newMessage) => {
      const roomId = newMessage.room._id || newMessage.room;

      if (!selectedChat || selectedChat._id !== roomId) {
        setNotifications((prev) => {
          if (prev.some((n) => n._id === newMessage._id)) return prev;
          return [newMessage, ...prev];
        });
      }

      setRooms((prevRooms) => {
        const roomIndex = prevRooms.findIndex((r) => r._id === roomId);
        
        if (roomIndex > -1) {
          const updatedRooms = [...prevRooms];
          const updatedRoom = { ...updatedRooms[roomIndex], lastMessage: newMessage };
          
          updatedRooms.splice(roomIndex, 1);
          updatedRooms.unshift(updatedRoom);
          
          return updatedRooms;
        }
        
        return prevRooms;
      });
    });

    return () => socketRef.current.disconnect();
  }, [BackendUrl, selectedChat]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get(`${BackendUrl}/api/chat`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRooms(data);
      } catch {
        toast.error("Failed to load chats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [BackendUrl, token]);

  const getUnreadCount = (roomId) => {
    const room = rooms.find(r => r._id === roomId);
    const dbCount = room?.unreadCounts?.[currentUserId] || 0;
    const socketCount = notifications.filter((n) => (n.room._id || n.room) === roomId).length;
    return dbCount + socketCount;
  };

  const handleSelectChat = async (room) => {
    setSelectedChat(room);

    setNotifications((prev) =>
      prev.filter((n) => (n.room._id || n.room) !== room._id)
    );

    setRooms(prev => prev.map(r => {
      if (r._id === room._id) {
        return { ...r, unreadCounts: { ...r.unreadCounts, [currentUserId]: 0 } };
      }
      return r;
    }));

    try {
      await axios.put(`${BackendUrl}/api/chat/${room._id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Failed to mark chat as read");
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);

    if (!query) return setSearchResult([]);

    try {
      setLoadingSearch(true);
      const { data } = await axios.get(
        `${BackendUrl}/api/user?search=${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSearchResult(data);
    } catch {
      toast.error("Search failed");
    } finally {
      setLoadingSearch(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      const { data } = await axios.post(
        `${BackendUrl}/api/chat`,
        { isGroupChat: false, members: [userId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!rooms.find((r) => r._id === data._id)) {
        setRooms([data, ...rooms]);
      }

      setSearch("");
      setSearchResult([]);
      return data;
    } catch {
      toast.error("Error creating chat");
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="h-full w-full bg-[var(--card)]/80 backdrop-blur-2xl flex flex-col p-3 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)] border border-slate-200/80 dark:border-slate-800/80 z-20">
      <SidebarHeader onSettingsClick={() => navigate("/profile")} />

      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
        rooms={rooms}
        setRooms={setRooms}
      />

      <SearchBar
        search={search}
        setSearch={setSearch}
        setSearchResult={setSearchResult}
        handleSearch={handleSearch}
      />

      <div className="flex-1 overflow-y-auto flex flex-col gap-1 pr-1 scrollbar-hide">
        {search ? (
          <SearchResults
            loadingSearch={loadingSearch}
            searchResult={searchResult}
            accessChat={accessChat}
          />
        ) : (
          <RoomList
            isLoading={isLoading}
            rooms={rooms}
            currentUserId={currentUserId}
            selectedChat={selectedChat}
            setSelectedChat={handleSelectChat}
            getUnreadCount={getUnreadCount}
            onlineUsers={onlineUsers}
          />
        )}
      </div>

      {/* ACTIONS */}
      <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2">
        <div className="flex-1">
          <LogoutButton onClick={handleLogout} />
        </div>
        <button
          onClick={() => {
            const root = document.documentElement;
            const isDark = root.classList.contains("dark");
            if (isDark) {
              root.classList.remove("dark");
              localStorage.setItem("theme", "light");
            } else {
              root.classList.add("dark");
              localStorage.setItem("theme", "dark");
            }
            setSearch(search);
          }}
          title="Toggle Theme"
          className="w-9 h-9 flex-shrink-0 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200
          bg-slate-100/70 dark:bg-slate-800/70 hover:bg-slate-200/70 dark:hover:bg-slate-700/70
          border border-slate-200/80 dark:border-slate-700/80
          flex items-center justify-center shadow-xs
          transition-colors duration-150 active:scale-95 cursor-pointer"
        >
          {document.documentElement.classList.contains("dark") ? <Sun size={17} className="text-amber-500" /> : <Moon size={17} className="text-indigo-500" />}
        </button>
        <div className="relative">
          <button
            onClick={async () => {
              try {
                const { data } = await axios.get(
                  `${BackendUrl}/api/user?search=CogniBot`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                if (data && data.length > 0) {
                  const room = await accessChat(data[0]._id);
                  if (room) {
                    setCogniRoom(room);
                    setIsCogniModalOpen(true);
                  }
                } else {
                  toast.error("CogniBot not found. Is the server running?");
                }
              } catch (err) {
                toast.error("Could not reach CogniBot");
              }
            }}
            title="CogniAi Study & Knowledge Hub"
            className="group absolute -top-16 right-0 h-12 flex items-center justify-start rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_4px_15px_rgba(37,99,235,0.4)] transition-all duration-300 w-12 hover:w-32 overflow-hidden cursor-pointer z-50 p-2"
          >
            <img src="/ai-button-logo.png" alt="CogniAi" className="w-8 h-8 object-contain flex-shrink-0 rounded-full" />
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 font-bold transition-opacity duration-300 ml-2 overflow-hidden text-sm">
              CogniAi
            </span>
          </button>
          
          <button
            onClick={() => setIsRoomModalOpen(true)}
            title="Create Group"
            className="w-9 h-9 flex-shrink-0 rounded-xl font-bold text-blue-600
            bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40
            border border-blue-200/60 dark:border-blue-800/60
            flex items-center justify-center text-lg
            shadow-xs transition-colors duration-150
            active:scale-95 cursor-pointer relative z-40"
          >
            +
          </button>
        </div>
      </div>
      {cogniRoom && (
        <CogniAiModal
          isOpen={isCogniModalOpen}
          onClose={() => setIsCogniModalOpen(false)}
          cogniRoom={cogniRoom}
          socket={socketRef.current}
          initialTab={cogniModalTab}
          onOpenFullChat={() => {
            setSelectedChat(cogniRoom);
            setIsCogniModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Sidebar;