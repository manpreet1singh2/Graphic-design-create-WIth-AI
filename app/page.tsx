"use client"

import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Trash2 } from "lucide-react"
import { useEffect, useRef } from "react"

export default function PersonalAIBot() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, reload, stop, setMessages } = useChat()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const clearChat = () => {
    setMessages([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="h-[90vh] flex flex-col">
          <CardHeader className="border-b bg-white/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Personal AI Assistant</CardTitle>
                  <p className="text-sm text-muted-foreground">Powered by Grok</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
                disabled={messages.length === 0}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Clear Chat
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                    <Bot className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Welcome to your Personal AI Assistant!</h3>
                    <p className="text-muted-foreground max-w-md">
                      I'm powered by Grok and ready to help you with anything you need. Ask me questions, get help with
                      tasks, or just have a conversation!
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 w-full max-w-2xl">
                    <Button
                      variant="outline"
                      className="p-4 h-auto text-left justify-start"
                      onClick={() =>
                        handleSubmit({ preventDefault: () => {} } as any, { data: { message: "Help me plan my day" } })
                      }
                    >
                      <div>
                        <div className="font-medium">Plan My Day</div>
                        <div className="text-sm text-muted-foreground">Get help organizing your schedule</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="p-4 h-auto text-left justify-start"
                      onClick={() =>
                        handleSubmit({ preventDefault: () => {} } as any, {
                          data: { message: "Explain a complex topic simply" },
                        })
                      }
                    >
                      <div>
                        <div className="font-medium">Explain Complex Topics</div>
                        <div className="text-sm text-muted-foreground">Break down difficult concepts</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="p-4 h-auto text-left justify-start"
                      onClick={() =>
                        handleSubmit({ preventDefault: () => {} } as any, {
                          data: { message: "Help me write an email" },
                        })
                      }
                    >
                      <div>
                        <div className="font-medium">Write Content</div>
                        <div className="text-sm text-muted-foreground">Draft emails, messages, or documents</div>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="p-4 h-auto text-left justify-start"
                      onClick={() =>
                        handleSubmit({ preventDefault: () => {} } as any, {
                          data: { message: "Give me creative ideas" },
                        })
                      }
                    >
                      <div>
                        <div className="font-medium">Creative Ideas</div>
                        <div className="text-sm text-muted-foreground">Brainstorm and innovate together</div>
                      </div>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500">
                          <AvatarFallback>
                            <Bot className="h-4 w-4 text-white" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === "user" ? "bg-blue-500 text-white ml-auto" : "bg-white border shadow-sm"
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      </div>
                      {message.role === "user" && (
                        <Avatar className="h-8 w-8 bg-blue-500">
                          <AvatarFallback>
                            <User className="h-4 w-4 text-white" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500">
                        <AvatarFallback>
                          <Bot className="h-4 w-4 text-white" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white border shadow-sm rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            <div className="border-t p-4 bg-white/50 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
                {isLoading && (
                  <Button type="button" onClick={stop} variant="outline" size="icon">
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  </Button>
                )}
              </form>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Powered by Grok • Your personal AI assistant
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
