import type { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { validateSession } from "./session-manager"

export interface AuthResult {
  authenticated: boolean
  userId?: string
  sessionId?: string
}

/**
 * Authenticates a request using the session token cookie
 */
export async function authenticateRequest(req: NextRequest): Promise<AuthResult> {
  const sessionToken = cookies().get("session_token")?.value

  if (!sessionToken) {
    return { authenticated: false }
  }

  const session = await validateSession(sessionToken)

  if (!session) {
    return { authenticated: false }
  }

  return {
    authenticated: true,
    userId: session.userId,
    sessionId: session.id,
  }
}

/**
 * Validates API key for service-to-service authentication
 */
export function validateApiKey(apiKey: string): boolean {
  const validApiKey = process.env.API_KEY
  return apiKey === validApiKey
}
