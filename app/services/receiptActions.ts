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

    const isSubunitGateway =
      transaction.gateway === 'PAYSTACK' || transaction.gateway === 'STRIPE'

    // Explicitly trust the gateway mapping flag cleanly.
    const divisor = isSubunitGateway ? 100 : 1

    const subtotalNum = Number(transaction.subtotal) / divisor
    const taxNum = Number(transaction.tax) / divisor
    const totalNum = Number(transaction.total) / divisor

    return {
      success: true,
      data: {
        gateway: transaction.gateway,
        cardDetails: transaction.paymentDetails,
        items: transaction.items.map((item) => {
          const rawItemPrice = Number(item.price)
          return {
            _id: item.courseId.toString(),
            title: item.title,
            // Clean fix: No more complex ternary fallback rules.
            // If the gateway uses subunits, divide the item price uniformly.
            price: rawItemPrice / divisor,
          }
        }),
        subtotal: subtotalNum,
        tax: taxNum,
        total: totalNum,
        date: transaction.createdAt
          ? new Date(transaction.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
      },
    }
  } catch (error) {
    console.error('Error fetching operational database receipt:', error)
    return { success: false, data: null }
  }
}
