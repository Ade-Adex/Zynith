// /app/lib/jwt.ts

import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-super-secret-key-change-me',
)

export interface JWTPayload {
  _id: string
  email: string
  role: string
  [key: string]: unknown
}

/**
 * Signs a complete payload into a secure, encrypted JWT valid for exactly 1 day.
 */
export async function signSessionToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(JWT_SECRET)
}

/**
 * Verifies an incoming session token against the system cryptographic signature.
 * Returns the typed payload if valid, or null if expired/tampered with.
 */
export async function verifySessionToken(
  token: string,
): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    })
    return payload as JWTPayload
  } catch (error) {
    console.error('JWT Verification standard fault:', error)
    return null
  }
}