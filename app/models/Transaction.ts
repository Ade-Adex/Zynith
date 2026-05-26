//  /app/models/Transaction.ts

import mongoose, { Schema, Document, Model } from 'mongoose'
import { IDbTransaction, ITransactionItem } from '@/app/types/transaction'

export interface ITransaction extends Omit<IDbTransaction, '_id'>, Document {}

const TransactionItemSchema = new Schema<ITransactionItem>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
})

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reference: { type: String, required: true, unique: true, index: true },
    gateway: {
      type: String,
      enum: ['PAYSTACK', 'WALLET', 'STRIPE'],
      required: true,
    },
    items: [TransactionItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    currency: { type: String, default: 'NGN' },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      default: 'PENDING',
    },
    paymentDetails: {
      cardType: { type: String },
      last4: { type: String },
      bank: { type: String },
    },
  },
  { timestamps: true },
)

export const TransactionModel: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>('Transaction', TransactionSchema)