// /app/services/receiptActions.ts

'use server'

import connectDB from '@/app/lib/db'
import { TransactionModel } from '@/app/models/Transaction'

export async function getReceiptDetailsByReference(
  reference: string,
  userId: string,
) {
  try {
    await connectDB()

    const transaction = await TransactionModel.findOne({
      reference,
      userId,
    }).lean()

    if (!transaction) {
      return { success: false, data: null }
    }

    return {
      success: true,
      data: {
        gateway: transaction.gateway,
        cardDetails: transaction.paymentDetails,
        items: transaction.items.map((item) => ({
          _id: item.courseId.toString(),
          title: item.title,
          price: item.price,
        })),
        subtotal: transaction.subtotal,
        tax: transaction.tax,
        total: transaction.total,
        date: new Date(transaction.createdAt).toLocaleDateString('en-NG', {
          dateStyle: 'long',
        }),
      },
    }
  } catch (error) {
    console.error('Receipt compilation error:', error)
    return { success: false, data: null }
  }
}