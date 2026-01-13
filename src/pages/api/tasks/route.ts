import { auth } from "next-auth";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/authOptions";
import { z } from "zod";

const prisma = new PrismaClient();

const taskSchema = z.object({
  title: z.string(),
  description: z.string().optional()
});

export async function GET(request: Request, { params }: { params: { page?: string } }) {
  const session = await auth(request, authOptions)
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const userId = session.user.id
  const page = parseInt(params.page) || 1
  const pageSize = 10;
  const status = new URL(request.url).searchParams.get('status');
  const where = {
    userId: userId,
    deletedAt: null,
    ...(status && ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'].includes(status as any) && { status })
  };
  const tasks = await prisma.task.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" }
  })

  return new NextResponse(JSON.stringify(tasks), { status: 200 })
}

export async function POST(request: Request, { params }: { params: {} }) {
  const session = await auth(request, authOptions)
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const body = await request.json()
  const result = taskSchema.safeParse(body)

  if (!result.success) {
    return new NextResponse(JSON.stringify(result.error.errors), {
      status: 400
    })
  }

  const { title, description } = result.data

  const newTask = await prisma.task.create({
    data: {
      title,
      description,
      userId: session.user.id,
      status: "PENDING"
    }
  })

  return new NextResponse(JSON.stringify(newTask), { status: 201 })
}