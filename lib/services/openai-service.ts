import { API_CONFIG } from "@/lib/config/api-config"

// Get API key from environment variable
const apiKey = process.env.API_KEY || ""

/**
 * Makes a direct call to the OpenAI API
 */
export async function callOpenAI(messages: any[], options: any = {}) {
  if (!apiKey) {
    throw new Error("OpenAI API key is not configured")
  }

  const response = await fetch(`${API_CONFIG.openai.baseUrl}${API_CONFIG.openai.endpoints.completions}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options.model || API_CONFIG.openai.defaultModel,
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 500,
      ...options,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`)
  }

  return await response.json()
}
