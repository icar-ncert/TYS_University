import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const reportModule = searchParams.get('module') || 'overview'
  const collegeId = searchParams.get('collegeId')
  const sessionId = searchParams.get('sessionId')

  const baseWhere: any = {}
  if (collegeId) baseWhere.collegeId = collegeId
  if (sessionId) baseWhere.sessionId = sessionId

  if (user.collegeId && user.roleName !== 'SUPER_ADMIN' && user.roleName !== 'UNIVERSITY_ADMIN') {
    baseWhere.collegeId = user.collegeId
  }

  let data: any = {}

  if (reportModule === 'overview' || reportModule === 'all') {
    const [studentsByCollege, studentsByProgramType, genderDist, categoryDist, feeByCollege, feeByMode, statusDist] = await Promise.all([
      db.student.groupBy({ by: ['collegeId'], _count: true }),
      db.student.groupBy({ by: ['gender'], _count: true }),
      db.student.groupBy({ by: ['category'], _count: true }),
      db.student.groupBy({ by: ['status'], _count: true }),
      db.feePayment.groupBy({ by: ['collegeId'], _sum: { amount: true }, _count: true }),
      db.feePayment.groupBy({ by: ['paymentMode'], _sum: { amount: true }, _count: true }),
      db.student.groupBy({ by: ['programId'], _count: true }),
    ])

    // Resolve college names
    const collegeIds = [...new Set(studentsByCollege.map(s => s.collegeId))]
    const colleges = await db.college.findMany({ where: { id: { in: collegeIds } }, select: { id: true, shortName: true, name: true } })
    const collegeMap = new Map(colleges.map(c => [c.id, c]))

    // Program types
    const programIds = studentsByProgramType.map(s => s.programId).filter(Boolean) as string[]
    const programs = await db.program.findMany({ where: { id: { in: programIds } }, select: { id: true, type: true, name: true } })
    const programMap = new Map(programs.map(p => [p.id, p]))
    const typeCounts: Record<string, number> = {}
    for (const s of studentsByProgramType) {
      const type = programMap.get(s.programId!)?.type || 'UNKNOWN'
      typeCounts[type] = (typeCounts[type] || 0) + s._count
    }

    data = {
      studentsByCollege: studentsByCollege.map(s => ({
        name: collegeMap.get(s.collegeId)?.shortName || 'Unknown',
        fullName: collegeMap.get(s.collegeId)?.name || 'Unknown',
        count: s._count,
      })).sort((a, b) => b.count - a.count),
      studentsByProgramType: Object.entries(typeCounts).map(([name, value]) => ({ name, value })),
      genderDistribution: genderDist.map(g => ({ name: g.gender || 'Unknown', value: g._count })),
      categoryDistribution: categoryDist.map(c => ({ name: c.category || 'Unknown', value: c._count })),
      statusDistribution: statusDist.map(s => ({ name: s.status, value: s._count })),
      feeByCollege: feeByCollege.map(f => ({
        name: collegeMap.get(f.collegeId)?.shortName || 'Unknown',
        amount: f._sum.amount || 0,
        count: f._count,
      })).sort((a, b) => b.amount - a.amount),
      feeByMode: feeByMode.map(f => ({ name: f.paymentMode, amount: f._sum.amount || 0, count: f._count })),
    }
  }

  if (reportModule === 'attendance' || reportModule === 'all') {
    const attByStatus = await db.attendance.groupBy({ by: ['status'], _count: true })
    data.attendanceByStatus = attByStatus.map(a => ({ name: a.status, value: a._count }))
  }

  if (reportModule === 'employees' || reportModule === 'all') {
    const empByType = await db.employee.groupBy({ by: ['employeeType'], _count: true })
    const empByDesignation = await db.employee.groupBy({ by: ['designation'], _count: true })
    data.employeesByType = empByType.map(e => ({ name: e.employeeType, value: e._count }))
    data.employeesByDesignation = empByDesignation.map(e => ({ name: e.designation, value: e._count }))
  }

  return NextResponse.json({ module: reportModule, data })
}
