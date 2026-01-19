import { Router, Request } from "express";
import { taskService } from "../services/task";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { CreateTaskSchema, UpdateTaskSchema } from "@spurtalk/shared";
import { z } from "zod";

const router = Router();

router.use(authenticateToken);

router.post("/", async (req: AuthRequest, res) => {
  try {
    const validatedData = CreateTaskSchema.parse(req.body);
    const task = await taskService.createTask(req.userId!, validatedData);
    res.status(201).json(task);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
});

router.get("/deck", async (req: AuthRequest, res) => {
  try {
    const deck = await taskService.getDeck(req.userId!);
    res.json(deck);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch focus deck" });
  }
});

router.post("/deck/:id/swipe", async (req: AuthRequest, res) => {
  try {
    const { direction } = req.body;
    if (!["right", "left", "down"].includes(direction)) {
      return res.status(400).json({ error: "Invalid swipe direction" });
    }

    const task = await taskService.handleSwipe(
      req.userId!,
      req.params.id,
      direction
    );
    res.json(task);
  } catch (error: any) {
    if (error.message === "Task not found") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === "Task is not in Deck state") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to process swipe" });
  }
});

router.get("/", async (req: AuthRequest, res) => {
  try {
    const tasks = await taskService.getTasks(req.userId!, {
      state: req.query.state as string,
    });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const task = await taskService.getTask(req.userId!, req.params.id);
    res.json(task);
  } catch (error: any) {
    if (error.message === "Task not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

router.put("/:id", async (req: AuthRequest, res) => {
  try {
    const validatedData = UpdateTaskSchema.parse(req.body);
    const task = await taskService.updateTask(
      req.userId!,
      req.params.id,
      validatedData
    );
    res.json(task);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    if (error.message === "Task not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    await taskService.deleteTask(req.userId!, req.params.id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "Task not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
