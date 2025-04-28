import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

/**
 * Summarizes user input if it's too long or complex
 */
export async function summarizeUserInput(input: string): Promise<string> {
  // If input is short enough, return as is
  if (input.length < 100) {
    return input
  }

  try {
    // Use AI to summarize longer inputs
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Summarize the following design request concisely, preserving all important details and requirements: "${input}"`,
    })

    return text
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
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Extract structured design requirements from this request. Return a JSON object with fields like "type", "style", "colors", "text", "purpose", etc.: "${input}"`,
    })

    // Parse the JSON response
    try {
      return JSON.parse(text)
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError)
      return { type: "unknown", rawInput: input }
    }
  } catch (error) {
    console.error("Error extracting design requirements:", error)
    return { type: "unknown", rawInput: input }
  }
}
