// API configuration
export const API_CONFIG = {
  // OpenAI direct API configuration
  openai: {
    baseUrl: "https://api.openai.com/v1",
    endpoints: {
      completions: "/chat/completions",
      embeddings: "/embeddings",
    },
    defaultModel: "gpt-4o",
  },
  // Vercel AI SDK configuration
  vercelAI: {
    baseUrl: "https://api.vercel.ai",
    endpoints: {
      completions: "/v1/completions",
    },
    defaultModel: "openai:gpt-4o",
  },
}

// Validate if a string looks like an API key
export function isValidAPIKey(key: string): boolean {
  return typeof key === "string" && (key.startsWith("sk-") || key.startsWith("sk-proj-")) && key.length > 20
}

// Determine if the key is a Vercel AI SDK project key
export function isVercelAIKey(key: string): boolean {
  return typeof key === "string" && key.startsWith("sk-proj-")
}

// Get a mock response for development/demo purposes
export function getMockAIResponse(prompt: string, templates: any[]): string {
  // Simple template-based response for demo purposes
  if (templates && templates.length > 0) {
    const templateNames = templates.map((t) => t.name).join(", ")
    return `Based on your request, I've found these templates that might be helpful: ${templateNames}. Would you like me to customize any of these for you? (Note: This is a mock response as no valid API key is available)`
  }

  return `I understand you're looking for design assistance with "${prompt}". In a real implementation, I would provide personalized recommendations based on your request. (Note: This is a mock response as no valid API key is available)`
}
