import { NextRequest } from 'next/server'

export function getUserIdFromToken(request: NextRequest): string | null {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = Buffer.from(token, 'base64').toString()
    const [userId] = decoded.split(':')

    return userId || null
  } catch (error) {
    return null
  }
}
