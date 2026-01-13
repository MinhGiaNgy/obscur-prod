'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Eye, ArrowLeft, Edit } from 'lucide-react'
import CommentSection from '@/components/blog/CommentSection'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  tags: string[]
  viewCount: number
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  const fetchPost = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/blog/${slug}`)

      if (!response.ok) {
        if (response.status === 404) {
          setError('Blog post not found')
        } else if (response.status === 403) {
          setError('This blog post is not published yet')
        } else {
          setError('Failed to load blog post')
        }
        return
      }

      const data = await response.json()
      setPost(data)
    } catch (err) {
      console.error('Error fetching post:', err)
      setError('Failed to load blog post')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container max-w-4xl mx-auto py-12 px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <Card className="bg-zinc-900/50 border-purple-800/30">
            <CardContent className="py-12 text-center">
              <p className="text-red-400 text-lg mb-4">{error || 'Post not found'}</p>
              <Link
                href="/blog"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                Return to blog listing
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container max-w-4xl mx-auto py-12 px-6">
        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Article */}
        <article>
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              {post.title}
            </h1>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 mb-6">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.viewCount} views
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map(tag => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="bg-purple-900/20 border-purple-800/30 text-purple-400"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Admin edit button */}
            <Link
              href={`/admin/blog/${post.slug}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-800/30 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Post (Admin)
            </Link>
          </header>

          {/* Content */}
          <Card className="bg-zinc-900/30 border-purple-800/20">
            <CardContent className="py-8 px-8">
              <div
                className="prose prose-invert prose-purple max-w-none
                  prose-headings:text-purple-400 prose-headings:font-bold
                  prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                  prose-p:text-zinc-300 prose-p:leading-relaxed
                  prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white prose-strong:font-semibold
                  prose-code:text-pink-400 prose-code:bg-zinc-800/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-zinc-800/50 prose-pre:border prose-pre:border-purple-800/30
                  prose-blockquote:border-l-purple-500 prose-blockquote:text-zinc-400
                  prose-ul:text-zinc-300 prose-ol:text-zinc-300
                  prose-li:text-zinc-300"
                dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
              />
            </CardContent>
          </Card>

          {/* Footer */}
          <footer className="mt-8 pt-8 border-t border-purple-800/30">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">
                Last updated: {formatDate(post.updatedAt)}
              </p>
              <Link
                href="/blog"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                View all posts →
              </Link>
            </div>
          </footer>
        </article>

        {/* Comments Section */}
        <CommentSection slug={slug} />
      </div>
    </div>
  )
}

// Simple markdown-like formatting
function formatContent(content: string): string {
  // Convert markdown-like syntax to HTML
  let formatted = content
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code inline
    .replace(/`(.*?)`/g, '<code>$1</code>')
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')

  // Wrap in paragraph if not already wrapped
  if (!formatted.startsWith('<')) {
    formatted = '<p>' + formatted + '</p>'
  }

  return formatted
}
