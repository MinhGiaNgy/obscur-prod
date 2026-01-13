// Type definitions for the application
export type { User, Note, Todo, BlogPost, Priority } from '@prisma/client'

// API response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Form types
export interface CreateNoteInput {
  title: string
  content: string
  tags?: string[]
  pinned?: boolean
}

export interface CreateTodoInput {
  title: string
  description?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: Date
}

export interface CreateBlogPostInput {
  title: string
  slug: string
  content: string
  excerpt?: string
  tags?: string[]
  published?: boolean
}
