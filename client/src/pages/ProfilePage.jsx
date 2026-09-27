import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../components/ui/Avatar";
import { ArrowLeft, Save, X, Check, Camera, User, Mail, FileText } from "lucide-react";
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
      } catch {
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
    const toastId = toast.loading("Updating profile...");

    try {
      const { data } = await axios.put(
        `${BackendUrl}/api/user/profile`,
        {
          username: formData.username,
          bio: formData.bio,
          profilePic: formData.profilePic,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Profile updated successfully!", { id: toastId });
      setFormData((prev) => ({
        ...prev,
        username: data.username,
        bio: data.bio,
        profilePic: data.profilePic,
      }));
    } catch {
      toast.error("Failed to update profile", { id: toastId });
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
      uploadData.append("file", blob, "profile.jpg");
      
      const { data } = await axios.post(`${BackendUrl}/api/upload`, uploadData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      
      setFormData((prev) => ({ ...prev, profilePic: data.fileUrl }));
      setImgSrc("");
      toast.success("Picture updated! Don't forget to save.", { id: toastId });
    } catch {
      toast.error("Failed to upload image", { id: toastId });
    } finally {
      setIsUploadingCrop(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-4">
      {/* Crop Modal Overlay */}
      {imgSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 animate-[fadeIn_0.15s_ease]">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full flex flex-col items-center">
            <h2 className="text-lg font-bold mb-4">Crop Profile Picture</h2>
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

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 animate-[fadeIn_0.2s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Profile Settings</h1>
          <div className="w-8" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <div
              className="relative group cursor-pointer"
              onClick={() => document.getElementById("profile-pic-upload").click()}
            >
              <Avatar
                src={formData.profilePic}
                text={formData.username.charAt(0).toUpperCase()}
                size="w-24 h-24"
              />
              <div className="absolute inset-0 bg-slate-900/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
              <input
                type="file"
                id="profile-pic-upload"
                className="hidden"
                accept="image/*"
                onChange={onSelectFile}
              />
            </div>
            <span className="text-xs text-slate-400 font-medium">Click to upload new photo</span>
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-800/50 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
              />
              <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Username</label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <User size={16} className="absolute left-3 top-3 text-slate-400" />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Bio</label>
            <div className="relative">
              <textarea
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                maxLength="150"
                placeholder="A brief note about yourself..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
              <FileText size={16} className="absolute left-3 top-3 text-slate-400" />
            </div>
            <div className="text-right text-[11px] text-slate-400 mt-1">
              {formData.bio.length} / 150
            </div>
          </div>

          {/* Actions */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            <Save size={16} />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
