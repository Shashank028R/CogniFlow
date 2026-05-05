import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import createOrFetchRoom from "../controllers/Chat/createOrFetchRoom.js";
import fetchUserRooms from "../controllers/Chat/fetchUserRooms.js";

const router = express.Router();

router.post("/", authMiddleware, createOrFetchRoom);
router.get("/", authMiddleware, fetchUserRooms);

export default router;