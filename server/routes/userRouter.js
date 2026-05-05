import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import searchUsers from "../controllers/User/searchUsers.js";

const router = express.Router();

router.get("/", authMiddleware, searchUsers);

export default router;