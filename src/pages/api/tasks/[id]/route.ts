import { auth } from "next-auth"
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/authOptions"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await auth(request, authOptions)
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const taskId = params.id
  const task = await prisma.task.findUnique({
    where: { id: taskId, userId: session.user.id, deletedAt: null }
  })

  if (!task) {
    return new NextResponse("Task not found or not authorized", { status: 404 })
  }

  return new NextResponse(JSON.stringify(task), { status: 200 })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth(request, authOptions)
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const taskId = params.id
  const body = await request.json()
  const { title, description, status } = body

  const task = await prisma.task.findUnique({
    where: { id: taskId, userId: session.user.id, deletedAt: null }
  })

  if (!task) {
    return new NextResponse("Task not found or not authorized", { status: 404 })
  }

  const updatedData: any = {}
  if (title) updatedData.title = title
  if (description) updatedData.description = description
  if (status && ["PENDING", "IN_PROGRESS", "COMPLETED", "ARCHIVED"].includes(status)) {
    updatedData.status = status
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: updatedData
  })

  return new NextResponse(JSON.stringify(updatedTask), { status: 200 })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth(request, authOptions)
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const taskId = params.id
  const task = await prisma.task.findUnique({
    where: { id: taskId, userId: session.user.id, deletedAt: null }
  })

  if (!task) {
    return new NextResponse("Task not found or not authorized", { status: 404 })
  }

  const deletedTask = await prisma.task.update({
    where: { id: taskId },
    data: { deletedAt: new Date() }
  })

  return new NextResponse(JSON.stringify(deletedTask), { status: 200 })
}