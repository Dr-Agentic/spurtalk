import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authService } from "../services/auth";
import { sendPasswordResetEmail } from "../services/email";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await authService.register(email, password);
    res.status(201).json(result);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "User already exists") {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Invalid credentials") {
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
  } catch {
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: "Failed to export data", message });
  }
});

// POST /auth/forgot-password — Generate reset token + send email
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    // Always return 200 to prevent email enumeration
    if (!user) {
      return res.status(200).json({ message: "If that email exists, a reset link was sent." });
    }

    const resetToken = authService.generatePasswordResetToken(user.id);
    await sendPasswordResetEmail({ to: user.email, resetToken });

    res.status(200).json({ message: "If that email exists, a reset link was sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Failed to send reset email" });
  }
});

// POST /auth/reset-password — Validate token + update password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const userId = authService.verifyPasswordResetToken(token);
    if (!userId) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const passwordHash = await authService.hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

export default router;
