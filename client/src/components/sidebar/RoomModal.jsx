import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const RoomModal = ({ isOpen, onClose, rooms, setRooms }) => {
  if (!isOpen) return null;

  const BackendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const token = localStorage.getItem("token");

  const [roomName, setRoomName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BackendUrl}/api/user?search=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to load search results");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.error("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!roomName || selectedUsers.length === 0) {
      toast.error("Please fill all the fields");
      return;
    }

    if (selectedUsers.length < 2) {
      toast.error("Select at least 2 users (3 including you)");
      return;
    }

    try {
      const url = `${BackendUrl}/api/chat`;

      const { data } = await axios.post(
        url,
        {
          isGroupChat: true,
          name: roomName,
          members: selectedUsers.map((m) => m._id),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setRooms([data, ...rooms]);
      onClose();
      toast.success("New Room Created!");
    } catch (error) {
      toast.error("Failed to create the Chat!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease]">
      <div className="bg-[#f5f7fa] w-11/12 max-w-md p-6 rounded-2xl shadow-[10px_10px_20px_rgba(0,0,0,0.2)] flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-800">Create Room</h2>
          <button
            onClick={onClose}
            className="text-red-500 font-bold text-xl hover:scale-110 transition-transform cursor-pointer"
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full p-3 rounded-xl border-none outline-none bg-[#f5f7fa] text-gray-800 shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]"
        />

        <input
          type="text"
          placeholder="Add Users (e.g. John, Jane)"
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-3 rounded-xl border-none outline-none bg-[#f5f7fa] text-gray-800 shadow-[inset_4px_4px_8px_#d1d9e6,inset_-4px_-4px_8px_#ffffff]"
        />

        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((u) => (
            <span
              key={u._id}
              className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1 shadow-sm"
            >
              {u.username}
              <button
                onClick={() => handleDelete(u)}
                className="font-bold text-blue-900 ml-1 hover:text-red-500 cursor-pointer"
              >
                x
              </button>
            </span>
          ))}
        </div>

        <div className="max-h-32 overflow-y-auto flex flex-col gap-2">
          {loading ? (
            <p className="text-xs text-gray-500 text-center">Loading...</p>
          ) : (
            searchResult?.slice(0, 4).map((user) => (
              <div
                key={user._id}
                onClick={() => handleAddUser(user)}
                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user.username}
                </span>
              </div>
            ))
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-2 w-full py-3 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff] transition-all cursor-pointer"
        >
          Create Room
        </button>
      </div>
    </div>
  );
};

export default RoomModal;
