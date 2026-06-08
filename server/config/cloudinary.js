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
    
    // Cloudinary natively supports PDFs inside the "image" resource type! 
    // This bypasses strict security restrictions on the "raw" resource type.
    const resourceType = "image";

    // Sanitize the original filename to avoid URL issues
    const ext = file.originalname.split(".").pop();
    const baseName = file.originalname.split(".")[0].replace(/[^a-zA-Z0-9]/g, "_");
    const publicId = `${baseName}_${Date.now()}`;

    // Return the config
    return {
      folder: "cogniflow",
      resource_type: "image", // Treat everything as an image to bypass 'raw' security
      public_id: publicId,    // Cloudinary will automatically append the correct extension (e.g. .pdf or .png)
    };
  },
});

const upload = multer({ storage: storage });

export { cloudinary, upload };
