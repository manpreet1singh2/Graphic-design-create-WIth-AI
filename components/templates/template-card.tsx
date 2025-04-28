import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface TemplateCardProps {
  template: {
    id: string
    name: string
    category: string
    tags: string[]
  }
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-muted relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={`/placeholder.svg?height=200&width=300&text=${encodeURIComponent(template.name)}`}
            alt={template.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="secondary">{template.category}</Badge>
          {template.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link href={`/templates/${template.id}`}>
          <Button variant="outline" size="sm">
            Preview
          </Button>
        </Link>
        <Button size="sm">Use Template</Button>
      </CardFooter>
    </Card>
  )
}
