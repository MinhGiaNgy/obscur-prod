import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {
      published: true,
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (tags.length > 0) {
      where.tags = { hasSome: tags }
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          tags: true,
          viewCount: true,
          pinned: true,
          publishedAt: true,
          createdAt: true,
        },
        orderBy: [
          { pinned: 'desc' },
          { publishedAt: 'desc' },
        ],
        take: limit,
        skip: offset,
      }),
      prisma.blogPost.count({ where }),
    ])

    return NextResponse.json({
      posts,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, excerpt, tags, published } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const defaultEmail = process.env.DEFAULT_BLOG_USER_EMAIL ?? 'blog@yourapp.com'

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        tags: tags || [],
        published: published || false,
        publishedAt: published ? new Date() : null,
        user: {
          connectOrCreate: {
            where: { email: defaultEmail },
            create: {
              email: defaultEmail,
              name: 'Default User',
              password: '$2a$10$dummyhashedpasswordfordefaultadminuser'
            },
          },
        },
      },
    })


    return NextResponse.json(post, { status: 201 })
  } catch (error: any) {
    console.error('Error creating blog post:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
