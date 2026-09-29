import { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../ui/Avatar";
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Camera, X, Check } from "lucide-react";
import { getBackendUrl } from "../../utils/apiConfig";
import { getAuthToken } from "../../utils/authStorage";

const RoomModal = ({ isOpen, onClose, rooms, setRooms }) => {
  if (!isOpen) return null;

  const BackendUrl = getBackendUrl();
  const token = getAuthToken();

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
      toast.success("Picture ready!", { id: toastId });
      setImgSrc(""); // Close crop modal
    } catch (error) {
      toast.error("Failed to upload picture", { id: toastId });
    } finally {
      setIsUploadingCrop(false);
    }
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
      
      // reset state and close
      setRoomName("");
      setSelectedUsers([]);
      setProfilePic("");
      onClose();
      toast.success("New Room Created!");
    } catch (error) {
      toast.error("Failed to create the Chat!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[modalBackdrop_0.2s_ease-out] p-4">
      
      {/* Crop Modal Overlay */}
      {imgSrc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-[modalBackdrop_0.2s_ease-out]">
          <div className="bg-[var(--card)] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_16px_40px_rgba(0,0,0,0.2)] max-w-lg w-full flex flex-col items-center animate-[modalContent_0.25s_cubic-bezier(0.16,1,0.3,1)]">
            <h2 className="text-lg font-bold mb-4 text-[var(--text)]">Crop Group Picture</h2>
            <div className="max-h-[60vh] overflow-hidden w-full bg-black rounded-xl flex items-center justify-center">
              <ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)} onComplete={(c) => setCompletedCrop(c)} aspect={1} circularCrop>
                <img ref={imgRef} alt="Crop preview" src={imgSrc} onLoad={onImageLoad} className="max-h-[60vh] object-contain block" />
              </ReactCrop>
            </div>
            <div className="flex gap-3 mt-6 w-full">
              <button 
                onClick={() => setImgSrc("")} 
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200/80 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <X size={16} /> Cancel
              </button>
              <button 
                onClick={handleUploadCrop} 
                disabled={isUploadingCrop || !completedCrop} 
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-[0_2px_8px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isUploadingCrop ? "Processing..." : <><Check size={16} /> Apply</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[var(--card)] w-full max-w-md p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_16px_40px_rgba(0,0,0,0.2)] flex flex-col gap-4 max-h-[90vh] overflow-y-auto scrollbar-hide animate-[modalContent_0.25s_cubic-bezier(0.16,1,0.3,1)]">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-lg font-bold text-[var(--text)]">Create Room</h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 mb-1">
          <div className="relative group cursor-pointer" onClick={() => document.getElementById("group-pic-upload").click()}>
            <div className="w-20 h-20 rounded-full border border-slate-200/80 dark:border-slate-700 p-1 bg-slate-100/50 dark:bg-slate-800/50 transition-transform duration-200 group-hover:scale-105">
              <Avatar src={profilePic} text={roomName ? roomName.charAt(0).toUpperCase() : "G"} size="w-full h-full" />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={22} className="text-white" />
            </div>
            <input type="file" id="group-pic-upload" className="hidden" accept="image/*" onChange={onSelectFile} />
          </div>
          <span className="text-xs text-slate-500 font-medium">Group Picture (Optional)</span>
        </div>

        <input 
          type="text" 
          placeholder="Group Name" 
          value={roomName} 
          onChange={(e) => setRoomName(e.target.value)} 
          className="w-full p-2.5 px-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 outline-none bg-slate-50/70 dark:bg-slate-800/60 text-[var(--text)] text-sm focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/10 transition-all" 
        />

        <input 
          type="text" 
          placeholder="Add Users (e.g. John, Jane)" 
          onChange={(e) => handleSearch(e.target.value)} 
          className="w-full p-2.5 px-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 outline-none bg-slate-50/70 dark:bg-slate-800/60 text-[var(--text)] text-sm focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/10 transition-all" 
        />

        <div className="flex flex-wrap gap-1.5">
          {selectedUsers.map((u) => (
            <span key={u._id} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs rounded-lg border border-blue-200/70 dark:border-blue-800/70 flex items-center gap-1.5 font-medium animate-[fadeIn_0.15s_ease]">
              {u.username}
              <button onClick={() => handleDelete(u)} className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>

        <div className="max-h-32 overflow-y-auto flex flex-col gap-1 pr-1">
          {loading ? (
            <p className="text-xs text-slate-400 text-center py-2 animate-pulse">Searching users...</p>
          ) : (
            searchResult?.slice(0, 4).map((user) => (
              <div 
                key={user._id} 
                onClick={() => handleAddUser(user)} 
                className="flex items-center gap-2.5 p-2 rounded-xl cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-800/70 active:scale-[0.99] border border-transparent hover:border-slate-200/60 dark:hover:border-slate-700/60 transition-all duration-150"
              >
                <Avatar src={user.profilePic} text={user.username.charAt(0).toUpperCase()} size="w-7 h-7" />
                <span className="text-xs font-medium text-[var(--text)] truncate">{user.username}</span>
              </div>
            ))
          )}
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting} 
          className="mt-1 w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-[0_2px_8px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:-translate-y-[1px] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Creating..." : "Create Room"}
        </button>
      </div>
    </div>
  );
};

export default RoomModal;
