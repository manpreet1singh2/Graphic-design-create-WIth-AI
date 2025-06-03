import { xai } from "@ai-sdk/xai"
import { streamText } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: xai("grok-beta"),
    messages,
    system: `You are a helpful personal AI assistant powered by Grok. You're knowledgeable, witty, and ready to help with any task. Feel free to be conversational and engaging while providing accurate and helpful information.`,
  })

  return result.toDataStreamResponse()
}
