// This is a mock database implementation
// In a real application, you would use a real database like MongoDB, PostgreSQL, etc.

import type { Session } from "@/lib/auth/session-manager"
import { randomBytes } from "crypto"

// In-memory storage for development
const storage = {
  sessions: new Map<string, any>(),
  templates: new Map<string, any>(),
  users: new Map<string, any>(),
  history: new Map<string, any[]>(),
}

// Mock templates data
const mockTemplates = [
  { id: "1", name: "Business Card", category: "business", tags: ["card", "business", "contact"] },
  { id: "2", name: "Wedding Invitation", category: "invitation", tags: ["wedding", "invitation", "card"] },
  { id: "3", name: "Instagram Post", category: "social", tags: ["instagram", "social", "post"] },
  { id: "4", name: "Resume Template", category: "professional", tags: ["resume", "cv", "job"] },
  { id: "5", name: "Flyer Design", category: "marketing", tags: ["flyer", "marketing", "promotion"] },
  { id: "6", name: "Facebook Cover", category: "social", tags: ["facebook", "social", "cover"] },
  { id: "7", name: "Twitter Post", category: "social", tags: ["twitter", "social", "post"] },
  { id: "8", name: "YouTube Thumbnail", category: "social", tags: ["youtube", "thumbnail", "video"] },
  { id: "9", name: "Brochure Design", category: "marketing", tags: ["brochure", "marketing", "print"] },
  { id: "10", name: "Logo Template", category: "business", tags: ["logo", "brand", "identity"] },
]

// Mock database implementation
export const db = {
  // Sessions
  sessions: {
    create: async (session: Session) => {
      storage.sessions.set(session.token, session)
      return session
    },
    findByToken: async (token: string) => {
      return storage.sessions.get(token) || null
    },
    deleteByToken: async (token: string) => {
      storage.sessions.delete(token)
    },
  },

  // Users
  users: {
    create: async (userData: any) => {
      const id = randomBytes(16).toString("hex")
      const user = { id, ...userData, createdAt: new Date() }
      storage.users.set(id, user)
      storage.users.set(userData.email, user) // For email lookup
      return user
    },
    findById: async (id: string) => {
      return storage.users.get(id) || null
    },
    findByEmail: async (email: string) => {
      return storage.users.get(email) || null
    },
  },

  // Templates
  templates: {
    search: async (keywords: string[], options: any = {}) => {
      // Filter templates based on keywords
      let filtered = [...mockTemplates]

      if (keywords.length > 0) {
        filtered = mockTemplates.filter((template) => {
          return keywords.some(
            (keyword) =>
              template.name.toLowerCase().includes(keyword.toLowerCase()) ||
              template.category.toLowerCase().includes(keyword.toLowerCase()) ||
              template.tags.some((tag) => tag.toLowerCase().includes(keyword.toLowerCase())),
          )
        })
      }

      // Filter by category if provided
      if (options.category) {
        filtered = filtered.filter((template) => template.category === options.category)
      }

      // Apply pagination
      const page = options.page || 1
      const limit = options.limit || 20
      const start = (page - 1) * limit
      const end = start + limit

      return {
        templates: filtered.slice(start, end),
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      }
    },
    findById: async (id: string) => {
      return mockTemplates.find((template) => template.id === id) || null
    },
  },

  // History
  history: {
    save: async (historyItem: any) => {
      const userHistory = storage.history.get(historyItem.userId) || []
      userHistory.push({
        id: randomBytes(16).toString("hex"),
        ...historyItem,
        timestamp: new Date(),
      })
      storage.history.set(historyItem.userId, userHistory)
    },
    getByUserId: async (userId: string, options: any = {}) => {
      const userHistory = storage.history.get(userId) || []

      // Apply pagination
      const page = options.page || 1
      const limit = options.limit || 20
      const start = (page - 1) * limit
      const end = start + limit

      return {
        history: userHistory.slice(start, end).reverse(), // Most recent first
        total: userHistory.length,
        page,
        limit,
        totalPages: Math.ceil(userHistory.length / limit),
      }
    },
    deleteById: async (historyId: string, userId: string) => {
      const userHistory = storage.history.get(userId) || []
      const index = userHistory.findIndex((item) => item.id === historyId)

      if (index === -1) {
        return { success: false, message: "History item not found" }
      }

      userHistory.splice(index, 1)
      storage.history.set(userId, userHistory)

      return { success: true }
    },
  },
}
