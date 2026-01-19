import { Router, Request } from "express";
import { gardenService } from "../services/garden";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

router.use(authenticateToken);

router.get("/", async (req: AuthRequest, res) => {
  try {
    const garden = await gardenService.getGardenState(req.userId!);
    res.json(garden);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch garden" });
  }
});

router.post("/complete/:taskId", async (req: AuthRequest, res) => {
  try {
    const garden = await gardenService.processTaskCompletion(
      req.userId!,
      req.params.taskId
    );
    res.json(garden);
  } catch (error: any) {
    if (error.message === "Task not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to update garden" });
  }
});

export default router;
