import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        tags: true,
        viewCount: true,
        published: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    if (!post.published) {
      return NextResponse.json(
        { error: 'Blog post not published' },
        { status: 403 }
      )
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    })

    return NextResponse.json({ ...post, viewCount: post.viewCount + 1 })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    const body = await request.json()
    const { title, content, excerpt, tags, published, pinned } = body

    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Generate new slug if title changed
    let newSlug = slug
    if (title && title !== existingPost.title) {
      newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    const updateData: any = {}
    if (title) updateData.title = title
    if (title && newSlug !== slug) updateData.slug = newSlug
    if (content) updateData.content = content
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (tags) updateData.tags = tags
    if (published !== undefined) {
      updateData.published = published
      if (published && !existingPost.published) {
        updateData.publishedAt = new Date()
      }
    }
    if (pinned !== undefined) {
      updateData.pinned = pinned
    }

    const post = await prisma.blogPost.update({
      where: { slug },
      data: updateData,
    })

    return NextResponse.json(post)
  } catch (error: any) {
    console.error('Error updating blog post:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    await prisma.blogPost.delete({
      where: { slug },
    })

    return NextResponse.json({ message: 'Blog post deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting blog post:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}
