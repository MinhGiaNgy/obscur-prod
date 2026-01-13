'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit,
  Search,
  Filter,
  LogOut,
  Calendar,
  X,
} from 'lucide-react'

interface Todo {
  id: string
  title: string
  description: string | null
  completed: boolean
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

interface User {
  id: string
  email: string
  name: string | null
}

export default function NotesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all')
  const [filterPriority, setFilterPriority] = useState<string>('')

  const [isCreating, setIsCreating] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPriority, setNewPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM')
  const [newDueDate, setNewDueDate] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user) {
      fetchTodos()
    }
  }, [user, searchQuery, filterStatus, filterPriority])

  const checkAuth = () => {
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')

    if (token && userData) {
      setUser(JSON.parse(userData))
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setAuthLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name: isLogin ? undefined : name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed')
      }

      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_data', JSON.stringify(data.user))
      setUser(data.user)
      setEmail('')
      setPassword('')
      setName('')
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setUser(null)
    setTodos([])
  }

  const fetchTodos = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      const params = new URLSearchParams()

      if (searchQuery) params.append('search', searchQuery)
      if (filterStatus !== 'all') {
        params.append('completed', (filterStatus === 'completed').toString())
      }
      if (filterPriority) params.append('priority', filterPriority)

      const response = await fetch(`/api/todos?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout()
          return
        }
        throw new Error('Failed to fetch todos')
      }

      const data = await response.json()
      setTodos(data.todos)
    } catch (err) {
      console.error('Error fetching todos:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('auth_token')
      const isEditing = !!editingTodo

      const response = await fetch(
        isEditing ? `/api/todos/${editingTodo.id}` : '/api/todos',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: newTitle,
            description: newDescription || null,
            priority: newPriority,
            dueDate: newDueDate || null,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to save todo')
      }

      setNewTitle('')
      setNewDescription('')
      setNewPriority('MEDIUM')
      setNewDueDate('')
      setIsCreating(false)
      setEditingTodo(null)
      fetchTodos()
    } catch (err) {
      console.error('Error saving todo:', err)
      alert('Failed to save todo')
    }
  }

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update todo')
      }

      fetchTodos()
    } catch (err) {
      console.error('Error toggling todo:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this todo?')) {
      return
    }

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete todo')
      }

      fetchTodos()
    } catch (err) {
      console.error('Error deleting todo:', err)
      alert('Failed to delete todo')
    }
  }

  const startEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setNewTitle(todo.title)
    setNewDescription(todo.description || '')
    setNewPriority(todo.priority)
    setNewDueDate(todo.dueDate ? todo.dueDate.split('T')[0] : '')
    setIsCreating(true)
  }

  const cancelEdit = () => {
    setIsCreating(false)
    setEditingTodo(null)
    setNewTitle('')
    setNewDescription('')
    setNewPriority('MEDIUM')
    setNewDueDate('')
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-600 text-white'
      case 'HIGH':
        return 'bg-orange-600 text-white'
      case 'MEDIUM':
        return 'bg-yellow-600 text-white'
      case 'LOW':
        return 'bg-green-600 text-white'
      default:
        return 'bg-zinc-600 text-white'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <Card className="bg-zinc-900/50 border-purple-800/30 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              {isLogin ? 'Login to Your Todos' : 'Create an Account'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Name (Optional)
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="bg-zinc-800/50 border-purple-800/30 text-white placeholder:text-zinc-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="bg-zinc-800/50 border-purple-800/30 text-white placeholder:text-zinc-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="bg-zinc-800/50 border-purple-800/30 text-white placeholder:text-zinc-500"
                />
                {!isLogin && (
                  <p className="text-xs text-zinc-500 mt-1">
                    Minimum 6 characters
                  </p>
                )}
              </div>

              {authError && (
                <p className="text-red-400 text-sm">{authError}</p>
              )}

              <Button
                type="submit"
                disabled={authLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {authLoading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
              </Button>

              <p className="text-center text-sm text-zinc-400">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setAuthError('')
                  }}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-4xl font-bold mb-6">Notes</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        work in progress 
      </p>
    </div>
  )
}
