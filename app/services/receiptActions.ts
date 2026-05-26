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

    // Defensive check: If total contains a clean decimal point or is small,
    // it was saved as absolute units rather than subunits.
    const isSavedAsAbsoluteUnits =
      transaction.total < 1000 || !Number.isInteger(transaction.total)

    const divisor = isSubunitGateway && !isSavedAsAbsoluteUnits ? 100 : 1

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
          // Use item level fallback if individual item matches absolute state rules
          const itemDivisor =
            isSubunitGateway && rawItemPrice < 1000 ? 1 : divisor
          return {
            _id: item.courseId.toString(),
            title: item.title,
            price: rawItemPrice / itemDivisor,
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
