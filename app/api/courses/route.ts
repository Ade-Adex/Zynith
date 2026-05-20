// /app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/app/lib/db'
import { CourseModel } from '@/app/models/Course'
import { Course } from '@/app/types'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = (await req.json()) as Partial<Course>

    if (!body.title || !body.price || !body.modules) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid payload logic structure detected.',
        },
        { status: 400 },
      )
    }

    const courseDoc = new CourseModel(body)
    const storedItem = await courseDoc.save()

    return NextResponse.json(
      {
        success: true,
        message: 'Course recorded across standard API routing context.',
        data: storedItem as Course,
      },
      { status: 201 },
    )
  } catch (error: unknown) {
    console.error('API route exception handle:', error)
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Internal database write failure.'

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    await connectDB()
    const records = await CourseModel.find({}).sort({ createdAt: -1 })

    return NextResponse.json(
      {
        success: true,
        count: records.length,
        data: records as Course[],
      },
      { status: 200 },
    )
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to retrieve course records.'

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 },
    )
  }
}
