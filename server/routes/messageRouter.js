import express from "express";
import fetchMessage from "../controllers/message/fetchMessage.js";
import sendMessage from "../controllers/message/sendMessage.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, sendMessage);
router.get("/:roomId", authMiddleware, fetchMessage);

export default router;
