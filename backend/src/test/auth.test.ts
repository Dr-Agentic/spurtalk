import { authService } from "../services/auth";
import { prisma } from "../lib/prisma";

describe("AuthService", () => {
  // Global cleanup for this suite to prevent "User already exists" leaks
  beforeEach(async () => {
    // We can't easily truncate all tables due to FKs without cascade or raw queries.
    // Instead, we'll try to use unique emails per test.
  });

  afterAll(async () => {
    // Try to clean up all test users created
    await prisma.user.deleteMany({
      where: { email: { contains: "example.com" } }, // Careful in prod, safe in test env
    });
  });

  describe("Password Hashing", () => {
    it("should hash password successfully", async () => {
      const password = "test-password";
      const hash = await authService.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);
    });

    it("should verify correct password", async () => {
      const password = "test-password";
      const hash = await authService.hashPassword(password);

      const isValid = await authService.verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const password = "test-password";
      const wrongPassword = "wrong-password";
      const hash = await authService.hashPassword(password);

      const isValid = await authService.verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });
  });

  describe("Token Generation", () => {
    const testUserId = "test-user-id";

    it("should generate access token", () => {
      const token = authService.generateAccessToken(testUserId);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    it("should generate refresh token", () => {
      const token = authService.generateRefreshToken(testUserId);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    it("should generate token pair", () => {
      const tokens = authService.generateTokenPair(testUserId);

      expect(tokens).toHaveProperty("accessToken");
      expect(tokens).toHaveProperty("refreshToken");
      expect(tokens.accessToken).not.toBe(tokens.refreshToken);
    });
  });

  describe("Token Verification", () => {
    const testUserId = "test-user-id";

    it("should verify valid access token", () => {
      const token = authService.generateAccessToken(testUserId);
      const decoded = authService.verifyAccessToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(testUserId);
    });

    it("should verify valid refresh token", () => {
      const token = authService.generateRefreshToken(testUserId);
      const decoded = authService.verifyRefreshToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(testUserId);
    });

    it("should reject invalid access token", () => {
      const decoded = authService.verifyAccessToken("invalid-token");

      expect(decoded).toBeNull();
    });

    it("should reject invalid refresh token", () => {
      const decoded = authService.verifyRefreshToken("invalid-token");

      expect(decoded).toBeNull();
    });
  });

  describe("User Registration", () => {
    it("should register new user", async () => {
      const email = `test-reg-${Date.now()}-${Math.random()}@example.com`;
      const password = "test-password";

      const result = await authService.register(email, password);

      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("tokens");
      expect(result.user).not.toHaveProperty("passwordHash");
      expect(result.tokens).toHaveProperty("accessToken");
      expect(result.tokens).toHaveProperty("refreshToken");
    });

    it("should throw error for duplicate user", async () => {
      const email = `duplicate-${Date.now()}@example.com`;
      const password = "test-password";

      await authService.register(email, password);

      await expect(authService.register(email, password)).rejects.toThrow(
        "User already exists"
      );
    });
  });

  describe("User Login", () => {
    it("should login existing user", async () => {
      const email = `login-${Date.now()}-${Math.random()}@example.com`;
      const password = "test-password";

      await authService.register(email, password);

      const result = await authService.login(email, password);

      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("tokens");
      expect(result.user.email).toBe(email);
      expect(result.user).not.toHaveProperty("passwordHash");
    });

    it("should throw error for non-existent user", async () => {
      await expect(
        authService.login(`nonexistent-${Date.now()}@example.com`, "password")
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw error for wrong password", async () => {
      const email = `wrong-${Date.now()}-${Math.random()}@example.com`;
      const correctPassword = "test-password";
      const wrongPassword = "wrong-password";

      await authService.register(email, correctPassword);

      await expect(authService.login(email, wrongPassword)).rejects.toThrow(
        "Invalid credentials"
      );
    });
  });

  describe("Token Refresh", () => {
    it("should refresh valid token", async () => {
      const email = `refresh-${Date.now()}-${Math.random()}@example.com`;
      const password = "test-password";

      const registerResult = await authService.register(email, password);

      // Wait 1s to ensure new token has different 'iat'
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newTokens = await authService.refreshToken(
        registerResult.tokens.refreshToken
      );

      expect(newTokens).toHaveProperty("accessToken");
      expect(newTokens).toHaveProperty("refreshToken");
      expect(newTokens.accessToken).not.toBe(registerResult.tokens.accessToken);
      expect(newTokens.refreshToken).not.toBe(
        registerResult.tokens.refreshToken
      );
    });

    it("should reject invalid refresh token", async () => {
      await expect(authService.refreshToken("invalid-token")).rejects.toThrow(
        "Invalid refresh token"
      );
    });
  });
});
