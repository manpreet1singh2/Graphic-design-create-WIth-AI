import { API_CONFIG } from "@/lib/config/api-config"

// Get API key from environment variable
const apiKey = process.env.API_KEY || ""

/**
 * Makes a call to the Vercel AI API
 */
export async function callVercelAI(prompt: string, options: any = {}) {
  if (!apiKey) {
    throw new Error("API key is not configured")
  }

  const response = await fetch(`${API_CONFIG.vercelAI.baseUrl}${API_CONFIG.vercelAI.endpoints.completions}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options.model || API_CONFIG.vercelAI.defaultModel,
      messages: [
        {
          role: "system",
          content: options.systemPrompt || "You are a helpful design assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 500,
      ...options,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Vercel AI API error: ${errorData.error?.message || JSON.stringify(errorData) || "Unknown error"}`)
  }

  return await response.json()
}
