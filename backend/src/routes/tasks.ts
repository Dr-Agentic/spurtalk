import { Router, Response } from "express";
import { taskService } from "../services/task";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { CreateTaskSchema, UpdateTaskSchema } from "@spurtalk/shared";
import { z } from "zod";

const router = Router();

router.use(authenticateToken);

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = CreateTaskSchema.parse(req.body);
    const task = await taskService.createTask(req.userId!, validatedData);
    res.status(201).json(task);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    const message = error instanceof Error ? error.message : "Failed to create task";
    console.error("Failed to create task:", error);
    res.status(500).json({ error: message });
  }
});

router.get("/deck", async (req: AuthRequest, res: Response) => {
  try {
    const deck = await taskService.getDeck(req.userId!);
    res.json(deck);
  } catch (error) {
    console.error("Failed to fetch focus deck:", error);
    res.status(500).json({ error: "Failed to fetch focus deck" });
  }
});

router.post("/deck/:id/swipe", async (req: AuthRequest, res: Response) => {
  try {
    const { direction } = req.body;
    if (!["right", "left", "down"].includes(direction)) {
      return res.status(400).json({ error: "Invalid swipe direction" });
    }

    const task = await taskService.handleSwipe(
      req.userId!,
      req.params.id as string,
      direction
    );
    res.json(task);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Task not found") {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof Error && error.message === "Task is not in Deck state") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to process swipe" });
  }
});

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await taskService.getTasks(req.userId!, {
      state: req.query.state as string,
    });
    res.json(tasks);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const task = await taskService.getTask(req.userId!, req.params.id as string);
    res.json(task);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Task not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = UpdateTaskSchema.parse(req.body);
    const task = await taskService.updateTask(
      req.userId!,
      req.params.id as string,
      validatedData
    );
    res.json(task);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    if (error instanceof Error && error.message === "Task not found") {
      return res.status(404).json({ error: error.message });
    }
    const message = error instanceof Error ? error.message : "Failed to update task";
    res.status(500).json({ error: message });
  }
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    await taskService.deleteTask(req.userId!, req.params.id as string);
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Task not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to delete task" });
  }
});

router.get("/:id/plan", async (req: AuthRequest, res: Response) => {
  try {
    const plan = await taskService.planSubtasks(
      req.userId!,
      req.params.id as string
    );
    res.json(plan);
  } catch (error) {
    console.error("Failed to plan subtasks:", error);
    res.status(500).json({ error: "Failed to plan subtasks" });
  }
});

router.post("/:id/subtasks", async (req: AuthRequest, res: Response) => {
  try {
    const { subtasks, strategy } = req.body;
    const createdTasks = await taskService.createSubtasks(
      req.userId!,
      req.params.id as string,
      subtasks,
      strategy
    );
    res.status(201).json(createdTasks);
  } catch (error) {
    console.error("Failed to create subtasks:", error);
    res.status(500).json({ error: "Failed to create subtasks" });
  }
});

export default router;
