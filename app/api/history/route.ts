import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth/auth-utils"
import { getUserHistory, deleteHistoryItem } from "@/lib/services/history-service"

export async function GET(req: NextRequest) {
  try {
    // Require authentication
    const authResult = await authenticateRequest(req)

    if (!authResult.authenticated) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    // Get user history
    const history = await getUserHistory(authResult.userId, { page, limit })

    return NextResponse.json(history)
  } catch (error) {
    console.error("Error fetching user history:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Require authentication
    const authResult = await authenticateRequest(req)

    if (!authResult.authenticated) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { historyId } = await req.json()

    if (!historyId) {
      return NextResponse.json({ error: "History item ID is required" }, { status: 400 })
    }

    // Delete history item (with user verification)
    const result = await deleteHistoryItem(historyId, authResult.userId)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 403 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting history item:", error)
    return NextResponse.json({ error: "Failed to delete history item" }, { status: 500 })
  }
}
