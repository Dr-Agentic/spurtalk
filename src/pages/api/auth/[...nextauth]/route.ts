import { auth } from "next-auth/server"
import { NextResponse } from "next/server"

export const authOptions = {
  providers: [
    // Google OAuth provider
    {
      id: "google",
      name: "Google",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    // GitHub OAuth provider
    {
      id: "github",
      name: "GitHub",
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    // Email provider for passwordless sign-in
    {
      id: "email",
      name: "Email",
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    },
  ],
  // Use JWT sessions for scalability
  session: {
    strategy: "jwt",
  },
  // Secret used to encrypt the JWT session token
  secret: process.env.NEXTAUTH_SECRET,
  // Enable debug mode in development
  debug: process.env.NEXTAUTH_DEBUG === "true",
};

export async function GET(request: any) {
  return auth(request, NextResponse, authOptions)
}

export async function POST(request: any) {
  return auth(request, NextResponse, authOptions)
}