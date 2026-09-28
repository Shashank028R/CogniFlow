import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../components/ui/Avatar";
import { ArrowLeft, Save, X, Check } from "lucide-react";
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const BackendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const token = localStorage.getItem("token");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
    profilePic: "",
  });

  // Cropping State
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const [isUploadingCrop, setIsUploadingCrop] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${BackendUrl}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          username: data.username || "",
          email: data.email || "",
          bio: data.bio || "",
          profilePic: data.profilePic || "",
        });
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [BackendUrl, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await axios.put(
        `${BackendUrl}/api/user/profile`,
        {
          username: formData.username,
          bio: formData.bio,
          profilePic: formData.profilePic,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
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
      makeAspectCrop(
        { unit: '%', width: 80 },
        1, // 1:1 aspect ratio
        width,
        height
      ),
      width,
      height
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
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
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
    const toastId = toast.loading("Uploading cropped picture...");
    try {
      const blob = await generateCroppedImage();
      if (!blob) throw new Error("Could not generate crop");
      
      const uploadData = new FormData();
      uploadData.append("file", blob, "profile.jpg");
      
      const { data } = await axios.post(`${BackendUrl}/api/upload`, uploadData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      
      setFormData({ ...formData, profilePic: data.fileUrl });
      toast.success("Picture updated successfully!", { id: toastId });
      setImgSrc(""); // Close crop modal
    } catch (error) {
      toast.error("Failed to upload cropped picture", { id: toastId });
    } finally {
      setIsUploadingCrop(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[4px_4px_10px_var(--shadow-dark),-4px_-4px_10px_var(--shadow-light)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent relative">
      
      {/* Crop Modal Overlay */}
      {imgSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-[var(--bg)] p-6 rounded-3xl shadow-2xl max-w-lg w-full flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-[var(--text)]">Crop Profile Picture</h2>
            <div className="max-h-[60vh] overflow-hidden w-full bg-black rounded-xl flex items-center justify-center">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imgRef}
                  alt="Crop preview"
                  src={imgSrc}
                  onLoad={onImageLoad}
                  className="max-h-[60vh] object-contain block"
                />
              </ReactCrop>
            </div>
            <div className="flex gap-4 mt-6 w-full">
              <button
                onClick={() => setImgSrc("")}
                className="flex-1 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold shadow-[4px_4px_8px_var(--shadow-dark),-4px_-4px_8px_var(--shadow-light)] hover:shadow-[inset_2px_2px_4px_var(--shadow-dark),inset_-2px_-2px_4px_var(--shadow-light)] transition-all flex items-center justify-center gap-2"
              >
                <X size={18} /> Cancel
              </button>
              <button
                onClick={handleUploadCrop}
                disabled={isUploadingCrop || !completedCrop}
                className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-bold shadow-[4px_4px_10px_rgba(37,99,235,0.3),-4px_-4px_10px_var(--shadow-light)] hover:bg-blue-600 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploadingCrop ? "Uploading..." : <><Check size={18} /> Apply</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-lg bg-[var(--card)]/80 backdrop-blur-2xl rounded-2xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-slate-200/80 dark:border-slate-800 animate-[fadeIn_0.2s_ease]">
        
        <div className="flex items-center gap-3.5 mb-6">
          <button 
            onClick={() => navigate(-1)}
            type="button"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl font-bold text-[var(--text)]">Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col items-center mb-2">
            <div className="w-20 h-20 mb-3 rounded-full border border-slate-200/80 dark:border-slate-700/80 p-1 bg-slate-100 dark:bg-slate-800 shadow-xs">
              <Avatar src={formData.profilePic} text={formData.username.charAt(0).toUpperCase()} size="w-full h-full" />
            </div>
            <p className="text-xs text-slate-500">Profile Preview</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 px-1">Email (Read Only)</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              disabled
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 text-slate-400 border border-slate-200/60 dark:border-slate-800 cursor-not-allowed text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 px-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full py-2.5 px-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/60 text-[var(--text)] border border-slate-200/80 dark:border-slate-700/80 shadow-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 px-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/60 text-[var(--text)] border border-slate-200/80 dark:border-slate-700/80 shadow-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all resize-none text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 px-1">Profile Picture</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                id="profile-pic-upload"
                className="hidden"
                accept="image/*"
                onChange={onSelectFile}
              />
              <button
                type="button"
                onClick={() => document.getElementById("profile-pic-upload").click()}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 font-semibold border border-blue-200/70 dark:border-blue-800/70 shadow-xs hover:bg-blue-100/70 dark:hover:bg-blue-900/50 active:scale-95 transition-all cursor-pointer text-xs"
              >
                Upload New Photo
              </button>
            </div>
            <span className="text-[11px] text-slate-400 px-1 mt-0.5">Select a JPG or PNG to crop</span>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-[0_2px_8px_rgba(37,99,235,0.25)] active:scale-95 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed text-sm"
          >
            {isSaving ? "Saving..." : (
              <>
                <Save size={16} /> Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
