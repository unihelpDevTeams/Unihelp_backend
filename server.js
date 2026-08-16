import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "./routes/contact.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import reportRoutes from "./routes/report.js";
import notificationRoutes, { sendStudyReminderNotifications } from "./routes/notifications.js";
import mediaCleanupRoutes from "./routes/mediaCleanup.js";
import aiRoutes from "./routes/aiRoutes.js";
import aiToolsRoutes from "./routes/aiTools.js";
import suggestionsRoutes from "./routes/suggestions.js";
import voiceRoutes from "./routes/voice.js";
import newsRoutes from "./routes/news.js";
import formulasRoutes from "./routes/formulasRoutes.js";
import challengeQuestionRoutes from "./routes/challengeQuestionRoutes.js";
import hostelsRoutes from "./routes/hostelsRoutes.js";
import marketplaceRoutes from "./routes/marketplaceRoutes.js";
import storiesRoutes from "./routes/storiesRoutes.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const httpServer = createServer(app);

/* =========================================================
   MIDDLEWARE
========================================================= */

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://unihelp-testing.vercel.app",
  "https://unihelp-testing.vercel.app/",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

const io = new Server(httpServer, {
  cors: corsOptions,
});

// =========================================================
// WEBSOCKET (SOCKET.IO) LOGIC
// =========================================================
io.on("connection", (socket) => {
  console.log("⚡ A user connected via WebSockets:", socket.id);

  // 1. Join a personal room (so they can receive private notifications/messages)
  socket.on("join_user_room", (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined personal room`);
    }
  });

  // 2. Join a specific conversation room (for chat)
  socket.on("join_conversation", (conversationId) => {
    if (conversationId) {
      socket.join(`conv_${conversationId}`);
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    }
  });

  // 3. Typing Indicator (Bypasses Firebase entirely!)
  socket.on("typing", ({ conversationId, userId, isTyping, name }) => {
    // Broadcast to everyone in the conversation EXCEPT the person typing
    socket.to(`conv_${conversationId}`).emit("typing_update", {
      conversationId,
      userId,
      isTyping,
      name,
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/payments", paymentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/suggestions", suggestionsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/media-cleanup", mediaCleanupRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ai", aiToolsRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/formulas", formulasRoutes);
app.use("/api/challenge-questions", challengeQuestionRoutes);
app.use("/api/hostels", hostelsRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/stories", storiesRoutes);
console.log("Formulas route loaded successfully");
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running 🚀",
  });
});

app.use(errorHandler);

app.use((err, req, res, next) => {
  console.log(err);

  res.status(500).json({
    success: false,
    error: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 5000;

let reminderSchedulerStarted = false;
let reminderJobInFlight = false;

const startReminderScheduler = () => {
  if (reminderSchedulerStarted) {
    return;
  }

  reminderSchedulerStarted = true;

  const runReminderJob = async () => {
    if (reminderJobInFlight) {
      console.log("[reminder] skipped - previous reminder job still running");
      return;
    }

    reminderJobInFlight = true;

    try {
      const result = await sendStudyReminderNotifications();
      if (result?.success !== false) {
        console.log("[reminder] processed", {
          sent: result?.sent ?? 0,
          recipients: result?.recipients ?? 0,
          skipped: result?.skipped ?? 0,
        });
      }
    } catch (error) {
      console.error("Reminder scheduler failed:", error);
    } finally {
      reminderJobInFlight = false;
    }
  };

  runReminderJob();
    setInterval(() => {
      runReminderJob();
    }, 15 * 60 * 1000);
  };
  
  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Server running on port ${PORT}`
    );
    startReminderScheduler();
  });
