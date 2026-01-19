import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

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

  private sanitizeUser(user: any) {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }
}

export const authService = new AuthService();
