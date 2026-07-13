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

  const sessions = await db.academicSession.findMany({
    where,
    orderBy: { name: 'desc' },
    include: {
      _count: {
        select: { students: true, feePayments: true, attendances: true, results: true },
      },
      college: true,
    },
  })

  return NextResponse.json({
    sessions: sessions.map(s => ({
      id: s.id,
      name: s.name,
      college: s.college?.shortName || 'N/A',
      startDate: s.startDate,
      endDate: s.endDate,
      isActive: s.isActive,
      isArchived: s.isArchived,
      students: s._count.students,
      feePayments: s._count.feePayments,
      attendances: s._count.attendances,
      results: s._count.results,
    })),
  })
}
