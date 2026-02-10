import { prisma } from "../backend/src/lib/prisma";
import { authService } from "../backend/src/services/auth";

async function main() {
    const email = "test@example.com";
    const password = "password123";

    console.log(`Checking for user: ${email}`);
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
        console.log("User already exists. Updating password...");
        const passwordHash = await authService.hashPassword(password);
        await prisma.user.update({
            where: { id: existing.id },
            data: { passwordHash }
        });
    } else {
        console.log("Creating test user...");
        await authService.register(email, password);
    }
    console.log("Test user ready.");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
