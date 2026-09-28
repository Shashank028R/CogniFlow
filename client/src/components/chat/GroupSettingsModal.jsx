import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../ui/Avatar";
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Camera, X, Check } from "lucide-react";

const GroupSettingsModal = ({ isOpen, onClose, selectedChat, setSelectedChat }) => {
  if (!isOpen || !selectedChat) return null;

  const BackendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userid");

  const [roomName, setRoomName] = useState(selectedChat.name || "");
  const [profilePic, setProfilePic] = useState(selectedChat.profilePic || "");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Cropping State
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const [isUploadingCrop, setIsUploadingCrop] = useState(false);

  const isAdmin = 
    String(selectedChat.admin) === String(currentUserId) || 
    String(selectedChat.admin?._id) === String(currentUserId);

  useEffect(() => {
    setRoomName(selectedChat.name);
    setProfilePic(selectedChat.profilePic || "");
  }, [selectedChat]);

  // --- Image Cropping Logic ---
  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () => setImgSrc(reader.result.toString() || ""));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop({ unit: '%', width: 80 }, 1, width, height),
      width, height
    );
    setCrop(initialCrop);
  };

  const generateCroppedImage = async () => {
    if (!completedCrop || !imgRef.current) return;
    const canvas = document.createElement("canvas");
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      completedCrop.x * scaleX, completedCrop.y * scaleY,
      completedCrop.width * scaleX, completedCrop.height * scaleY,
      0, 0, completedCrop.width, completedCrop.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleUploadCrop = async () => {
    setIsUploadingCrop(true);
    const toastId = toast.loading("Uploading picture...");
    try {
      const blob = await generateCroppedImage();
      if (!blob) throw new Error("Could not generate crop");
      
      const uploadData = new FormData();
      uploadData.append("file", blob, "group.jpg");
      
      const { data: uploadRes } = await axios.post(`${BackendUrl}/api/upload`, uploadData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      
      const newPicUrl = uploadRes.fileUrl;
      setProfilePic(newPicUrl);
      
      // Instantly update the backend group settings
      const { data } = await axios.put(
        `${BackendUrl}/api/chat/rename`,
        { roomId: selectedChat._id, profilePic: newPicUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedChat(data);
      toast.success("Group picture updated!", { id: toastId });
      setImgSrc(""); // Close crop modal
    } catch (error) {
      toast.error("Failed to update picture", { id: toastId });
    } finally {
      setIsUploadingCrop(false);
    }
  };

  const handleRename = async () => {
    if (!roomName || roomName === selectedChat.name) return;
    try {
      setUpdating(true);
      const { data } = await axios.put(
        `${BackendUrl}/api/chat/rename`,
        { roomId: selectedChat._id, roomName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedChat(data);
      toast.success("Group renamed!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to rename group");
    } finally {
      setUpdating(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`${BackendUrl}/api/user?search=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to load search results");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.members.find((m) => m._id === userToAdd._id)) {
      toast.error("User already in group!");
      return;
    }
    try {
      setUpdating(true);
      const { data } = await axios.put(
        `${BackendUrl}/api/chat/groupadd`,
        { roomId: selectedChat._id, userId: userToAdd._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedChat(data);
      toast.success("Added new member!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add user");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveUser = async (userToRemove) => {
    if (selectedChat.admin === userToRemove._id || selectedChat.admin?._id === userToRemove._id) {
      toast.error("Cannot remove the admin!");
      return;
    }
    try {
      setUpdating(true);
      const { data } = await axios.put(
        `${BackendUrl}/api/chat/groupremove`,
        { roomId: selectedChat._id, userId: userToRemove._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedChat(data);
      toast.success("Member removed!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove user");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease] p-4">
      
      {/* Crop Modal Overlay */}
      {imgSrc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[var(--bg)] p-6 rounded-3xl shadow-2xl max-w-lg w-full flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Crop Group Picture</h2>
            <div className="max-h-[60vh] overflow-hidden w-full bg-black rounded-xl flex items-center justify-center">
              <ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)} onComplete={(c) => setCompletedCrop(c)} aspect={1} circularCrop>
                <img ref={imgRef} alt="Crop preview" src={imgSrc} onLoad={onImageLoad} className="max-h-[60vh] object-contain block" />
              </ReactCrop>
            </div>
            <div className="flex gap-4 mt-6 w-full">
              <button onClick={() => setImgSrc("")} className="flex-1 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold shadow-[4px_4px_8px_var(--shadow-dark),-4px_-4px_8px_var(--shadow-light)] hover:shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)] transition-all flex items-center justify-center gap-2">
                <X size={18} /> Cancel
              </button>
              <button onClick={handleUploadCrop} disabled={isUploadingCrop || !completedCrop} className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-bold shadow-[4px_4px_10px_rgba(37,99,235,0.3),-4px_-4px_10px_var(--shadow-light)] hover:bg-blue-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {isUploadingCrop ? "Uploading..." : <><Check size={18} /> Apply</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[var(--card)] w-full max-w-md p-6 rounded-3xl shadow-[10px_10px_20px_rgba(0,0,0,0.2)] flex flex-col gap-5 max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xl font-bold text-[var(--text)]">Group Settings</h2>
          <button onClick={onClose} className="text-red-500 font-bold text-xl hover:scale-110 transition-transform cursor-pointer">✕</button>
        </div>

        {/* Group Picture */}
        <div className="flex flex-col items-center gap-2">
          <div className={`relative ${isAdmin ? 'group cursor-pointer' : ''}`} onClick={() => isAdmin && document.getElementById("edit-group-pic").click()}>
            <div className="w-24 h-24 rounded-full shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] p-1 bg-[var(--bg)]">
              <Avatar src={profilePic} text={roomName ? roomName.charAt(0).toUpperCase() : "G"} size="w-full h-full" />
            </div>
            {isAdmin && (
              <>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={28} className="text-white" />
                </div>
                <input type="file" id="edit-group-pic" className="hidden" accept="image/*" onChange={onSelectFile} disabled={updating} />
              </>
            )}
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {isAdmin ? "Click to update picture" : "Group Picture"}
          </span>
        </div>

        {/* Rename Group */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600 px-1">Group Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              disabled={!isAdmin || updating}
              className="flex-1 p-3 rounded-xl border-none outline-none bg-[var(--card)] text-[var(--text)] shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] disabled:opacity-70 disabled:cursor-not-allowed transition-all focus:shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]"
            />
            {isAdmin && (
              <button
                onClick={handleRename}
                disabled={updating || roomName === selectedChat.name}
                className="px-4 rounded-xl bg-blue-500 text-white font-bold shadow-[4px_4px_10px_rgba(37,99,235,0.3),-4px_-4px_10px_var(--shadow-light)] hover:bg-blue-600 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update
              </button>
            )}
          </div>
        </div>

        {/* Add Members Search */}
        {isAdmin && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600 px-1">Add Members</label>
            <input
              type="text"
              placeholder="Search users to add..."
              onChange={(e) => handleSearch(e.target.value)}
              disabled={updating}
              className="w-full p-3 rounded-xl border-none outline-none bg-[var(--card)] text-[var(--text)] shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] transition-all focus:shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]"
            />
            <div className="max-h-32 overflow-y-auto scrollbar-hide flex flex-col gap-1 mt-1">
              {loading ? (
                <p className="text-xs text-gray-500 text-center py-2 animate-pulse">Searching...</p>
              ) : (
                searchResult?.slice(0, 3).map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleAddUser(user)}
                    className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors shadow-sm"
                  >
                    <Avatar src={user.profilePic} text={user.username.charAt(0).toUpperCase()} size="w-8 h-8" />
                    <span className="text-sm font-medium text-gray-700 flex-1">{user.username}</span>
                    <span className="text-xs font-bold text-blue-500 bg-blue-100 px-2 py-1 rounded-md">Add</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Members List */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-600 px-1">Members ({selectedChat.members.length})</label>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto scrollbar-hide pr-1">
            {selectedChat.members.map((u) => {
              const isGroupAdmin = 
                String(u._id) === String(selectedChat.admin) || 
                String(u._id) === String(selectedChat.admin?._id);
              return (
                <div key={u._id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg)] shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)]">
                  <div className="flex items-center gap-3">
                    <Avatar src={u.profilePic} text={u.username.charAt(0).toUpperCase()} size="w-8 h-8" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[var(--text)]">{u.username} {u._id === currentUserId && "(You)"}</span>
                      <span className="text-[10px] text-gray-500 font-semibold">{isGroupAdmin ? "Admin" : "Member"}</span>
                    </div>
                  </div>
                  {isAdmin && !isGroupAdmin && (
                    <button
                      onClick={() => handleRemoveUser(u)}
                      disabled={updating}
                      className="text-xs font-bold text-red-500 hover:text-white hover:bg-red-500 px-2 py-1 rounded-lg transition-colors border border-red-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Delete Group */}
        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={async () => {
                if (window.confirm("Are you absolutely sure you want to delete this group? This action cannot be undone and all messages will be permanently lost.")) {
                  try {
                    setUpdating(true);
                    await axios.delete(`${BackendUrl}/api/chat/${selectedChat._id}`, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success("Group deleted successfully!");
                    setTimeout(() => window.location.reload(), 1000);
                  } catch (error) {
                    toast.error(error.response?.data?.message || "Failed to delete group");
                    setUpdating(false);
                  }
                }
              }}
              disabled={updating}
              className="w-full py-3 rounded-xl font-bold text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-all shadow-[inset_2px_2px_4px_var(--shadow-light),inset_-2px_-2px_4px_var(--shadow-dark)] hover:shadow-[4px_4px_8px_rgba(239,68,68,0.3),-4px_-4px_8px_var(--shadow-light)] disabled:opacity-50"
            >
              Delete Group
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default GroupSettingsModal;
