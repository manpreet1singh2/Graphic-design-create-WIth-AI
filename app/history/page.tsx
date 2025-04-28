"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface HistoryItem {
  id: string
  query: string
  response: string
  templates?: any[]
  timestamp: string
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory()
    }
  }, [isAuthenticated])

  const fetchHistory = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/history")
      if (!response.ok) {
        throw new Error("Failed to fetch history")
      }
      const data = await response.json()
      setHistory(data.history || [])
    } catch (error) {
      console.error("Error fetching history:", error)
      toast({
        title: "Error",
        description: "Failed to load history. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteHistoryItem = async (id: string) => {
    try {
      const response = await fetch("/api/history", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ historyId: id }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete history item")
      }

      setHistory((prev) => prev.filter((item) => item.id !== id))
      toast({
        title: "Success",
        description: "History item deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting history item:", error)
      toast({
        title: "Error",
        description: "Failed to delete history item. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">History</h1>
        <p className="mb-6">Please log in to view your history.</p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Design History</h1>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : history.length > 0 ? (
        <div className="grid gap-6">
          {history.map((item) => (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <CardTitle className="text-xl">{item.query}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteHistoryItem(item.id)}
                  aria-label="Delete history item"
                >
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-sm mb-2">
                  {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                </p>
                <p className="mb-4">{item.response}</p>
                {item.templates && item.templates.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Recommended Templates:</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.templates.map((template) => (
                        <Link href={`/templates/${template.id}`} key={template.id}>
                          <Button variant="outline" size="sm">
                            {template.name}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">You don't have any design history yet.</p>
          <Link href="/chat">
            <Button>Start Designing</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
