//  /app/types/transaction.ts

import { Types } from 'mongoose'

export interface ITransactionItem {
  courseId: Types.ObjectId
  title: string
  price: number
}

export interface IDbTransaction {
  _id: Types.ObjectId
  userId: Types.ObjectId
  reference: string
  gateway: 'PAYSTACK' | 'WALLET' | 'STRIPE'
  items: ITransactionItem[]
  subtotal: number
  tax: number
  total: number
  currency: string
  status: 'PENDING' | 'SUCCESS' | 'FAILED'
  paymentDetails?: {
    cardType?: string
    last4?: string
    bank?: string
  }
  createdAt: Date
  updatedAt: Date
}