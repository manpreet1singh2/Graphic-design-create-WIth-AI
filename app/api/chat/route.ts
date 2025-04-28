import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { summarizeUserInput } from "@/lib/utils/text-processing"
import { searchTemplates } from "@/lib/services/template-service"
import { saveToHistory } from "@/lib/services/history-service"
import { authenticateRequest } from "@/lib/auth/auth-utils"

export async function POST(req: NextRequest) {
  try {
    const { message, userId, sessionId } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Optional authentication check
    const authResult = await authenticateRequest(req)
    const authenticatedUserId = authResult.authenticated ? authResult.userId : null

    // Use provided userId if authenticated, otherwise use the authenticated user's ID
    const effectiveUserId = authenticatedUserId || userId || "anonymous"

    // 1. Summarize user input if needed
    const processedInput = await summarizeUserInput(message)

    // 2. Extract keywords for template search
    const keywords = extractKeywords(processedInput)

    // 3. Search for relevant templates
    const templateResults = await searchTemplates(keywords)
    const templateList = templateResults.templates || []

    // 4. Generate AI response with template recommendations
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `You are a helpful design assistant. The user is asking about: "${processedInput}". 
  Based on this request, I've found these templates that might be helpful: ${JSON.stringify(templateList.slice(0, 3))}. 
  Provide a helpful response that recommends these templates and asks if they need any customization.`,
    })

    // 5. Save to user history if authenticated
    if (effectiveUserId !== "anonymous") {
      await saveToHistory({
        userId: effectiveUserId,
        sessionId,
        query: message,
        response: text,
        templates: templateList.slice(0, 3),
      })
    }

    return NextResponse.json({
      response: text,
      templates: templateList.slice(0, 5),
    })
  } catch (error) {
    console.error("Error processing chat request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction - in production, use NLP libraries
  const stopWords = ["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with"]
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
  const keywords = words.filter((word) => word.length > 2 && !stopWords.includes(word))
  return [...new Set(keywords)] // Remove duplicates
}
