import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// Load environment variables before initializing Prisma
dotenv.config();

const prismaGlobal = global as typeof global & {
    prisma?: PrismaClient;
};

export const prisma = prismaGlobal.prisma || new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") {
    prismaGlobal.prisma = prisma;
}

export default prisma;
