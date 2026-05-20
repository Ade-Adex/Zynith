// /app/lib/db.ts

import mongoose from 'mongoose'
import dns from 'dns'

dns.setServers(['8.8.8.8', '8.8.4.4'])

const MONGODB_URI: string = process.env.MONGODB_URI || ''

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local',
  )
}

interface MongooseGlobalCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongooseCache: MongooseGlobalCache | undefined
}

let cached = globalThis.mongooseCache

if (!cached) {
  cached = globalThis.mongooseCache = { conn: null, promise: null }
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn
  }

  if (!cached!.promise) {
    const opts = { bufferCommands: false }
    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m)
  }

  try {
    cached!.conn = await cached!.promise
  } catch (e) {
    cached!.promise = null
    throw e
  }

  return cached!.conn
}

export default connectDB