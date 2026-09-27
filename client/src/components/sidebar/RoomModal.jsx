import { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../ui/Avatar";
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Camera, X, Check } from "lucide-react";

const RoomModal = ({ isOpen, onClose, rooms, setRooms }) => {
  if (!isOpen) return null;

  const BackendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const token = localStorage.getItem("token");

  const [roomName, setRoomName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cropping State
  const [profilePic, setProfilePic] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const [isUploadingCrop, setIsUploadingCrop] = useState(false);

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

  const handleAddUser = (userToAdd) => {
    if (selectedUsers.some((u) => u._id === userToAdd._id)) {
      toast.error("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

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
      
      const { data } = await axios.post(`${BackendUrl}/api/upload`, uploadData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      
      setProfilePic(data.fileUrl);
      setImgSrc("");
      toast.success("Picture updated!", { id: toastId });
    } catch {
      toast.error("Failed to upload image", { id: toastId });
    } finally {
      setIsUploadingCrop(false);
    }
  };

  const handleSubmit = async () => {
    if (!roomName.trim()) {
      return toast.error("Please enter a room name");
    }
    if (selectedUsers.length < 2) {
      return toast.error("Please add at least 2 members for a group chat");
    }

    try {
      setIsSubmitting(true);
      const { data } = await axios.post(
        `${BackendUrl}/api/chat`,
        {
          isGroupChat: true,
          name: roomName,
          members: selectedUsers.map((m) => m._id),
          profilePic,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRooms([data, ...rooms]);
      
      setRoomName("");
      setSelectedUsers([]);
      setProfilePic("");
      onClose();
      toast.success("New Room Created!");
    } catch {
      toast.error("Failed to create the Chat!");
    } finally {
      setIsSubmitting(false);
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
                {isUploadingCrop ? "Processing..." : <><Check size={16} /> Apply</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Group Room</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Group Picture Picker */}
        <div className="flex flex-col items-center gap-1.5">
          <div
            className="relative group cursor-pointer"
            onClick={() => document.getElementById("group-pic-upload").click()}
          >
            <Avatar src={profilePic} text={roomName ? roomName.charAt(0).toUpperCase() : "G"} size="w-16 h-16" />
            <div className="absolute inset-0 bg-slate-900/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={20} className="text-white" />
            </div>
            <input type="file" id="group-pic-upload" className="hidden" accept="image/*" onChange={onSelectFile} />
          </div>
          <span className="text-xs text-slate-400 font-medium">Group Picture (Optional)</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Room Name</label>
          <input
            type="text"
            placeholder="e.g. Engineering Squad"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Add Members</label>
          <input
            type="text"
            placeholder="Search users by name or email..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedUsers.map((u) => (
              <span
                key={u._id}
                className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs rounded-md flex items-center gap-1 font-medium"
              >
                {u.username}
                <button onClick={() => handleDelete(u)} className="text-blue-400 hover:text-blue-600 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="max-h-28 overflow-y-auto flex flex-col gap-1">
          {loading ? (
            <p className="text-xs text-slate-400 text-center py-2 animate-pulse">Searching users...</p>
          ) : (
            searchResult?.slice(0, 4).map((user) => (
              <div
                key={user._id}
                onClick={() => handleAddUser(user)}
                className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Avatar src={user.profilePic} text={user.username.charAt(0).toUpperCase()} size="w-7 h-7" />
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{user.username}</span>
                </div>
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">+ Add</span>
              </div>
            ))
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="mt-2 w-full py-2.5 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Creating Room..." : "Create Room"}
        </button>
      </div>
    </div>
  );
};

export default RoomModal;
