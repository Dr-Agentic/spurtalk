import { Router, Response } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import { CardLifecycleState } from "@spurtalk/shared";

type CardRecord = {
  id: string;
  userId: string;
  state: CardLifecycleState;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

const router = Router();

router.use(authenticateToken);

const allowedTransitions: Record<CardLifecycleState, CardLifecycleState[]> = {
  initial: ["loading"],
  loading: ["active", "discarded"],
  active: ["completed", "discarded"],
  completed: [],
  discarded: [],
};

const cardStore = new Map<string, CardRecord>();

const cardKey = (userId: string, cardId: string) => `${userId}:${cardId}`;

const canTransition = (from: CardLifecycleState, to: CardLifecycleState) => {
  const allowed = allowedTransitions[from] || [];
  return allowed.includes(to);
};

const nowIso = () => new Date().toISOString();

const applyTransition = (
  card: CardRecord,
  next: CardLifecycleState
): CardRecord => {
  if (!canTransition(card.state, next)) {
    throw new Error("INVALID_TRANSITION");
  }

  return {
    ...card,
    state: next,
    updatedAt: nowIso(),
    completedAt: next === "completed" ? nowIso() : card.completedAt,
  };
};

router.post("/:id/open", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const cardId = req.params.id as string;
    const key = cardKey(userId, cardId);

    const existing = cardStore.get(key);
    if (!existing) {
      const created: CardRecord = {
        id: cardId,
        userId,
        state: "loading",
        createdAt: nowIso(),
        updatedAt: nowIso(),
        completedAt: null,
      };
      cardStore.set(key, created);
      return res.json(created);
    }

    const updated = applyTransition(existing, "loading");
    cardStore.set(key, updated);
    res.json(updated);
  } catch (error: any) {
    if (error?.message === "INVALID_TRANSITION") {
      return res.status(400).json({ error: "Invalid state transition" });
    }
    res.status(500).json({ error: "Failed to open card" });
  }
});

router.post("/:id/ready", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const cardId = req.params.id as string;
    const key = cardKey(userId, cardId);

    const existing = cardStore.get(key);
    if (!existing) {
      return res.status(404).json({ error: "Card not found" });
    }

    const updated = applyTransition(existing, "active");
    cardStore.set(key, updated);
    res.json(updated);
  } catch (error: any) {
    if (error?.message === "INVALID_TRANSITION") {
      return res.status(400).json({ error: "Invalid state transition" });
    }
    res.status(500).json({ error: "Failed to set card to ready" });
  }
});

router.post("/:id/finish", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const cardId = req.params.id as string;
    const key = cardKey(userId, cardId);

    const existing = cardStore.get(key);
    if (!existing) {
      return res.status(404).json({ error: "Card not found" });
    }

    const updated = applyTransition(existing, "completed");
    cardStore.set(key, updated);
    res.json(updated);
  } catch (error: any) {
    if (error?.message === "INVALID_TRANSITION") {
      return res.status(400).json({ error: "Invalid state transition" });
    }
    res.status(500).json({ error: "Failed to finish card" });
  }
});

router.post("/:id/close", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const cardId = req.params.id as string;
    const key = cardKey(userId, cardId);

    const existing = cardStore.get(key);
    if (!existing) {
      return res.status(404).json({ error: "Card not found" });
    }

    if (existing.state === "discarded") {
      return res.status(400).json({ error: "Card is already discarded" });
    }

    const updated = applyTransition(existing, "discarded");
    cardStore.set(key, updated);
    res.json(updated);
  } catch (error: any) {
    if (error?.message === "INVALID_TRANSITION") {
      return res.status(400).json({ error: "Invalid state transition" });
    }
    res.status(500).json({ error: "Failed to close card" });
  }
});

export default router;
