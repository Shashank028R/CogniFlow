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
        1,
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
      setImgSrc("");
    } catch (error) {
      toast.error("Failed to upload cropped picture", { id: toastId });
    } finally {
      setIsUploadingCrop(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] dark:bg-black">
        <div className="w-10 h-10 border-2 border-[#0066cc] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f5f5f7] dark:bg-black relative">
      
      {/* Crop Modal Overlay */}
      {imgSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white dark:bg-[#272729] border border-[#e0e0e0] dark:border-[#333336] p-6 rounded-[18px] max-w-lg w-full flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4 text-[#1d1d1f] dark:text-white">Crop Profile Picture</h2>
            <div className="max-h-[60vh] overflow-hidden w-full bg-black rounded-[14px] flex items-center justify-center">
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
            <div className="flex gap-3 mt-5 w-full">
              <button
                onClick={() => setImgSrc("")}
                className="flex-1 py-2.5 rounded-full border border-[#e0e0e0] dark:border-[#333336] text-[#1d1d1f] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.95] transition-all flex items-center justify-center gap-2 text-sm font-normal cursor-pointer"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleUploadCrop}
                disabled={isUploadingCrop || !completedCrop}
                className="flex-1 py-2.5 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white active:scale-[0.95] transition-all flex items-center justify-center gap-2 text-sm font-normal disabled:opacity-50 cursor-pointer"
              >
                {isUploadingCrop ? "Uploading..." : <><Check size={16} /> Apply</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-lg bg-white dark:bg-[#1d1d1f] border border-[#e0e0e0] dark:border-[#333336] rounded-[18px] p-6 md:p-8 animate-[slideIn_0.3s_ease]">
        
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#e0e0e0] dark:border-[#333336]">
          <button 
            onClick={() => navigate(-1)}
            type="button"
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white bg-[#f5f5f7] dark:bg-[#272729] border border-[#e0e0e0] dark:border-[#333336] active:scale-[0.95] transition-all cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-[#1d1d1f] dark:text-white tracking-tight">Account Settings</h1>
            <p className="text-xs text-[#86868b]">Manage your personal profile and appearance.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col items-center mb-2">
            <div className="w-20 h-20 mb-2 rounded-full border border-[#e0e0e0] dark:border-[#333336] p-1 bg-[#f5f5f7] dark:bg-[#272729] flex items-center justify-center">
              <Avatar src={formData.profilePic} text={formData.username.charAt(0).toUpperCase()} size="w-full h-full" />
            </div>
            <p className="text-xs text-[#86868b]">Avatar Preview</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#86868b] px-1">Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2.5 rounded-full bg-[#f5f5f7] dark:bg-[#272729] text-[#86868b] border border-[#e0e0e0] dark:border-[#333336] outline-none text-sm cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#86868b] px-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-full bg-[#f5f5f7] dark:bg-[#272729] text-[#1d1d1f] dark:text-white border border-[#e0e0e0] dark:border-[#333336] focus:border-[#0071e3] outline-none text-sm transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#86868b] px-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full p-3.5 rounded-[14px] bg-[#f5f5f7] dark:bg-[#272729] text-[#1d1d1f] dark:text-white border border-[#e0e0e0] dark:border-[#333336] focus:border-[#0071e3] outline-none text-sm transition-all resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#86868b] px-1">Profile Picture</label>
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
                className="w-full py-2.5 px-4 rounded-full bg-[#f5f5f7] dark:bg-[#272729] text-[#0066cc] dark:text-[#2997ff] border border-[#e0e0e0] dark:border-[#333336] hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.95] text-sm font-normal transition-all cursor-pointer"
              >
                Upload New Photo
              </button>
            </div>
            <span className="text-xs text-[#86868b] px-1 mt-0.5">JPG or PNG image will open crop selector</span>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white text-sm font-normal active:scale-[0.95] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
