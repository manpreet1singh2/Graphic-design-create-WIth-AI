import { db } from "@/lib/db"

interface HistoryItem {
  userId: string
  sessionId?: string
  query: string
  response: string
  templates?: any[]
}

interface HistoryOptions {
  page?: number
  limit?: number
}

/**
 * Saves a user interaction to history
 */
export async function saveToHistory(historyItem: HistoryItem) {
  try {
    await db.history.save(historyItem)
  } catch (error) {
    console.error("Error saving to history:", error)
    // Don't throw error to prevent affecting the main flow
  }
}

/**
 * Gets user history
 */
export async function getUserHistory(userId: string, options: HistoryOptions = {}) {
  try {
    return await db.history.getByUserId(userId, options)
  } catch (error) {
    console.error("Error getting user history:", error)
    throw new Error("Failed to get user history")
  }
}

/**
 * Deletes a history item
 */
export async function deleteHistoryItem(historyId: string, userId: string) {
  try {
    return await db.history.deleteById(historyId, userId)
  } catch (error) {
    console.error("Error deleting history item:", error)
    throw new Error("Failed to delete history item")
  }
}
