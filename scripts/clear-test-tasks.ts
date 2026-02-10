import { prisma } from "../backend/src/lib/prisma";

async function main() {
    const email = "test@example.com";
    console.log(`Clearing tasks for user: ${email}`);
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
        await prisma.task.deleteMany({
            where: { userId: user.id }
        });
        console.log("Tasks cleared.");
    } else {
        console.log("User not found.");
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
