import { prisma } from "../backend/src/lib/prisma";

async function main() {
    const user = await prisma.user.findFirst();
    if (!user) {
        console.error("No user found. Please register or login first.");
        process.exit(1);
    }

    const tasks = [
        {
            title: "Review quarterly report",
            description: "Analyze the financial results and prepare a summary.",
            effortLevel: "Medium",
            emotionalTag: "Boring",
            fuzzyDeadline: "This Week",
            hardDeadline: new Date(Date.now() + 86400000 * 3),
            motivationCategory: "Accomplishment",
            state: "Deck",
        },
        {
            title: "Send client update",
            description: "Quick email to the client about current status.",
            effortLevel: "Tiny",
            emotionalTag: "Fun",
            fuzzyDeadline: "Soon",
            hardDeadline: new Date(Date.now() + 86400000),
            motivationCategory: "Relief",
            state: "Deck",
        },
        {
            title: "Prepare presentation",
            description: "Create slides for the upcoming team meeting.",
            effortLevel: "Big",
            emotionalTag: "Scary",
            fuzzyDeadline: "Eventually",
            hardDeadline: new Date(Date.now() + 86400000 * 7),
            motivationCategory: "Excitement",
            state: "Deck",
        }
    ];

    console.log("Seeding tasks...");
    for (const taskData of tasks) {
        const task = await prisma.task.create({
            data: {
                ...taskData,
                userId: user.id,
            },
        });
        console.log(`Created task: ${task.title}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
