import { type NextRequest, NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { createSession } from "@/lib/auth/session-manager"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = await db.users.findByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create session
    const session = await createSession(user.id)

    // Set session cookie
    cookies().set({
      name: "session_token",
      value: session.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    // Return user data without password
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error("Error logging in:", error)
    return NextResponse.json({ error: "Failed to log in" }, { status: 500 })
  }
}
