import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface Template {
  id: string
  name: string
  category: string
  tags: string[]
}

interface TemplateRecommendationsProps {
  templates: Template[]
}

export default function TemplateRecommendations({ templates }: TemplateRecommendationsProps) {
  if (!templates || templates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Template Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Describe your design needs to get personalized template recommendations.
          </p>
          <Link href="/templates">
            <Button variant="outline" className="w-full">
              Browse All Templates
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Templates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {templates.map((template) => (
          <div key={template.id} className="border rounded-lg p-3">
            <h3 className="font-medium mb-2">{template.name}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary">{template.category}</Badge>
              {template.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex justify-between">
              <Link href={`/templates/${template.id}`}>
                <Button variant="outline" size="sm">
                  Preview
                </Button>
              </Link>
              <Button size="sm">Use Template</Button>
            </div>
          </div>
        ))}
        <Link href="/templates">
          <Button variant="outline" className="w-full mt-2">
            View More Templates
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
