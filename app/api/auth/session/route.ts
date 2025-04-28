import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { validateSession } from "@/lib/auth/session-manager"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const sessionToken = cookies().get("session_token")?.value

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const session = await validateSession(sessionToken)

    if (!session) {
      cookies().delete("session_token")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Get user data
    const user = await db.users.findById(session.userId)
    if (!user) {
      cookies().delete("session_token")
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      sessionId: session.id,
    })
  } catch (error) {
    console.error("Error validating session:", error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
