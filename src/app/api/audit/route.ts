import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const logs = await db.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { user: true },
  })

  return NextResponse.json({
    logs: logs.map(l => ({
      id: l.id,
      user: l.user?.name || 'System',
      action: l.action,
      module: l.module,
      description: l.description,
      ipAddress: l.ipAddress,
      createdAt: l.createdAt,
    })),
  })
}
