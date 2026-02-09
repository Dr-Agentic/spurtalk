import { Router, Response } from "express";
import { unblockerService } from "../services/unblocker";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

router.use(authenticateToken);

router.post("/decompose/:taskId", async (req: AuthRequest, res: Response) => {
  try {
    const task = await unblockerService.decomposeTask(
      req.userId!,
      req.params.taskId as string
    );
    res.json(task);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Task not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to decompose task" });
  }
});

export default router;
