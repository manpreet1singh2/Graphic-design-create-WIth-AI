import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: {
    role: "user" | "assistant"
    content: string
  }
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-4 p-4 rounded-lg", isUser ? "bg-muted/50" : "bg-background")}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={isUser ? "/placeholder.svg?height=32&width=32" : "/placeholder.svg?height=32&width=32"} />
        <AvatarFallback>{isUser ? "U" : "AI"}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium">{isUser ? "You" : "Design Assistant"}</p>
        <div className="prose prose-sm dark:prose-invert">
          <p>{message.content}</p>
        </div>
      </div>
    </div>
  )
}
