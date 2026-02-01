import { Router } from "express";
import { timelineService } from "../services/timeline";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

router.use(authenticateToken);

router.get("/", async (req: AuthRequest, res) => {
  try {
    const timeline = await timelineService.getTimeline(req.userId!);
    res.json(timeline);
  } catch {
    res.status(500).json({ error: "Failed to generate timeline" });
  }
});

export default router;
