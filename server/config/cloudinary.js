import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Configure Cloudinary with user's keys
cloudinary.config({
  cloud_name: "dojrorkrb",
  api_key: "978759491433125",
  api_secret: "r3bUQfjS4KWBSuZv4WQNE79kEv0",
});

// Configure Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine resource type based on mime type
    const isImage = file.mimetype.startsWith("image/");

    // Sanitize the original filename to avoid URL issues
    const ext = file.originalname.split(".").pop();
    const baseName = file.originalname.split(".")[0].replace(/[^a-zA-Z0-9]/g, "_");

    // For free Cloudinary accounts, "raw" resource delivery is strictly blocked by ACL.
    // We MUST upload PDFs as "image" to bypass this. Cloudinary natively supports storing PDFs as images.
    // However, we MUST append the actual extension (e.g., .pdf) to the public_id so Cloudinary serves the original vector PDF.
    const publicId = `${baseName}_${Date.now()}.${ext}`;

    return {
      folder: "cogniflow",
      resource_type: "image",
      public_id: publicId,
    };
  },
});

const upload = multer({ storage: storage });

export { cloudinary, upload };
