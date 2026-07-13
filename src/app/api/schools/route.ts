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

  const schools = await db.school.findMany({
    where,
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { departments: true, programs: true } },
      college: true,
      departments: { include: { _count: { select: { courses: true, employees: true } } } },
    },
  })

  return NextResponse.json({
    schools: schools.map(s => ({
      id: s.id,
      name: s.name,
      code: s.code,
      college: s.college?.shortName || 'N/A',
      departments: s._count.departments,
      programs: s._count.programs,
      departmentsList: s.departments.map(d => ({
        id: d.id,
        name: d.name,
        code: d.code,
        courses: d._count.courses,
        employees: d._count.employees,
      })),
    })),
  })
}
