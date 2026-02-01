import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./src/routes/auth";
import taskRoutes from "./src/routes/tasks";
import timelineRoutes from "./src/routes/timeline";
import gardenRoutes from "./src/routes/garden";
import unblockerRoutes from "./src/routes/unblocker";
import documentRoutes from "./src/routes/documents";
import { apiLimiter } from "./src/middleware/rateLimit";

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors());

// Body parsing
app.use(express.json({ limit: "10mb" }));

// Rate limiting
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

// Export app for testing
if (process.env.NODE_ENV === "test") {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
  });
}
