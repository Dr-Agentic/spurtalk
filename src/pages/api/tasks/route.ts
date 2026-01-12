import { auth } from "next-auth"
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/authOptions"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { page?: string } }) {
  const session = await auth(request, authOptions)
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const userId = session.user.id
  const page = parseInt(params.page) || 1
  const pageSize = 10

  const tasks = await prisma.task.findMany({
    where: { userId: userId, deletedAt: null },
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
  const { title, description } = body

  // Basic validation using Zod would be ideal; for now simple check
  if (!title) {
    return new NextResponse("Title is required", { status: 400 })
  }

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