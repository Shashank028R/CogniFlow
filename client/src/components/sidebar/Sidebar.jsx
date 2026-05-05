import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import SidebarHeader from "./SidebarHeader";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import RoomList from "./RoomList";
import LogoutButton from "../ui/LogoutButton";
import RoomModal from "./RoomModal";

const Sidebar = () => {
  const navigate = useNavigate();
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);

  const currentUserId = localStorage.getItem("userid");
  const token = localStorage.getItem("token");

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

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);

    if (!query) return setSearchResult([]);

    try {
      setLoadingSearch(true);
      const { data } = await axios.get(
        `${BackendUrl}/api/user?search=${query}`,
        { headers: { Authorization: `Bearer ${token}` } },
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
        { headers: { Authorization: `Bearer ${token}` } },
      );

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
    <div
      className="h-screen w-full md:w-[450px]
      bg-[#f5f7fa] flex flex-col p-4"
    >
      <SidebarHeader RoomModalOpen={() => setIsRoomModalOpen(true)} />

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

      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
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
          />
        )}
      </div>

      <div className="mt-3">
        <LogoutButton onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Sidebar;
