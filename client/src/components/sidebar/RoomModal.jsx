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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-[fadeIn_0.2s_ease] p-4">
      
      {/* Crop Modal Overlay */}
      {imgSrc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white dark:bg-[#272729] border border-[#e0e0e0] dark:border-[#333336] p-6 rounded-[18px] max-w-lg w-full flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4 text-[#1d1d1f] dark:text-white">Crop Group Picture</h2>
            <div className="max-h-[60vh] overflow-hidden w-full bg-black rounded-[14px] flex items-center justify-center">
              <ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)} onComplete={(c) => setCompletedCrop(c)} aspect={1} circularCrop>
                <img ref={imgRef} alt="Crop preview" src={imgSrc} onLoad={onImageLoad} className="max-h-[60vh] object-contain block" />
              </ReactCrop>
            </div>
            <div className="flex gap-3 mt-5 w-full">
              <button onClick={() => setImgSrc("")} className="flex-1 py-2.5 rounded-full border border-[#e0e0e0] dark:border-[#333336] text-[#1d1d1f] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.95] transition-all flex items-center justify-center gap-2 text-sm font-normal cursor-pointer">
                <X size={16} /> Cancel
              </button>
              <button onClick={handleUploadCrop} disabled={isUploadingCrop || !completedCrop} className="flex-1 py-2.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white active:scale-[0.95] transition-all flex items-center justify-center gap-2 text-sm font-normal disabled:opacity-50 cursor-pointer">
                {isUploadingCrop ? "Processing..." : <><Check size={16} /> Apply</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#272729] border border-[#e0e0e0] dark:border-[#333336] w-full max-w-md p-6 rounded-[18px] flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-[19px] font-semibold text-[#1d1d1f] dark:text-white tracking-tight">Create Room</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer">✕</button>
        </div>

        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="relative group cursor-pointer" onClick={() => document.getElementById("group-pic-upload").click()}>
            <div className="w-20 h-20 rounded-full border border-[#e0e0e0] dark:border-[#333336] p-1 bg-[#f5f5f7] dark:bg-[#1d1d1f] flex items-center justify-center">
              <Avatar src={profilePic} text={roomName ? roomName.charAt(0).toUpperCase() : "G"} size="w-full h-full" />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={22} className="text-white" />
            </div>
            <input type="file" id="group-pic-upload" className="hidden" accept="image/*" onChange={onSelectFile} />
          </div>
          <span className="text-xs text-[#86868b]">Group Picture (Optional)</span>
        </div>

        <input
          type="text"
          placeholder="Group Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full px-4 py-2.5 rounded-full border border-[#e0e0e0] dark:border-[#333336] outline-none bg-[#f5f5f7] dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-white focus:border-[#0071e3] text-sm transition-all"
        />

        <input
          type="text"
          placeholder="Add Users (e.g. John, Jane)"
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-full border border-[#e0e0e0] dark:border-[#333336] outline-none bg-[#f5f5f7] dark:bg-[#1d1d1f] text-[#1d1d1f] dark:text-white focus:border-[#0071e3] text-sm transition-all"
        />

        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((u) => (
            <span key={u._id} className="px-3 py-1 bg-[#f5f5f7] dark:bg-[#1d1d1f] border border-[#e0e0e0] dark:border-[#333336] text-[#0066cc] dark:text-[#2997ff] text-xs rounded-full flex items-center gap-1 font-medium">
              {u.username}
              <button onClick={() => handleDelete(u)} className="font-bold text-[#86868b] ml-1 hover:text-red-500 transition-colors">×</button>
            </span>
          ))}
        </div>

        <div className="max-h-32 overflow-y-auto flex flex-col gap-1.5">
          {loading ? (
            <p className="text-xs text-[#86868b] text-center">Searching...</p>
          ) : (
            searchResult?.slice(0, 4).map((user) => (
              <div key={user._id} onClick={() => handleAddUser(user)} className="flex items-center gap-3 p-2 rounded-[12px] cursor-pointer hover:bg-[#f5f5f7] dark:hover:bg-[#1d1d1f] transition-all">
                <Avatar src={user.profilePic} text={user.username.charAt(0).toUpperCase()} size="w-8 h-8" />
                <span className="text-sm font-medium text-[#1d1d1f] dark:text-white">{user.username}</span>
              </div>
            ))
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="mt-2 w-full py-2.5 rounded-full font-normal text-[14px] text-white bg-[#0066cc] hover:bg-[#0071e3] active:scale-[0.95] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "Creating..." : "Create Room"}
        </button>
      </div>
    </div>
  );
};

export default RoomModal;
