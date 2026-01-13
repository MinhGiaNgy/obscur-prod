'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MessageCircle, User, Calendar, Trash2 } from 'lucide-react'

interface Comment {
  id: string
  name: string
  content: string
  createdAt: string
}

interface CommentSectionProps {
  slug: string
}

export default function CommentSection({ slug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [rememberName, setRememberName] = useState(false)
  const [error, setError] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Load saved name from localStorage
    const savedName = localStorage.getItem('commenter_name')
    if (savedName) {
      setName(savedName)
      setRememberName(true)
    }

    // Check if user is admin
    const token = sessionStorage.getItem('admin_token')
    setIsAdmin(!!token)

    fetchComments()
  }, [slug])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/blog/${slug}/comments`)
      const data = await response.json()
      setComments(data.comments || [])
    } catch (err) {
      console.error('Error fetching comments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!name.trim() || !content.trim()) {
      setError('Name and comment are required')
      return
    }

    const wordCount = content.trim().split(/\s+/).length
    if (wordCount > 300) {
      setError('Comment must not exceed 300 words')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`/api/blog/${slug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          content: content.trim(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to post comment')
      }

      const newComment = await response.json()

      // Save name to localStorage if "remember me" is checked
      if (rememberName) {
        localStorage.setItem('commenter_name', name.trim())
      } else {
        localStorage.removeItem('commenter_name')
      }

      // Add new comment to the list
      setComments([newComment, ...comments])

      // Clear form
      setContent('')
      setError('')
    } catch (err: any) {
      setError(err.message || 'Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getWordCount = () => {
    return content.trim().split(/\s+/).filter(Boolean).length
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return
    }

    try {
      const token = sessionStorage.getItem('admin_token')
      const response = await fetch(`/api/blog/${slug}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete comment')
      }

      // Remove comment from the list
      setComments(comments.filter(c => c.id !== commentId))
    } catch (err: any) {
      alert(err.message || 'Failed to delete comment')
    }
  }

  return (
    <div className="mt-12 space-y-6">
      {/* Comment Form */}
      <Card className="bg-zinc-900/50 border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-purple-400" />
            Leave a Comment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                maxLength={100}
                className="bg-zinc-800/50 border-purple-800/30 text-white placeholder:text-zinc-500"
              />
            </div>

            {/* Remember Name Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember-name"
                checked={rememberName}
                onChange={(e) => setRememberName(e.target.checked)}
                className="w-4 h-4 rounded border-purple-800/30 bg-zinc-800/50 checked:bg-purple-600"
              />
              <label htmlFor="remember-name" className="text-sm text-zinc-400 cursor-pointer">
                Remember my name for next time
              </label>
            </div>

            {/* Comment Field */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Comment ({getWordCount()}/300 words)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full bg-zinc-800/50 border border-purple-800/30 text-white placeholder:text-zinc-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <Card className="bg-zinc-900/50 border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-xl text-white">
            Comments ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : comments.length === 0 ? (
            <p className="text-zinc-400 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border-b border-purple-800/20 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-900/30 rounded-full shrink-0">
                      <User className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            {comment.name}
                          </span>
                          <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                            title="Delete comment (Admin)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-zinc-300 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
