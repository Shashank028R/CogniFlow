import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../ui/Avatar";
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Camera, X, Check, Trash2, UserPlus, Shield } from "lucide-react";

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
      
      const { data } = await axios.put(
        `${BackendUrl}/api/chat/rename`,
        { roomId: selectedChat._id, chatName: roomName, profilePic: newPicUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSelectedChat(data);
      setImgSrc("");
      toast.success("Picture updated!", { id: toastId });
    } catch {
      toast.error("Failed to upload image", { id: toastId });
    } finally {
      setIsUploadingCrop(false);
    }
  };

  const handleRename = async () => {
    if (!roomName.trim() || roomName === selectedChat.name) return;
    try {
      setUpdating(true);
      const { data } = await axios.put(
        `${BackendUrl}/api/chat/rename`,
        { roomId: selectedChat._id, chatName: roomName, profilePic },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedChat(data);
      toast.success("Group renamed successfully!");
    } catch {
      toast.error("Failed to rename group");
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
    } catch {
      toast.error("Failed to load search results");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.members.some((m) => m._id === userToAdd._id)) {
      toast.error("User is already in the group!");
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
      toast.success(`${userToAdd.username} added to the group!`);
    } catch {
      toast.error("Failed to add user");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      setUpdating(true);
      const { data } = await axios.put(
        `${BackendUrl}/api/chat/groupremove`,
        { roomId: selectedChat._id, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (userId === currentUserId) {
        setSelectedChat(null);
        onClose();
        toast.success("You left the group!");
      } else {
        setSelectedChat(data);
        toast.success("Member removed!");
      }
    } catch {
      toast.error("Failed to remove member");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm("Are you sure you want to delete this group? This cannot be undone.")) return;
    try {
      setUpdating(true);
      await axios.delete(`${BackendUrl}/api/chat/${selectedChat._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedChat(null);
      onClose();
      toast.success("Group deleted successfully!");
    } catch {
      toast.error("Failed to delete group");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 animate-[fadeIn_0.15s_ease]">
      
      {/* Crop Modal Overlay */}
      {imgSrc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full flex flex-col items-center">
            <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Crop Group Picture</h2>
            <div className="max-h-[50vh] overflow-hidden w-full bg-slate-950 rounded-xl flex items-center justify-center">
              <ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)} onComplete={(c) => setCompletedCrop(c)} aspect={1} circularCrop>
                <img ref={imgRef} alt="Crop preview" src={imgSrc} onLoad={onImageLoad} className="max-h-[50vh] object-contain block" />
              </ReactCrop>
            </div>
            <div className="flex gap-3 mt-5 w-full">
              <button
                onClick={() => setImgSrc("")}
                className="flex-1 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-sm"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleUploadCrop}
                disabled={isUploadingCrop || !completedCrop}
                className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer text-sm"
              >
                {isUploadingCrop ? "Uploading..." : <><Check size={16} /> Apply</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Group Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Group Picture */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`relative ${isAdmin ? 'group cursor-pointer' : ''}`}
            onClick={() => isAdmin && document.getElementById("edit-group-pic").click()}
          >
            <Avatar src={profilePic} text={roomName ? roomName.charAt(0).toUpperCase() : "G"} size="w-20 h-20" />
            {isAdmin && (
              <>
                <div className="absolute inset-0 bg-slate-900/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={22} className="text-white" />
                </div>
                <input type="file" id="edit-group-pic" className="hidden" accept="image/*" onChange={onSelectFile} disabled={updating} />
              </>
            )}
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {isAdmin ? "Click photo to change" : "Group Picture"}
          </span>
        </div>

        {/* Rename Group */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Group Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              disabled={!isAdmin || updating}
              className="flex-1 px-3.5 py-2 rounded-lg text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 disabled:opacity-60"
            />
            {isAdmin && (
              <button
                onClick={handleRename}
                disabled={updating || roomName === selectedChat.name}
                className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                Save
              </button>
            )}
          </div>
        </div>

        {/* Add Members Search */}
        {isAdmin && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Add New Members</label>
            <input
              type="text"
              placeholder="Search users..."
              onChange={(e) => handleSearch(e.target.value)}
              disabled={updating}
              className="w-full px-3.5 py-2 rounded-lg text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500"
            />
            <div className="max-h-28 overflow-y-auto scrollbar-hide flex flex-col gap-1 mt-1">
              {loading ? (
                <p className="text-xs text-slate-400 text-center py-2 animate-pulse">Searching...</p>
              ) : (
                searchResult?.slice(0, 3).map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleAddUser(user)}
                    className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar src={user.profilePic} text={user.username.charAt(0).toUpperCase()} size="w-7 h-7" />
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{user.username}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <UserPlus size={12} /> Add
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Members List */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Members ({selectedChat.members.length})
          </label>
          <div className="max-h-40 overflow-y-auto flex flex-col gap-1 pr-1">
            {selectedChat.members.map((member) => {
              const isMemberAdmin = 
                String(selectedChat.admin) === String(member._id) || 
                String(selectedChat.admin?._id) === String(member._id);
              const isCurrentUser = String(member._id) === String(currentUserId);

              return (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Avatar src={member.profilePic} text={member.username.charAt(0).toUpperCase()} size="w-7 h-7" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                        {member.username} {isCurrentUser && <span className="text-slate-400">(You)</span>}
                      </span>
                      {isMemberAdmin && (
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-0.5">
                          <Shield size={10} /> Admin
                        </span>
                      )}
                    </div>
                  </div>

                  {isAdmin && !isMemberAdmin && (
                    <button
                      onClick={() => handleRemoveUser(member._id)}
                      disabled={updating}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                      title="Remove member"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
          <button
            onClick={() => handleRemoveUser(currentUserId)}
            disabled={updating}
            className="w-full py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Leave Group
          </button>
          
          {isAdmin && (
            <button
              onClick={handleDeleteGroup}
              disabled={updating}
              className="w-full py-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 font-medium text-xs hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
            >
              Delete Group
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupSettingsModal;
