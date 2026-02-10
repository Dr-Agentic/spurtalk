import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { prisma } from "../backend/src/lib/prisma";

async function main() {
    const email = "test@example.com";
    const password = "password123";
    const passwordHash = await bcrypt.hash(password, 10);

    console.log(`Checking for user: ${email}`);
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    const gardenState = {
        currentStreak: 5,
        longestStreak: 5,
        totalFlowers: 10,
        totalTrees: 2,
        sunBrightness: 0.8,
        lastUpdated: new Date(),
        elements: [
            { id: "e1", type: "flower", color: "#FFB7C5", position: { x: 10, y: 10 } },
            { id: "e2", type: "tree", color: "#90EE90", position: { x: 50, y: 50 } }
        ]
    };

    if (existingUser) {
        console.log("User already exists. Updating password and garden state...");
        await prisma.user.update({
            where: { email },
            data: {
                passwordHash,
                gardenState: gardenState as any
            },
        });
    } else {
        console.log("Creating new test user...");
        await prisma.user.create({
            data: {
                email,
                passwordHash,
                gardenState: gardenState as any,
                preferences: {
                    stallDetectionTimeout: 24,
                    colorPalette: "default",
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
                },
                subscription: {
                    tier: "free",
                    startDate: new Date(),
                    documentUploadLimit: 10,
                    aiFeaturesEnabled: false,
                }
            },
        });
    }
    console.log("Test user provisioned successfully with full state.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
