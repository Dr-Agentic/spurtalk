import { auth } from "next-auth"
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/authOptions"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { cursor?: string } }) {
  const session = await auth(request, authOptions)
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const userId = session.user.id
  const pageSize = 10
  const cursor = params.cursor ? new Date(params.cursor) : undefined

  const sessions = await prisma.session.findMany({
    where: { userId: userId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: pageSize,
    cursor: cursor,
    skip: cursor ? 1 : 0
  })

  return new NextResponse(JSON.stringify(sessions), { status: 200 })
}

export async function POST(request: Request, { params }: { params: {} }) {
  const session = await auth(request, authOptions)
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const userId = session.user.id

  const body = await request.json()
  const contextSnapshot = body.contextSnapshot || ""

  const newSession = await prisma.session.create({
    data: {
      userId: userId,
      contextSnapshot: contextSnapshot,
      // Set interruptionCount based on some condition? For now default 0
    }
  })

  return new NextResponse(JSON.stringify(newSession), { status: 201 })
}