import { auth } from "next-auth"
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/authOptions"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: {} }) {
  const session = await auth(request, authOptions)
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const insights = await prisma.insight.findMany({
    where: { userId: session.user.id },
    orderBy: { generatedAt: "desc" }
  })

  return new NextResponse(JSON.stringify(insights), { status: 200 })
}

export async function POST(request: Request, { params }: { params: {} }) {
  const session = await auth(request, authOptions)
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const body = await request.json()
  const { title, content, metadata } = body

  // Simple validation
  if (!title || !content) {
    return new NextResponse("Title and content are required", { status: 400 })
  }

  // Simulate OpenAI generation (in real app, call OpenAI)
  const generatedContent = generateInsights(content)

  const insight = await prisma.insight.create({
    data: {
      userId: session.user.id,
      title,
      content: generatedContent,
      metadata: metadata || {},
    }
  })

  return new NextResponse(JSON.stringify(insight), { status: 201 })
}

// Simple mock of insight generation based on content
function generateInsights(content: string): string {
  // In real implementation, this would call OpenAI
  // For now, return a basic pattern-based summary
  const patterns = [
    "You tend to procrastinate during morning hours on task type X.",
    "Your most productive time is during late afternoon.",
    "You often switch between task types A and B.",
    "You frequently pause after 25 minutes of work."
  ]
  // Return a simple pattern-based insight
  return patterns[0]
}