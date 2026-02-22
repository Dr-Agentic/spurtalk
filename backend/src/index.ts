import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import timelineRoutes from "./routes/timeline";
import gardenRoutes from "./routes/garden";
import unblockerRoutes from "./routes/unblocker";
import documentRoutes from "./routes/documents";
import cardRoutes from "./routes/cardRoutes";
import { apiLimiter, authLimiter } from "./middleware/rateLimit";

const app = express();

// Trust proxy if behind a load balancer (like in production or some dev setups)
app.set("trust proxy", 1);

// Request logging - simplified for development
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

const PORT = process.env.PORT || 7101;

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// CORS configuration
app.use(cors({ origin: true, credentials: true }));

// Body parsing
app.use(express.json({ limit: "10mb" })); // Limit body size

// Rate limiting
// Order matters: specific ones first
app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/garden", gardenRoutes);
app.use("/api/unblocker", unblockerRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/cards", cardRoutes);

// Export app for testing
if (process.env.NODE_ENV === "test") {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
