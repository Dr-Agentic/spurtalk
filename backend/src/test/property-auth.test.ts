import * as fc from "fast-check";
import { authService } from "../services/auth";
import { PrismaClient } from "@prisma/client";

import { prisma } from "../lib/prisma";

describe("Property 1: Authentication Round Trip", () => {
  // Increase timeout to handle 1s delay per run * 20 runs
  it("should maintain authentication integrity through full flow", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string(),
        fc.string(),
        async (emailPart, password) => {
          // Ensure valid email format for the test
          const email = `prop-${crypto.randomUUID()}-${emailPart.replace(/[^a-z0-9]/gi, "")}@example.com`;

          // Ensure non-empty password
          if (!password) password = "password";

          try {
            // Register
            const { user } = await authService.register(email, password);
            const sanitizedUser = user;

            // Login
            const { tokens } = await authService.login(email, password);

            // Verify
            const decodedAccess = authService.verifyAccessToken(
              tokens.accessToken
            );
            const decodedRefresh = authService.verifyRefreshToken(
              tokens.refreshToken
            );

            expect(decodedAccess?.userId).toBe(sanitizedUser.id);
            expect(decodedRefresh?.userId).toBe(sanitizedUser.id);

            // Wait 1s to ensure new token has different 'iat'
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Refresh
            const newTokens = await authService.refreshToken(
              tokens.refreshToken
            );
            const newDecodedAccess = authService.verifyAccessToken(
              newTokens.accessToken
            );
            const newDecodedRefresh = authService.verifyRefreshToken(
              newTokens.refreshToken
            );

            expect(newDecodedAccess?.userId).toBe(sanitizedUser.id);
            expect(newDecodedRefresh?.userId).toBe(sanitizedUser.id);

            expect(newTokens.accessToken).not.toBe(tokens.accessToken);

            // Cleanup
            try {
              await prisma.user.delete({ where: { id: sanitizedUser.id } });
            } catch (e) {
              // Ignore cleanup error (e.g. if record missing)
            }
            return true;
          } catch (e) {
            // If we hit a collision or other error, fail gracefully?
            // For property tests, we want to know.
            console.error(e);
            return false;
          }
        }
      ),
      { numRuns: 20 }
    );
  }, 60000);
});
