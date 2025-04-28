import { type NextRequest, NextResponse } from "next/server"
import { searchTemplates } from "@/lib/services/template-service"
import { authenticateRequest } from "@/lib/auth/auth-utils"

export async function GET(req: NextRequest) {
  try {
    // Optional authentication
    const authResult = await authenticateRequest(req)
    const userId = authResult.authenticated ? authResult.userId : null

    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get("query") || ""
    const category = searchParams.get("category") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    // Search templates
    const templates = await searchTemplates(query.split(" "), {
      category,
      page,
      limit,
      userId, // For personalized results if user is authenticated
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Require authentication for template creation
    const authResult = await authenticateRequest(req)

    if (!authResult.authenticated) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { keywords, filters } = await req.json()

    if (!keywords || !Array.isArray(keywords)) {
      return NextResponse.json({ error: "Keywords array is required" }, { status: 400 })
    }

    const templates = await searchTemplates(keywords, {
      ...filters,
      userId: authResult.userId,
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error searching templates:", error)
    return NextResponse.json({ error: "Failed to search templates" }, { status: 500 })
  }
}
