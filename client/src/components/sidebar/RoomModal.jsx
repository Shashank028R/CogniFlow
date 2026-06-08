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
                {isUploadingCrop ? "Processing..." : <><Check size={18} /> Apply</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[var(--card)] w-full max-w-md p-6 rounded-3xl shadow-[10px_10px_20px_rgba(0,0,0,0.2)] flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-[var(--text)]">Create Room</h2>
          <button onClick={onClose} className="text-red-500 font-bold text-xl hover:scale-110 transition-transform cursor-pointer">✕</button>
        </div>

        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="relative group cursor-pointer" onClick={() => document.getElementById("group-pic-upload").click()}>
            <div className="w-20 h-20 rounded-full shadow-[6px_6px_12px_var(--shadow-dark),-6px_-6px_12px_var(--shadow-light)] p-1 bg-[var(--bg)]">
              <Avatar src={profilePic} text={roomName ? roomName.charAt(0).toUpperCase() : "G"} size="w-full h-full" />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
            <input type="file" id="group-pic-upload" className="hidden" accept="image/*" onChange={onSelectFile} />
          </div>
          <span className="text-xs text-gray-500 font-medium">Group Picture (Optional)</span>
        </div>

        <input type="text" placeholder="Group Name" value={roomName} onChange={(e) => setRoomName(e.target.value)} className="w-full p-3 rounded-xl border-none outline-none bg-[var(--card)] text-[var(--text)] shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] focus:shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)] transition-all" />

        <input type="text" placeholder="Add Users (e.g. John, Jane)" onChange={(e) => handleSearch(e.target.value)} className="w-full p-3 rounded-xl border-none outline-none bg-[var(--card)] text-[var(--text)] shadow-[inset_4px_4px_8px_var(--shadow-dark),inset_-4px_-4px_8px_var(--shadow-light)] focus:shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)] transition-all" />

        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((u) => (
            <span key={u._id} className="px-3 py-1 bg-[var(--bg)] text-blue-800 text-xs rounded-full flex items-center gap-1 shadow-[2px_2px_4px_var(--shadow-dark),-2px_-2px_4px_var(--shadow-light)] font-medium">
              {u.username}
              <button onClick={() => handleDelete(u)} className="font-bold text-gray-400 ml-1 hover:text-red-500 transition-colors">x</button>
            </span>
          ))}
        </div>

        <div className="max-h-32 overflow-y-auto flex flex-col gap-2">
          {loading ? (
            <p className="text-xs text-gray-500 text-center animate-pulse">Searching...</p>
          ) : (
            searchResult?.slice(0, 4).map((user) => (
              <div key={user._id} onClick={() => handleAddUser(user)} className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-[var(--bg)] hover:shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)] transition-all">
                <Avatar src={user.profilePic} text={user.username.charAt(0).toUpperCase()} size="w-8 h-8" />
                <span className="text-sm font-medium text-gray-700">{user.username}</span>
              </div>
            ))
          )}
        </div>

        <button onClick={handleSubmit} disabled={isSubmitting} className="mt-2 w-full py-3 rounded-xl font-bold text-white bg-blue-500 shadow-[4px_4px_10px_rgba(37,99,235,0.3),-4px_-4px_10px_var(--shadow-light)] hover:bg-blue-600 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {isSubmitting ? "Creating..." : "Create Room"}
        </button>
      </div>
    </div>
  );
};

export default RoomModal;
