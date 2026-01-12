import { auth } from "next-auth"
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/authOptions"

const prisma = new PrismaClient()

// Define types for micro-step and breakdown response
type MicroStep = {
  id: string
  title: string
  description?: string
  estimatedTime: number // in minutes
  isCompleted: boolean
}

type BreakdownResponse = {
  steps: MicroStep[]
  confidence: number // 0-1
  tokenUsage?: number
  error?: string
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
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

  // If no body, generate default breakdown
  const body = await request.json()
  const prompt = body.prompt || "Generate micro-steps for the task"

  // Simulate AI breakdown (in real app, call OpenAI)
  const steps = generateMicroSteps(titleOrDescription(task))

  // Store breakdown in task
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      breakdowns: [...task.breakdowns, ...steps.map(s => ({
        ...s,
        createdAt: new Date()
      }))]
    }

  // Return response with confidence and token usage simulation
  const response: BreakdownResponse = {
    steps: steps.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      estimatedTime: s.estimatedTime,
      isCompleted: false
    })),
    confidence: 0.8,
    tokenUsage: 100 // simulated token usage
  }

  return new NextResponse(JSON.stringify(response), { status: 200 })
}

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

  // Return all breakdowns ordered by creation
  const breakdowns = task.breakdowns
    .filter(b => b.deletedAt === null)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map(b => ({
      id: b.id,
      title: b.title,
      description: b.description,
      estimatedTime: b.estimatedTime,
      isCompleted: b.isCompleted
    }))

  return new NextResponse(JSON.stringify({ steps: breakdowns }), { status: 200 })
}

export async function PATCH(request: Request, { params }: { params: { id: string; stepId: string } }) {
  const session = await auth(request, authOptions)
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const taskId = params.id
  const stepId = params.stepId
  const body = await request.json()
  const { isCompleted } = body

  const task = await prisma.task.findUnique({
    where: { id: taskId, userId: session.user.id, deletedAt: null }
  })

  if (!task) {
    return new NextResponse("Task not found or not authorized", { status: 404 })
  }

  // Find the breakdown containing the step
  const breakdown = task.breakdowns.find(b =>
    b.steps.some(s => s.id === stepId)
  )

  if (!breakdown) {
    return new NextResponse("Step not found", { status: 404 })
  }

  // Update the step's completion status
  const updatedBreakdown = {
    ...breakdown,
    steps: breakdown.steps.map(s =>
      s.id === stepId ? { ...s, isCompleted: isCompleted } : s
    )
  )

  // Update task's breakdowns array
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      breakdowns: task.breakdowns.map(b =>
        b.id === breakdown.id ? updatedBreakdown : b
      )
    }
  })

  return new NextResponse(JSON.stringify(updatedTask), { status: 200 })
}

// Helper to generate mock micro-steps from task title/description
function generateMicroSteps(taskTitle: string): MicroStep[] {
  // Simple heuristic-based generation
  const baseSteps = [
    {
      id: `step-${Date.now()}-1",
      title: "Define clear objective",
      description: "Understand what you want to achieve",
      estimatedTime: 5,
      isCompleted: false
    },
    {
      id: `step-${Date.now()}-2",
      title: "Break down into smaller tasks",
      description: "Identify subtasks needed",
      estimatedTime: 10,
      isCompleted: false
    },
    {
      id: `step-${Date.now()}-3",
      title: "Set priorities",
      description: "Rank tasks by importance",
      estimatedTime: 5,
      isCompleted: false
    }
  ]

  // Custom heuristics based on keywords
  const lower = taskTitle.toLowerCase()
  if (lower.includes("write") || lower.includes("research")) {
    return [
      {
        id: `step-${Date.now()}-1`,
        title: "Outline main points",
        description: "Create a structured outline",
        estimatedTime: 10,
        isCompleted: false
      },
      {
        id: `step-${Date.now()}-2",
        title: "Write first section",
        description: "Draft introductory content",
        estimatedTime: 15,
        isCompleted: false
      }
    ]
  } else if (lower.includes("code") || lower.includes("function")) {
    return [
      {
        id: `step-${Date.now()}-1",
        title: "Write function signature",
        description: "Define parameters and return type",
        estimatedTime: 5,
        isCompleted: false
      },
      {
        id: `step-${Date.now()}-2",
        title: "Implement logic",
        description: "Write the function body",
        estimatedTime: 20,
        isCompleted: false
      },
      {
        id: `step-${Date.now()}-3",
        title: "Add tests",
        description: "Write test cases",
        estimatedTime: 10,
        isCompleted: false
      }
    ]
  }

  return baseSteps;
}

// Helper to extract title/description for mock generation
function titleOrDescription(task: any): string {
  return task.title || task.description || "Generic task"
}