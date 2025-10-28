import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import classScheduleRoutes from "./routes/classScheduleRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import batchRoutes from "./routes/batchRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { initializeSocket } from "./sockets/socketHandler.js";
import aiTestRoute from "./routes/aiTestRoute.js";
import http from "http";

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
// ✅ 1. HTTP server তৈরি করো
const server = http.createServer(app);

// ✅ 2. এখন socket initialize করো
initializeSocket(server);

connectDB();

app.get("/", (req, res) => res.send("Novum Labs IMS API Running 🚀"));

app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/users", userRoutes);
app.use("/api/schedule", classScheduleRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/batch", batchRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/video", videoRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ai", aiTestRoute);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
