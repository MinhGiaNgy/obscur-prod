'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Calendar, Eye, Tag, Pin } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  tags: string[]
  viewCount: number
  pinned: boolean
  publishedAt: string | null
  createdAt: string
}

interface BlogResponse {
  posts: BlogPost[]
  total: number
  limit: number
  offset: number
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
    fetchFeaturedPosts()
  }, [searchQuery, selectedTags])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','))
      params.append('limit', '20')

      const response = await fetch(`/api/blog?${params.toString()}`)
      if (!response.ok) {
        console.error('API error:', response.status)
        setPosts([])
        setAvailableTags([])
        return
      }
      const data: BlogResponse = await response.json()
      setPosts(data.posts || [])

      // Extract all unique tags
      const tags = new Set<string>()
      if (data.posts) {
        data.posts.forEach(post => post.tags.forEach(tag => tags.add(tag)))
      }
      setAvailableTags(Array.from(tags).sort())
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([])
      setAvailableTags([])
    } finally {
      setLoading(false)
    }
  }

  const fetchFeaturedPosts = async () => {
    try {
      const response = await fetch('/api/blog?limit=3')
      if (!response.ok) {
        console.error('API error:', response.status)
        setFeaturedPosts([])
        return
      }
      const data: BlogResponse = await response.json()
      if (data.posts) {
        // Shuffle and take first 3 for "random" effect
        const shuffled = [...data.posts].sort(() => Math.random() - 0.5)
        setFeaturedPosts(shuffled.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching featured posts:', error)
      setFeaturedPosts([])
    }
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container max-w-6xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-zinc-400 text-lg">
            Thoughts on algorithms, math tricks, and software engineering
          </p>
        </div>

        {/* Featured Posts */}
        {!searchQuery && !selectedTags.length && featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-purple-400">Featured Posts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredPosts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="bg-purple-900/20 border-purple-800/30 hover:bg-purple-900/30 transition-all hover:scale-105 cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="text-lg text-white line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-zinc-400 text-sm line-clamp-3 mb-4">
                        {post.excerpt || 'No excerpt available'}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-zinc-900/50 border-purple-800/30 text-white placeholder:text-zinc-500 h-14 text-lg"
            />
          </div>
        </div>

        {/* Tag Filters */}
        {availableTags.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-purple-400">Filter by Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    selectedTags.includes(tag)
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-transparent border-purple-800/30 text-purple-400 hover:bg-purple-900/20'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Blog Posts List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : posts.length === 0 ? (
            <Card className="bg-zinc-900/50 border-purple-800/30">
              <CardContent className="py-12 text-center">
                <p className="text-zinc-400">
                  {searchQuery || selectedTags.length > 0
                    ? 'No posts found matching your search.'
                    : 'No blog posts available yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="bg-zinc-900/50 border-purple-800/30 hover:bg-zinc-900/70 transition-all hover:border-purple-700/50 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-2xl text-white hover:text-purple-400 transition-colors flex items-center gap-2">
                        {post.pinned && (
                          <Pin className="w-5 h-5 text-purple-400 fill-purple-400" />
                        )}
                        {post.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-zinc-500 shrink-0">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.viewCount}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-400 mb-4 line-clamp-2">
                      {post.excerpt || 'No excerpt available'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
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
                      <span className="text-sm text-zinc-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* Admin Link */}
        <div className="mt-12 text-center">
          <Link
            href="/admin/blog/new"
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Create New Post (Admin)
          </Link>
        </div>
      </div>
    </div>
  )
}
