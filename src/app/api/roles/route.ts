import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const roles = await db.role.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { users: true } } },
  })

  return NextResponse.json({
    roles: roles.map(r => ({
      id: r.id,
      name: r.name,
      displayName: r.displayName,
      description: r.description,
      isSystem: r.isSystem,
      permissions: r.permissions,
      users: r._count.users,
    })),
  })
}
