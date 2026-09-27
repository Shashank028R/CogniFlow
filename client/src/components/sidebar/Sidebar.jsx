import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import io from "socket.io-client";
import { Plus, Sun, Moon, Bot } from "lucide-react";

import SidebarHeader from "./SidebarHeader";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import RoomList from "./RoomList";
import LogoutButton from "../ui/LogoutButton";
import RoomModal from "./RoomModal";

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

  const currentUserId = localStorage.getItem("userid");
  const token = localStorage.getItem("token");

  useEffect(() => {
    socketRef.current = io(BackendUrl);

    socketRef.current.on("connect", () => {
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
  }, [BackendUrl, currentUserId, selectedChat, setOnlineUsers]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${BackendUrl}/api/chat`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRooms(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [BackendUrl, token]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);

    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoadingSearch(true);
      const { data } = await axios.get(`${BackendUrl}/api/user?search=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResult(data);
    } catch {
      toast.error("Failed to load search results");
    } finally {
      setLoadingSearch(false);
    }
  };

  const getUnreadCount = (roomId) => {
    const unreadMap = rooms.find((r) => r._id === roomId)?.unreadCounts;
    if (unreadMap) {
      if (typeof unreadMap === "object" && unreadMap[currentUserId]) {
        return unreadMap[currentUserId];
      }
    }
    return notifications.filter((n) => (n.room._id || n.room) === roomId).length;
  };

  const handleSelectChat = async (room) => {
    setSelectedChat(room);

    setNotifications((prev) =>
      prev.filter((n) => (n.room._id || n.room) !== room._id)
    );

    try {
      await axios.put(
        `${BackendUrl}/api/chat/${room._id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRooms((prev) =>
        prev.map((r) => {
          if (r._id === room._id) {
            const newCounts = { ...r.unreadCounts, [currentUserId]: 0 };
            return { ...r, unreadCounts: newCounts };
          }
          return r;
        })
      );
    } catch (err) {
      console.error("Failed to mark room as read", err);
    }
  };

  const accessChat = async (userId) => {
    try {
      const { data } = await axios.post(
        `${BackendUrl}/api/chat`,
        { isGroupChat: false, members: [userId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedChat(data);

      if (!rooms.find((r) => r._id === data._id)) {
        setRooms([data, ...rooms]);
      }

      setSearch("");
      setSearchResult([]);
    } catch {
      toast.error("Error creating chat");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="h-full w-full bg-white dark:bg-slate-900 flex flex-col p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm z-20">
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

      <div className="flex-1 overflow-y-auto flex flex-col pr-1 scrollbar-hide">
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

      {/* FOOTER ACTIONS */}
      <div className="pt-3 mt-2 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex-1">
          <LogoutButton onClick={handleLogout} />
        </div>

        {/* CogniBot Quick Trigger */}
        <button
          onClick={async () => {
            try {
              const { data } = await axios.get(
                `${BackendUrl}/api/user?search=CogniBot`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (data && data.length > 0) {
                accessChat(data[0]._id);
              } else {
                toast.error("CogniBot is currently unavailable");
              }
            } catch {
              toast.error("Could not connect to CogniBot");
            }
          }}
          title="Chat with CogniBot AI"
          className="h-9 px-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50
          text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60
          flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Bot size={15} />
          <span>CogniBot</span>
        </button>

        {/* Theme Toggle */}
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
          className="w-9 h-9 rounded-lg flex items-center justify-center
          text-slate-500 hover:text-slate-800 dark:hover:text-slate-200
          hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700
          transition-colors cursor-pointer"
        >
          {document.documentElement.classList.contains("dark") ? (
            <Sun size={16} className="text-amber-400" />
          ) : (
            <Moon size={16} className="text-slate-600" />
          )}
        </button>

        {/* Create Group Button */}
        <button
          onClick={() => setIsRoomModalOpen(true)}
          title="Create New Group"
          className="w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800
          text-white flex items-center justify-center shadow-sm transition-colors cursor-pointer"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;