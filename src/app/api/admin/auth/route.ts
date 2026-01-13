import { NextRequest, NextResponse } from 'next/server'

// Simple password-based admin authentication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    // Get admin password from environment variable
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (password === adminPassword) {
      // Generate a simple auth token (in production, use JWT or session)
      const token = Buffer.from(`${adminPassword}:${Date.now()}`).toString('base64')

      return NextResponse.json({
        success: true,
        token
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid password' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Error in admin auth:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

// Verify auth token
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    // Decode and verify token
    const decoded = Buffer.from(token, 'base64').toString()
    if (decoded.startsWith(adminPassword)) {
      return NextResponse.json({ authenticated: true })
    }

    return NextResponse.json({ authenticated: false }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
