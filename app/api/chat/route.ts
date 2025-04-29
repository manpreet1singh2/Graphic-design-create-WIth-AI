import { type NextRequest, NextResponse } from "next/server"
import { searchTemplates } from "@/lib/services/template-service"
import { saveToHistory } from "@/lib/services/history-service"
import { authenticateRequest } from "@/lib/auth/auth-utils"
import { API_CONFIG, isValidAPIKey, isVercelAIKey, getMockAIResponse } from "@/lib/config/api-config"
import { callVercelAI } from "@/lib/services/vercel-ai-service"

// Get API key from environment variable
const apiKey = process.env.API_KEY || ""

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

    // Extract keywords for template search (no need for AI for this)
    const keywords = extractKeywords(message)

    // Search for relevant templates
    const templateResults = await searchTemplates(keywords)
    const templateList = templateResults.templates || []

    let responseText: string

    // Check if we have a valid API key
    if (isValidAPIKey(apiKey)) {
      try {
        // Determine if we're using Vercel AI SDK or direct OpenAI
        if (isVercelAIKey(apiKey)) {
          // Use Vercel AI SDK
          console.log("Using Vercel AI SDK for completion")
          const prompt = `The user is asking about: "${message}". 
Based on this request, I've found these templates that might be helpful: ${JSON.stringify(templateList.slice(0, 3))}. 
Provide a helpful response that recommends these templates and asks if they need any customization.`

          const vercelResponse = await callVercelAI(prompt, {
            systemPrompt: "You are a helpful design assistant that recommends templates based on user requests.",
          })

          responseText = vercelResponse.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."
        } else {
          // Use direct OpenAI API
          console.log("Using direct OpenAI API for completion")
          const openaiResponse = await fetch(`${API_CONFIG.openai.baseUrl}${API_CONFIG.openai.endpoints.completions}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: API_CONFIG.openai.defaultModel,
              messages: [
                {
                  role: "system",
                  content: "You are a helpful design assistant.",
                },
                {
                  role: "user",
                  content: `The user is asking about: "${message}". 
Based on this request, I've found these templates that might be helpful: ${JSON.stringify(templateList.slice(0, 3))}. 
Provide a helpful response that recommends these templates and asks if they need any customization.`,
                },
              ],
              temperature: 0.7,
              max_tokens: 500,
            }),
          })

          if (!openaiResponse.ok) {
            const errorData = await openaiResponse.json()
            throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`)
          }

          const responseData = await openaiResponse.json()
          responseText = responseData.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."
        }
      } catch (error) {
        console.error("Error calling AI API:", error)
        // Fallback to mock response if API call fails
        responseText = getMockAIResponse(message, templateList.slice(0, 3))
      }
    } else {
      // Use mock response for demo purposes when no valid API key is available
      console.warn("No valid API key available. Using mock response.")
      responseText = getMockAIResponse(message, templateList.slice(0, 3))
    }

    // Save to user history if authenticated
    if (effectiveUserId !== "anonymous") {
      await saveToHistory({
        userId: effectiveUserId,
        sessionId,
        query: message,
        response: responseText,
        templates: templateList.slice(0, 3),
      })
    }

    return NextResponse.json({
      response: responseText,
      templates: templateList.slice(0, 5),
      usingMockResponse: !isValidAPIKey(apiKey),
    })
  } catch (error) {
    console.error("Error processing chat request:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process request" },
      { status: 500 },
    )
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
