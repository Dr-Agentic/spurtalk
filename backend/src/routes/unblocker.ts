import { Router } from "express";
import { unblockerService } from "../services/unblocker";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

router.use(authenticateToken);

// Trigger manual stall detection (e.g., on app load or background job)
router.post("/check-stalls", async (req: AuthRequest, res) => {
  try {
    const stalledIds = await unblockerService.detectStalls(req.userId!);
    res.json({ stalledTasks: stalledIds });
  } catch {
    res.status(500).json({ error: "Failed to detect stalls" });
  }
});

// Manual "I'm Stuck" trigger (Requirement 4.1)
router.post("/:taskId/decompose", async (req: AuthRequest, res) => {
  try {
    const steps = await unblockerService.decomposeTask(
      req.userId!,
      req.params.taskId
    );
    res.json(steps);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Task not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to decompose task" });
  }
});

export default router;
