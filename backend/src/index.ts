import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import timelineRoutes from "./routes/timeline";
import gardenRoutes from "./routes/garden";
import unblockerRoutes from "./routes/unblocker";
import documentRoutes from "./routes/documents";
import { apiLimiter, authLimiter } from "./middleware/rateLimit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors());

// Body parsing
app.use(express.json({ limit: "10mb" })); // Limit body size

// Rate limiting
app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/garden", gardenRoutes);
app.use("/api/unblocker", unblockerRoutes);
app.use("/api/documents", documentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
