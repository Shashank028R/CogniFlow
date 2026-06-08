const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // multer-storage-cloudinary automatically uploads the file and adds its details to req.file
    res.status(200).json({
      fileUrl: req.file.secure_url || req.file.path,
      resourceType: req.file.mimetype.startsWith("image/") ? "image" : "file",
      originalName: req.file.originalname,
      publicId: req.file.filename,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "File upload failed" });
  }
};

export default uploadFile;
