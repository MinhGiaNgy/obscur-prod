import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all comments for a blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Get the blog post first
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Get all comments for this post
    const comments = await prisma.comment.findMany({
      where: { blogPostId: post.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { name, content } = body

    // Validation
    if (!name || !content) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      )
    }

    // Validate name length
    if (name.trim().length === 0 || name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 1 and 100 characters' },
        { status: 400 }
      )
    }

    // Validate content length (300 words max)
    const wordCount = content.trim().split(/\s+/).length
    if (wordCount > 300) {
      return NextResponse.json(
        { error: 'Comment must not exceed 300 words' },
        { status: 400 }
      )
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content cannot be empty' },
        { status: 400 }
      )
    }

    // Get the blog post
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true, published: true },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    if (!post.published) {
      return NextResponse.json(
        { error: 'Cannot comment on unpublished posts' },
        { status: 403 }
      )
    }

    // Create the comment
    // Prisma automatically prevents SQL injection through parameterized queries
    const comment = await prisma.comment.create({
      data: {
        name: name.trim(),
        content: content.trim(),
        blogPostId: post.id,
      },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
