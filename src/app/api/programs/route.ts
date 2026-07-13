import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const where = user.collegeId && user.roleName !== 'SUPER_ADMIN' && user.roleName !== 'UNIVERSITY_ADMIN'
    ? { school: { collegeId: user.collegeId } }
    : {}

  const programs = await db.program.findMany({
    where,
    orderBy: { name: 'asc' },
    include: {
      school: { include: { college: true } },
      department: true,
      _count: { select: { students: true, courses: true } },
    },
  })

  return NextResponse.json({
    programs: programs.map(p => ({
      id: p.id,
      name: p.name,
      code: p.code,
      type: p.type,
      duration: p.duration,
      credits: p.credits,
      totalSeats: p.totalSeats,
      feePerYear: p.feePerYear,
      school: p.school?.name || 'N/A',
      department: p.department?.name || 'N/A',
      college: p.school?.college?.shortName || 'N/A',
      students: p._count.students,
      courses: p._count.courses,
      isActive: p.isActive,
    })),
  })
}
