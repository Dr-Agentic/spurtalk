import { auth } from '@/auth'
import { NextResponse } from 'next/server'

/**
 * GET /api/user/profile
 * Returns the authenticated user's profile information
 */
export async function GET(request: Request) {
  const session = await auth(request)
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Return basic profile information
  return new NextResponse(
    JSON.stringify({
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      timezone: session.user.timezone || 'UTC',
      preferences: session.user.preferences || {},
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
}

/**
 * PATCH /api/user/profile
 * Updates the authenticated user's profile information
 */
export async function PATCH(request: Request) {
  const session = await auth(request)
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await request.json()
    // In a real implementation, this would update the database
    // For now, just return success
    return new NextResponse(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new NextResponse('Bad Request', { status: 400 })
  }
}