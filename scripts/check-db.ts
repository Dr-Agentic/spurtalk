import { prisma } from "../backend/src/lib/prisma";

async function main() {
    const tasks = await prisma.task.findMany();
    console.log("Total tasks:", tasks.length);
    tasks.forEach((t) => {
        console.log(`- [${t.id}] ${t.title} (${t.state}) User: ${t.userId}`);
    });

    const users = await prisma.user.findMany();
    console.log("Total users:", users.length);
    users.forEach((u) => {
        console.log(`- [${u.id}] ${u.email}`);
        console.log("  Garden State:", JSON.stringify(u.gardenState, null, 2));
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
