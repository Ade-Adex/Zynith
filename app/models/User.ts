// /app/models/User.ts

import mongoose, { Schema, Document, Model } from 'mongoose'
import { UserRole } from '@/app/types/user'

export interface IUser extends Document {
  name: string
  firstName: string
  lastName: string
  email: string
  username: string
  avatar: string
  role: UserRole
  joinedAt: string
  wallet: {
    balance: number
    currency: string
  }
  stats: {
    coursesCompleted: number
    certificatesEarned: number
    peerReviewsDone: number
    averagePeerRating: number
    points: number
    streakDays: number
  }
  authMetadata?: {
    verificationToken: string
    tokenExpiresAt: Date
  }

  createdAt: Date
  updatedAt: Date
}

// const UserSchema = new Schema<IUser>({
//   name: { type: String, required: true },
//   firstName: { type: String, default: '' },
//   lastName: { type: String, default: '' },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true,
//   },
//   username: { type: String, required: true, unique: true, lowercase: true },
//   avatar: { type: String, required: true },
//   role: {
//     type: String,
//     enum: ['STUDENT', 'MENTOR', 'ADMIN', ''],
//     default: 'STUDENT',
//   },
//   joinedAt: { type: String, default: () => new Date().toISOString() },
//   wallet: {
//     balance: { type: Number, default: 0 },
//     currency: { type: String, default: 'NGN' },
//   },
//   stats: {
//     coursesCompleted: { type: Number, default: 0 },
//     certificatesEarned: { type: Number, default: 0 },
//     peerReviewsDone: { type: Number, default: 0 },
//     averagePeerRating: { type: Number, default: 0 },
//     points: { type: Number, default: 0 },
//     streakDays: { type: Number, default: 1 },
//   },
//   authMetadata: {
//     verificationToken: { type: String },
//     tokenExpiresAt: { type: Date },
//   },
  
// })


const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: { type: String, required: true, unique: true, lowercase: true },
    avatar: { type: String, required: true },

    role: {
      type: String,
      enum: ['STUDENT', 'MENTOR', 'ADMIN', ''],
      default: 'STUDENT',
    },

    joinedAt: { type: String, default: () => new Date().toISOString() },

    wallet: {
      balance: { type: Number, default: 0 },
      currency: { type: String, default: 'NGN' },
    },

    stats: {
      coursesCompleted: { type: Number, default: 0 },
      certificatesEarned: { type: Number, default: 0 },
      peerReviewsDone: { type: Number, default: 0 },
      averagePeerRating: { type: Number, default: 0 },
      points: { type: Number, default: 0 },
      streakDays: { type: Number, default: 1 },
    },

    authMetadata: {
      verificationToken: { type: String },
      tokenExpiresAt: { type: Date },
    },
  },
  {
    timestamps: true, 
  },
)

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema)