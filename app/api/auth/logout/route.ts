import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { deleteSession } from "@/lib/auth/session-manager"

export async function POST(req: NextRequest) {
  try {
    const sessionToken = cookies().get("session_token")?.value

    if (sessionToken) {
      await deleteSession(sessionToken)
      cookies().delete("session_token")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging out:", error)
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 })
  }
}
