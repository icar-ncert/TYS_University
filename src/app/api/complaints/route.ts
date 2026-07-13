import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const where = user.collegeId && user.roleName !== 'SUPER_ADMIN' && user.roleName !== 'UNIVERSITY_ADMIN'
    ? { collegeId: user.collegeId }
    : {}

  const complaints = await db.complaint.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { student: true, college: true },
  })

  const byStatus = await db.complaint.groupBy({ by: ['status'], where, _count: true })
  const byPriority = await db.complaint.groupBy({ by: ['priority'], where, _count: true })
  const byCategory = await db.complaint.groupBy({ by: ['category'], where, _count: true })

  return NextResponse.json({
    complaints: complaints.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description,
      category: c.category,
      priority: c.priority,
      status: c.status,
      student: c.student?.fullName || 'Anonymous',
      college: c.college?.shortName || 'N/A',
      createdAt: c.createdAt,
      resolution: c.resolution,
    })),
    summary: {
      byStatus: byStatus.map(s => ({ name: s.status, value: s._count })),
      byPriority: byPriority.map(p => ({ name: p.priority, value: p._count })),
      byCategory: byCategory.map(c => ({ name: c.category, value: c._count })),
    },
  })
}
