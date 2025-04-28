"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface TemplateFiltersProps {
  onCategoryChange: (category: string | null) => void
  selectedCategory: string | null
}

export default function TemplateFilters({ onCategoryChange, selectedCategory }: TemplateFiltersProps) {
  const categories = [
    { id: "business", name: "Business" },
    { id: "social", name: "Social Media" },
    { id: "marketing", name: "Marketing" },
    { id: "invitation", name: "Invitations" },
    { id: "professional", name: "Professional" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-3">Categories</h3>
          <div className="space-y-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => onCategoryChange(null)}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => onCategoryChange(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <Button variant="outline" className="w-full" onClick={() => onCategoryChange(null)}>
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
