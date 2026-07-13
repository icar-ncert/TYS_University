import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const notifications = await db.notification.findMany({
    where: user.roleName !== 'SUPER_ADMIN' && user.roleName !== 'UNIVERSITY_ADMIN' ? { userId: user.id } : {},
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { user: true },
  })

  return NextResponse.json({ notifications })
}
