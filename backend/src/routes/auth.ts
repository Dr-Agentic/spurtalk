import { Router, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { authService } from "../services/auth";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await authService.register(email, password);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.message === "User already exists") {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (error: any) {
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    const tokens = await authService.refreshToken(refreshToken);
    res.json(tokens);
  } catch (error: any) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

router.get("/profile", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { passwordHash, ...sanitizedUser } = user;
    res.json(sanitizedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

router.put("/profile", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { email, preferences } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(email && { email }),
        ...(preferences && { preferences }),
      },
    });

    const { passwordHash, ...sanitizedUser } = user;
    res.json(sanitizedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

router.delete("/account", authenticateToken, async (req: AuthRequest, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.userId },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete account" });
  }
});

router.get("/export-data", authenticateToken, async (req: AuthRequest, res) => {
  try {
    const data = await authService.exportUserData(req.userId!);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to export data", message: error.message });
  }
});

export default router;
