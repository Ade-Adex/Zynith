// /app/services/authActions.ts

'use server'

import connectDB from '@/app/lib/db'
import { User, IUser } from '@/app/models/User'
import crypto from 'crypto'
import { Resend } from 'resend'
import { cookies } from 'next/headers'
import { signSessionToken } from '@/app/lib/jwt' // Implemented clean utility reference

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = `Zynith <${process.env.RESEND_MAIL_USER || 'no-reply@christbcogbomoso.org'}>`
const REPLY_TO_EMAIL = process.env.MAIL_USER || ''

export type AuthActionResult = {
  success: boolean
  message: string
  userData?: string
  token?: string
}

export async function sendMagicLinkAction(
  email: string,
): Promise<AuthActionResult> {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Provide a valid email address.' }
  }

  try {
    await connectDB()
    const cleanEmail = email.toLowerCase().trim()
    const generatedToken = crypto.randomBytes(32).toString('hex')
    const expirationWindow = new Date(Date.now() + 15 * 60 * 1000) // 15 Minute window

    let targetUser: IUser | null = await User.findOne({ email: cleanEmail })

    if (!targetUser) {
      const derivedPrefix = cleanEmail.split('@')[0]
      const baseName =
        derivedPrefix.charAt(0).toUpperCase() + derivedPrefix.slice(1)

      let computedFirstName = baseName
      let computedLastName = ''

      const nameParts = derivedPrefix.split(/[._-]/)

      if (nameParts.length >= 2) {
        computedFirstName =
          nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1)
        computedLastName =
          nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1)
      } else if (derivedPrefix.length >= 5) {
        const midpoint = Math.ceil(derivedPrefix.length / 2)
        const rawFirst = derivedPrefix.substring(0, midpoint)
        const rawLast = derivedPrefix.substring(midpoint)

        computedFirstName = rawFirst.charAt(0).toUpperCase() + rawFirst.slice(1)
        computedLastName = rawLast.charAt(0).toUpperCase() + rawLast.slice(1)
      } else {
        computedFirstName = baseName
        computedLastName = 'Student'
      }

      targetUser = new User({
        email: cleanEmail,
        name: baseName,
        firstName: computedFirstName,
        lastName: computedLastName,
        username: `${derivedPrefix}_${crypto.randomBytes(2).toString('hex')}`,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
      })
    }

    targetUser.authMetadata = {
      verificationToken: generatedToken,
      tokenExpiresAt: expirationWindow,
    }

    await targetUser.save()

    const magicLandingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?token=${generatedToken}`

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [cleanEmail],
      replyTo: REPLY_TO_EMAIL,
      subject: '🔑 Your Zynith Security Access Link',
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 16px; color: #171717; background-color: #ffffff;">
          <h2 style="font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.05em; font-style: italic; margin-bottom: 24px;">
            ZYNITH<span style="color: #2563eb;">.</span>
          </h2>
          <p style="font-size: 14px; font-weight: 600; color: #4b5563; margin-bottom: 24px; line-height: 1.5;">
            You requested a passwordless login path. Click the verified action button below to instantly authenticate your secure workspace session:
          </p>
          <div style="margin: 32px 0;">
            <a href="${magicLandingUrl}" style="background-color: #0f172a; color: #ffffff; padding: 14px 28px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; border-radius: 12px; display: inline-block;">
              Authenticate Session
            </a>
          </div>
          <p style="font-size: 11px; color: #9ca3af; line-height: 1.4;">
            This security mechanism remains fully valid for exactly 15 minutes.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend provider error:', error)
      return {
        success: false,
        message: 'Could not deliver authentication email link.',
      }
    }

    return { success: true, message: 'Magic link sent successfully.' }
  } catch (error) {
    console.error('Auth error:', error)
    return {
      success: false,
      message: 'System error handling authentication lifecycle.',
    }
  }
}

export async function verifyTokenAndLoginAction(
  token: string,
): Promise<AuthActionResult> {
  if (!token) return { success: false, message: 'Missing token parameter.' }

  try {
    await connectDB()

    const matchingUser: IUser | null = await User.findOne({
      'authMetadata.verificationToken': token,
      'authMetadata.tokenExpiresAt': { $gt: new Date() },
    })

    if (!matchingUser) {
      return { success: false, message: 'Token has expired or is invalid.' }
    }

    matchingUser.authMetadata = undefined
    await matchingUser.save()

    // Sign the token using your separated token processor module
    const sessionToken = await signSessionToken({
      _id: matchingUser._id.toString(),
      email: matchingUser.email,
      role: matchingUser.role,
    })

    const cookieStore = await cookies()
    cookieStore.set('zynith_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 1 Day sync matching the payload configuration
    })

    return {
      success: true,
      message: 'Access cleared.',
      token: sessionToken,
      userData: JSON.stringify({
        _id: matchingUser._id.toString(),
        name: matchingUser.name,
        firstName: matchingUser.firstName,
        lastName: matchingUser.lastName,
        email: matchingUser.email,
        username: matchingUser.username,
        avatar: matchingUser.avatar,
        role: matchingUser.role,
        joinedAt: matchingUser.joinedAt,
        stats: matchingUser.stats,
        wallet: matchingUser.wallet,
      }),
    }
  } catch (error) {
    console.error('Verification error:', error)
    return {
      success: false,
      message: 'System authentication transaction error.',
    }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('zynith_session')
}