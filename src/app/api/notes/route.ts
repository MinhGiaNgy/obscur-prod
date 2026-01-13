import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { ApiResponse, CreateNoteInput } from '@/types'
import type { Note } from '@prisma/client'

// GET /api/notes - Get all notes
export async function GET() {
  try {
    // TODO: Add user authentication and filter by userId
    const notes = await prisma.note.findMany({
      orderBy: [
        { pinned: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json<ApiResponse<Note[]>>({
      data: notes
    })
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json<ApiResponse<Note[]>>(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
  try {
    const body: CreateNoteInput = await request.json()

    // TODO: Add user authentication
    const userId = 'temp-user-id' // Replace with actual user ID from auth

    const note = await prisma.note.create({
      data: {
        title: body.title,
        content: body.content,
        tags: body.tags || [],
        pinned: body.pinned || false,
        userId
      }
    })

    return NextResponse.json<ApiResponse<Note>>(
      { data: note, message: 'Note created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json<ApiResponse<Note>>(
      { error: 'Failed to create note' },
      { status: 500 }
    )
  }
}
