// Simple session-based auth (no bcrypt since this is a demo)
// In production, use bcrypt/argon2 for password hashing and JWT/NextAuth

import { db } from './db'
import { cookies } from 'next/headers'

export interface SessionUser {
  id: string
  email: string
  name: string
  roleId: string
  roleName: string
  roleDisplayName: string
  collegeId: string | null
  avatar?: string | null
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('erp_user_id')?.value
    if (!userId) return null

    const user = await db.user.findUnique({
      where: { id: userId },
      include: { role: true },
    })

    if (!user || !user.isActive) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      roleId: user.roleId,
      roleName: user.role.name,
      roleDisplayName: user.role.displayName,
      collegeId: user.collegeId,
      avatar: user.avatar,
    }
  } catch {
    return null
  }
}

export async function setSession(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set('erp_user_id', userId, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  // Update last login
  await db.user.update({
    where: { id: userId },
    data: { lastLogin: new Date() },
  })

  // Audit log
  await db.auditLog.create({
    data: {
      userId,
      action: 'LOGIN',
      module: 'AUTH',
      description: `User logged in`,
    },
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('erp_user_id')?.value
  if (userId) {
    await db.auditLog.create({
      data: {
        userId,
        action: 'LOGOUT',
        module: 'AUTH',
        description: `User logged out`,
      },
    })
  }
  cookieStore.delete('erp_user_id')
}

export async function authenticateUser(email: string, password: string) {
  // For demo: accept any password >= 4 chars if email exists
  // In production, use bcrypt.compare(password, user.passwordHash)
  const user = await db.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: { role: true },
  })

  if (!user || !user.isActive) {
    return null
  }

  // Demo: accept any non-empty password
  if (!password || password.length < 3) {
    return null
  }

  return user
}
