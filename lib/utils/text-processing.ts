import { API_CONFIG, isValidAPIKey, isVercelAIKey } from "@/lib/config/api-config"
import { callVercelAI } from "@/lib/services/vercel-ai-service"
import { generateMockSummary, generateMockDesignRequirements } from "@/lib/services/mock-ai-service"

// Get API key from environment variable
const apiKey = process.env.API_KEY || ""

/**
 * Summarizes user input if it's too long or complex
 */
export async function summarizeUserInput(input: string): Promise<string> {
  // If input is short enough, return as is
  if (input.length < 100) {
    return input
  }

  // If API key is not valid, use mock summary
  if (!isValidAPIKey(apiKey)) {
    console.warn("No valid API key available for summarizeUserInput. Using mock summary.")
    return generateMockSummary(input)
  }

  try {
    let summary: string

    // Determine if we're using Vercel AI SDK or direct OpenAI
    if (isVercelAIKey(apiKey)) {
      // Use Vercel AI SDK
      const prompt = `Summarize the following design request concisely, preserving all important details and requirements: "${input}"`

      const vercelResponse = await callVercelAI(prompt, {
        systemPrompt: "You are a helpful assistant that summarizes text concisely.",
        temperature: 0.3,
        maxTokens: 200,
      })

      summary = vercelResponse.choices[0]?.message?.content || input
    } else {
      // Use direct OpenAI API
      const response = await fetch(`${API_CONFIG.openai.baseUrl}${API_CONFIG.openai.endpoints.completions}`, {
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
              content: "You are a helpful assistant that summarizes text concisely.",
            },
            {
              role: "user",
              content: `Summarize the following design request concisely, preserving all important details and requirements: "${input}"`,
            },
          ],
          temperature: 0.3,
          max_tokens: 200,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`)
      }

      const data = await response.json()
      summary = data.choices[0]?.message?.content || input
    }

    return summary
  } catch (error) {
    console.error("Error summarizing input:", error)
    // Return original input if summarization fails
    return input
  }
}

/**
 * Analyzes user input to extract design requirements
 */
export async function extractDesignRequirements(input: string): Promise<any> {
  // If API key is not valid, return mock design requirements
  if (!isValidAPIKey(apiKey)) {
    console.warn("No valid API key available for extractDesignRequirements. Using mock requirements.")
    return generateMockDesignRequirements(input)
  }

  try {
    let jsonText: string

    // Determine if we're using Vercel AI SDK or direct OpenAI
    if (isVercelAIKey(apiKey)) {
      // Use Vercel AI SDK
      const prompt = `Extract structured design requirements from this request. Return a JSON object with fields like "type", "style", "colors", "text", "purpose", etc.: "${input}"`

      const vercelResponse = await callVercelAI(prompt, {
        systemPrompt:
          "You are a helpful assistant that extracts structured design requirements from text. Return only valid JSON.",
        temperature: 0.2,
        maxTokens: 500,
        response_format: { type: "json_object" },
      })

      jsonText = vercelResponse.choices[0]?.message?.content || "{}"
    } else {
      // Use direct OpenAI API
      const response = await fetch(`${API_CONFIG.openai.baseUrl}${API_CONFIG.openai.endpoints.completions}`, {
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
              content:
                "You are a helpful assistant that extracts structured design requirements from text. Return only valid JSON.",
            },
            {
              role: "user",
              content: `Extract structured design requirements from this request. Return a JSON object with fields like "type", "style", "colors", "text", "purpose", etc.: "${input}"`,
            },
          ],
          temperature: 0.2,
          max_tokens: 500,
          response_format: { type: "json_object" },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`OpenAI API error: ${errorData.error?.message || "Unknown error"}`)
      }

      const data = await response.json()
      jsonText = data.choices[0]?.message?.content || "{}"
    }

    // Parse the JSON response
    try {
      return JSON.parse(jsonText)
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError)
      return { type: "unknown", rawInput: input }
    }
  } catch (error) {
    console.error("Error extracting design requirements:", error)
    return { type: "unknown", rawInput: input }
  }
}
