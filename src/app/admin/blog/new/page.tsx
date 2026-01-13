'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Eye, X } from 'lucide-react'
import AdminAuth from '@/components/admin/AdminAuth'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          excerpt: excerpt || null,
          tags,
          published,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create blog post')
      }

      const post = await response.json()
      router.push(`/blog/${post.slug}`)
    } catch (err: any) {
      console.error('Error creating post:', err)
      setError(err.message || 'Failed to create blog post')
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = () => {
    // Open preview in new tab with formatted content
    const previewWindow = window.open('', '_blank')
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title || 'Preview'}</title>
            <style>
              body {
                background: black;
                color: white;
                font-family: 'JetBrains Mono', monospace;
                max-width: 800px;
                margin: 0 auto;
                padding: 2rem;
              }
              h1 { color: #a855f7; }
              h2 { color: #c084fc; }
              h3 { color: #d8b4fe; }
              code {
                background: #27272a;
                padding: 0.2rem 0.4rem;
                border-radius: 0.25rem;
                color: #f472b6;
              }
              pre {
                background: #27272a;
                padding: 1rem;
                border-radius: 0.5rem;
                overflow-x: auto;
              }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            ${excerpt ? `<p style="color: #a1a1aa; font-style: italic;">${excerpt}</p>` : ''}
            <div>${content.replace(/\n/g, '<br>')}</div>
          </body>
        </html>
      `)
      previewWindow.document.close()
    }
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-black text-white">
      <div className="container max-w-5xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Create New Blog Post
          </h1>
        </div>

        {/* Error message */}
        {error && (
          <Card className="bg-red-900/20 border-red-800/30 mb-6">
            <CardContent className="py-4">
              <p className="text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Card className="bg-zinc-900/50 border-purple-800/30">
            <CardHeader>
              <CardTitle className="text-white">Title</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog post title..."
                required
                className="bg-zinc-800/50 border-purple-800/30 text-white placeholder:text-zinc-500"
              />
            </CardContent>
          </Card>

          {/* Excerpt */}
          <Card className="bg-zinc-900/50 border-purple-800/30">
            <CardHeader>
              <CardTitle className="text-white">Excerpt (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the post..."
                rows={3}
                className="w-full bg-zinc-800/50 border border-purple-800/30 text-white placeholder:text-zinc-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </CardContent>
          </Card>

          {/* Content */}
          <Card className="bg-zinc-900/50 border-purple-800/30">
            <CardHeader>
              <CardTitle className="text-white">Content</CardTitle>
              <p className="text-sm text-zinc-400 mt-2">
                Supports basic markdown: **bold**, *italic*, `code`, ```code blocks```, # headers, [links](url)
              </p>
            </CardHeader>
            <CardContent>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="write something please..."
                required
                rows={20}
                className="w-full bg-zinc-800/50 border border-purple-800/30 text-white placeholder:text-zinc-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="bg-zinc-900/50 border-purple-800/30">
            <CardHeader>
              <CardTitle className="text-white">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  placeholder="Add tags (e.g., Math, Graph, Algorithm)..."
                  className="bg-zinc-800/50 border-purple-800/30 text-white placeholder:text-zinc-500"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge
                    key={tag}
                    className="bg-purple-600 text-white pr-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:bg-purple-700 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Publish toggle */}
          <Card className="bg-zinc-900/50 border-purple-800/30">
            <CardContent className="py-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-5 h-5 rounded border-purple-800/30 bg-zinc-800/50 checked:bg-purple-600"
                />
                <span className="text-white font-semibold">Publish immediately</span>
              </label>
              <p className="text-sm text-zinc-400 mt-2 ml-8">
                {published
                  ? 'This post will be visible to everyone'
                  : 'This post will be saved as a draft'}
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : published ? 'Publish Post' : 'Save Draft'}
            </Button>
            <Button
              type="button"
              onClick={handlePreview}
              variant="outline"
              className="border-purple-800/30 text-purple-400 hover:bg-purple-900/20 px-6 py-3 flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
          </div>
        </form>
      </div>
    </div>
    </AdminAuth>
  )
}
