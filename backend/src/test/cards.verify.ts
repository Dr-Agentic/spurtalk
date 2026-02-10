import request from "supertest";
// @ts-expect-error Express app is exported via CommonJS in test mode.
import app from "../index";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

import { prisma } from "../lib/prisma";

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "secret", {
    expiresIn: "1h",
  });
};

const verify = async () => {
  console.log("Starting verification...");

  // 1. Create User
  const user = await prisma.user.create({
    data: {
      email: `test-${Date.now()}@example.com`,
      passwordHash: "hash",
    },
  });
  const token = generateToken(user.id);

  try {
    // 2. Create Task (Initial state: Deck)
    const task = await prisma.task.create({
      data: {
        userId: user.id,
        title: "Test Task",
        effortLevel: "Small",
        hardDeadline: new Date(),
        fuzzyDeadline: "This Week",
        state: "Deck",
      },
    });

    console.log(`Created task ${task.id} with state ${task.state}`);

    // 3. Test OPEN -> loading
    let res = await request(app)
      .post(`/api/cards/${task.id}/open`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    if (res.body.state !== "loading") {
      throw new Error(`Expected state 'loading', got '${res.body.state}'`);
    }
    console.log("OPEN -> loading: PASS");

    // 4. Test READY -> active
    res = await request(app)
      .post(`/api/cards/${task.id}/ready`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    if (res.body.state !== "active") {
      throw new Error(`Expected state 'active', got '${res.body.state}'`);
    }
    console.log("READY -> active: PASS");

    // 5. Test FINISH -> completed
    res = await request(app)
      .post(`/api/cards/${task.id}/finish`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    if (res.body.state !== "completed") {
      throw new Error(`Expected state 'completed', got '${res.body.state}'`);
    }
    // completedAt is optional/nullable in Task model? Let's check schema.
    // Task: completedAt DateTime? @map("completed_at")
    if (!res.body.completedAt) {
      throw new Error("Expected completedAt to be set");
    }
    console.log("FINISH -> completed: PASS");

    // 6. Test CLOSE -> discarded
    const task2 = await prisma.task.create({
      data: {
        userId: user.id,
        title: "Task to Discard",
        effortLevel: "Small",
        hardDeadline: new Date(),
        fuzzyDeadline: "This Week",
        state: "Deck",
      },
    });

    res = await request(app)
      .post(`/api/cards/${task2.id}/close`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    if (res.body.state !== "discarded") {
      throw new Error(`Expected state 'discarded', got '${res.body.state}'`);
    }
    console.log("CLOSE -> discarded: PASS");

    // 7. Test CLOSE from DISCARDED -> fail
    res = await request(app)
      .post(`/api/cards/${task2.id}/close`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    console.log("CLOSE from DISCARDED -> fail: PASS");
  } finally {
    // Cleanup
    await prisma.task.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.$disconnect();
  }

  console.log("Verification complete!");
};

verify().catch((e) => {
  console.error(e);
  process.exit(1);
});
