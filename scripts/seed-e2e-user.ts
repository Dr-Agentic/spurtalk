import { authService } from "../backend/src/services/auth";
import { prisma } from "../backend/src/lib/prisma";

async function seed() {
    const email = "test@example.com";
    const password = "password123";

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log(`Creating test user: ${email}`);
        await authService.register(email, password);
        console.log("Test user created successfully.");
    } else {
        console.log("Test user already exists.");
    }
}

seed()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
