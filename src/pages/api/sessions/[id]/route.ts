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

  const sessionId = params.id
  const foundSession = await prisma.session.findUnique({
    where: { id: sessionId, userId: session.user.id, deletedAt: null }
  })

  if (!foundSession) {
    return new NextResponse("Session not found or not authorized", { status: 404 })
  }

  return new NextResponse(JSON.stringify(foundSession), { status: 200 })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth(request, authOptions)
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const sessionId = params.id
  const body = await request.json()
  const { endTime, interruptionCount, reflection } = body

  const updatedSession = await prisma.session.update({
    where: { id: sessionId, userId: session.user.id, deletedAt: null },
    data: {
      endTime: endTime ? new Date(endTime) : new Date(),
      duration: endTime ? (new Date(endTime).getTime() - new Date().getTime()) / (60 * 60 * 1000) : null,
      interruptionCount: interruptionCount !== undefined ? interruptionCount : undefined,
      ...(reflection && { contextSnapshot: reflection })
    }
  })

  return new NextResponse(JSON.stringify(updatedSession), { status: 200 })
}