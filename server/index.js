import express, { json } from "express";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import { handleSocket } from "./socket/socketHandler.js";
import userRouter from "./routes/userRouter.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

handleSocket(io);

app.use(cors());
app.use(express.json());
connectDb();
app.use("/api/auth", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to CogniFlow API!");
});

httpServer.listen(PORT, () => {
  console.log(`Server is Running on http://localhost:${PORT}`);
});
