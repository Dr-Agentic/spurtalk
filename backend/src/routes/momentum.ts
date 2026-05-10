import { Router, Response } from "express";
import { momentumService } from "../services/momentum";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

router.use(authenticateToken);

// Start a 5-minute momentum session
router.post("/start/:taskId", async (req: AuthRequest, res: Response) => {
  try {
    const sessionId = await momentumService.startSession(
      req.userId!,
      req.params.taskId as string
    );
    res.json({ sessionId, durationSeconds: 300 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Task not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to start session" });
  }
});

// Complete a momentum session (task finished or timer ran out)
router.post("/complete/:sessionId", async (req: AuthRequest, res: Response) => {
  try {
    const { actualSecondsWorked } = req.body;
    if (typeof actualSecondsWorked !== "number") {
      return res.status(400).json({ error: "actualSecondsWorked required" });
    }
    const result = await momentumService.completeSession(
      req.userId!,
      req.params.sessionId as string,
      actualSecondsWorked
    );
    res.json(result);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Session not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to complete session" });
  }
});

// Abandon a momentum session (user quit early)
router.post("/abandon/:sessionId", async (req: AuthRequest, res: Response) => {
  try {
    const { actualSecondsWorked } = req.body;
    if (typeof actualSecondsWorked !== "number") {
      return res.status(400).json({ error: "actualSecondsWorked required" });
    }
    const result = await momentumService.abandonSession(
      req.userId!,
      req.params.sessionId as string,
      actualSecondsWorked
    );
    res.json(result);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Session not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to abandon session" });
  }
});

// Get momentum stats
router.get("/stats", async (req: AuthRequest, res: Response) => {
  try {
    const stats = await momentumService.getSessionStats(req.userId!);
    res.json(stats);
  } catch {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;