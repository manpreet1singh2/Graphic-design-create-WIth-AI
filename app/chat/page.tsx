"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Loader2, AlertCircle, Info } from "lucide-react"
import ChatMessage from "@/components/chat/chat-message"
import TemplateRecommendations from "@/components/templates/template-recommendations"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface Template {
  id: string
  name: string
  category: string
  tags: string[]
}

export default function ChatPage() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your design assistant. What kind of design are you looking for today?",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [usingMockResponse, setUsingMockResponse] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Clear previous errors
    setError(null)

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          userId: user?.id || "anonymous",
          sessionId: "session-" + Date.now(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      // Check if using mock response
      if (data.usingMockResponse) {
        setUsingMockResponse(true)
      }

      // Add assistant response to chat
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
      }
      setMessages((prev) => [...prev, assistantMessage])

      // Set templates if any
      if (data.templates && Array.isArray(data.templates) && data.templates.length > 0) {
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error("Error sending message:", error)

      // Set error message
      const errorMessage = error instanceof Error ? error.message : "Failed to send message. Please try again."

      setError(errorMessage)

      // Add error message as assistant response
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error: " + errorMessage,
      }
      setMessages((prev) => [...prev, errorResponse])

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-[70vh] flex flex-col">
            <CardContent className="flex-1 overflow-y-auto p-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {usingMockResponse && (
                <Alert className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Demo mode: Using mock responses as no valid OpenAI API key is available.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4 py-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe the design you need..."
                  className="flex-1 resize-none"
                  rows={2}
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
        <div>
          <TemplateRecommendations templates={templates} />
        </div>
      </div>
    </div>
  )
}
