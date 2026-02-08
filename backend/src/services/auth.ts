import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import { PrismaClient, User, Document } from "@prisma/client";

const prisma = new PrismaClient();

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET || "dev-secret";
    this.refreshTokenSecret =
      process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRATION || "15m";
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRATION || "7d";
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateAccessToken(userId: string): string {
    return jwt.sign({ userId }, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
    } as SignOptions);
  }

  generateRefreshToken(userId: string): string {
    return jwt.sign({ userId, type: "refresh" }, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
    } as SignOptions);
  }

  generateTokenPair(userId: string): TokenPair {
    return {
      accessToken: this.generateAccessToken(userId),
      refreshToken: this.generateRefreshToken(userId),
    };
  }

  verifyAccessToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret) as {
        userId: string;
      };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret) as {
        userId: string;
        type: string;
      };
      if (decoded.type !== "refresh") {
        return null;
      }
      return { userId: decoded.userId };
    } catch (error) {
      return null;
    }
  }

  async register(email: string, password: string) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await this.hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        preferences: this.getDefaultPreferences(),
        subscription: this.getDefaultSubscription(),
        gardenState: this.getDefaultGardenState(),
      },
    });

    try {
      await this.createOnboardingAchievement(user.id);
    } catch (error) {
      console.error("Failed to create onboarding achievement:", error);
    }

    const tokens = this.generateTokenPair(user.id);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await this.verifyPassword(
      password,
      user.passwordHash
    );

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const tokens = this.generateTokenPair(user.id);

    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    const decoded = this.verifyRefreshToken(refreshToken);

    if (!decoded) {
      throw new Error("Invalid refresh token");
    }

    const newTokens = this.generateTokenPair(decoded.userId);

    return newTokens;
  }

  private getDefaultPreferences() {
    return {
      stallDetectionTimeout: 24,
      colorPalette: "default" as const,
      fuzzyDeadlineLabels: {
        soon: 2,
        thisWeek: 7,
        eventually: 30,
      },
      notificationSettings: {
        taskReminders: true,
        stallDetection: true,
        milestoneCelebrations: true,
      },
      timezone: "UTC",
    };
  }

  private getDefaultSubscription() {
    return {
      tier: "free" as const,
      startDate: new Date(),
      documentUploadLimit: 10,
      aiFeaturesEnabled: false,
    };
  }

  private getDefaultGardenState() {
    return {
      elements: [],
      sunBrightness: 0.5,
      currentStreak: 0,
      longestStreak: 0,
      totalFlowers: 0,
      totalTrees: 0,
      lastUpdated: new Date(),
    };
  }

  private async createOnboardingAchievement(userId: string): Promise<void> {
    // Idempotency guard — check if onboarding achievement already exists
    const existing = await prisma.task.findFirst({
      where: {
        userId,
        tags: {
          array_contains: ["onboarding", "achievement"],
        },
      },
    });

    if (existing) {
      return;
    }

    // Pre-generate a task ID
    const taskId = crypto.randomUUID();

    // Create the achievement task
    await prisma.task.create({
      data: {
        id: taskId,
        userId,
        title: "I am not a procrastinator any more!",
        description:
          "You installed SpurTalk, created your account, and logged in. That's three steps already!",
        effortLevel: "Small",
        emotionalTag: "Fun",
        fuzzyDeadline: "Soon",
        hardDeadline: new Date(),
        motivationCategory: "Achievement",
        state: "Completed",
        completedAt: new Date(),
        tags: ["onboarding", "achievement"],
        nanoSteps: [],
      },
    });

    // Update the task with nano-steps
    await prisma.task.update({
      where: { id: taskId },
      data: {
        nanoSteps: [
          {
            id: "onboard-1",
            text: "Install SpurTalk",
            isCompleted: true,
            estimatedSeconds: 60,
            emotionalEffort: "zero",
            parentTaskId: taskId,
          },
          {
            id: "onboard-2",
            text: "Create your account",
            isCompleted: true,
            estimatedSeconds: 120,
            emotionalEffort: "zero",
            parentTaskId: taskId,
          },
          {
            id: "onboard-3",
            text: "Log in for the first time",
            isCompleted: true,
            estimatedSeconds: 30,
            emotionalEffort: "zero",
            parentTaskId: taskId,
          },
        ],
      },
    });

    // Seed garden state with the onboarding golden flower
    await prisma.user.update({
      where: { id: userId },
      data: {
        gardenState: {
          elements: [
            {
              id: "onboarding-flower",
              type: "flower",
              color: "#f59e0b",
              position: { x: 0.5, y: 0.5 },
              size: 1.2,
              taskId: taskId,
              createdAt: new Date(),
            },
          ],
          totalFlowers: 1,
          totalTrees: 0,
          currentStreak: 1,
          longestStreak: 1,
          sunBrightness: 0.6,
          lastUpdated: new Date(),
        },
      },
    });
  }

  async exportUserData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tasks: true,
        documents: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Convert Decimals to numbers for JSON serialization
    const sanitizedDocuments = user.documents.map((doc: Document) => ({
      ...doc,
      confidence: doc.confidence ? Number(doc.confidence) : null,
    }));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...sanitizedUser } = user;
    return {
      ...sanitizedUser,
      documents: sanitizedDocuments,
    };
  }

  private sanitizeUser(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}

export const authService = new AuthService();
