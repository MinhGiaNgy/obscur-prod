import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE a comment (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; commentId: string }> }
) {
  try {
    const { commentId } = await params

    // Verify admin authentication
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    const decoded = Buffer.from(token, 'base64').toString()

    if (!decoded.startsWith(adminPassword)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: commentId },
    })

    return NextResponse.json({ message: 'Comment deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting comment:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
