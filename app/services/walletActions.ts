// /app/services/walletActions.ts

'use server'

import connectDB from '@/app/lib/db'
import { CourseModel } from '@/app/models/Course'
import { TransactionModel } from '@/app/models/Transaction'
import { Types } from 'mongoose'
import { Course } from '@/app/types'
import { IDbTransaction } from '@/app/types/transaction'

export interface SerializedMarketplaceItem {
  _id: string
  title: string
  price: number
  tag: string
  instructor: string
}

export interface SerializedTransactionHistory {
  reference: string
  date: string
  courseTitle: string
  amount: number
}

export async function getWalletDashboardData(userId: string) {
  try {
    await connectDB()

    // 1. Fetch available Premium courses
    const premiumCourses = await CourseModel.find(
      { type: 'Premium', isPublished: true },
      'title price tag instructor',
    ).lean<Pick<Course, '_id' | 'title' | 'price' | 'tag' | 'instructor'>[]>()

    const marketplaceItems: SerializedMarketplaceItem[] = premiumCourses.map(
      (course) => ({
        _id: course._id.toString(),
        title: course.title,
        price: Number(course.price), // Keep as whole Naira standard format
        tag: course.tag?.toString() || 'Premium',
        instructor: course.instructor,
      }),
    )

    // 2. Fetch transaction history items
    const userObjectId = new Types.ObjectId(userId)
    const transactions = await TransactionModel.find({
      userId: userObjectId,
      status: 'SUCCESS',
    })
      .sort({ createdAt: -1 })
      .lean<IDbTransaction[]>()

    const historyItems: SerializedTransactionHistory[] = transactions.map(
      (tx) => {
        const combinedTitles = tx.items.map((i) => i.title).join(', ')

        // Normalize gateway comparison string formatting
        const targetGateway = (tx.gateway || 'PAYSTACK').toUpperCase()
        const isSubunitGateway =
          targetGateway === 'PAYSTACK' || targetGateway === 'STRIPE'

        const rawAmount = Number(tx.total)
        const normalizedAmount = isSubunitGateway ? rawAmount / 100 : rawAmount

        return {
          reference: tx.reference,
          date: new Date(tx.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          courseTitle: combinedTitles || 'System Workspace Upgrade',
          amount: normalizedAmount, // Safely normalized to full standard real amount decimal position
        }
      },
    )

    return {
      success: true,
      marketplaceItems,
      historyItems,
    }
  } catch (error) {
    console.error('Wallet data synchronization error:', error)
    return {
      success: false,
      marketplaceItems: [],
      historyItems: [],
    }
  }
}