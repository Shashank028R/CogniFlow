import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../config/cloudinary.js";
import uploadFile from "../controllers/Upload/uploadFile.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("file"), uploadFile);

export default router;
