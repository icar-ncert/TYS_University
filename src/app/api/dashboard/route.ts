import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const collegeFilter = user.collegeId && user.roleName !== 'SUPER_ADMIN' && user.roleName !== 'UNIVERSITY_ADMIN'
    ? { collegeId: user.collegeId }
    : {}

  const [
    totalColleges,
    totalStudents,
    totalEmployees,
    totalPrograms,
    totalCourses,
    totalSessions,
    totalFeePayments,
    feeAgg,
    totalPlacements,
    totalBooks,
    totalResearch,
    totalComplaints,
    openComplaints,
    totalNotices,
    totalEvents,
    recentAdmissions,
  ] = await Promise.all([
    db.college.count({ where: { isUniversity: false, isActive: true } }),
    db.student.count({ where: collegeFilter }),
    db.employee.count({ where: collegeFilter }),
    db.program.count({ where: { school: { collegeId: user.collegeId || undefined } } }),
    db.course.count(),
    db.academicSession.count({ where: collegeFilter }),
    db.feePayment.count({ where: collegeFilter }),
    db.feePayment.aggregate({ where: collegeFilter, _sum: { amount: true } }),
    db.placementDrive.count({ where: collegeFilter }),
    db.book.count({ where: collegeFilter }),
    db.researchProject.count({ where: collegeFilter }),
    db.complaint.count({ where: collegeFilter }),
    db.complaint.count({ where: { ...collegeFilter, status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
    db.notice.count(),
    db.event.count(),
    db.student.findMany({
      where: collegeFilter,
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { program: true, college: true },
    }),
  ])

  // Students by program type
  const studentsByType = await db.student.groupBy({
    by: ['programId'],
    where: collegeFilter,
    _count: true,
  })

  // Get program types
  const programIds = studentsByType.map(s => s.programId).filter(Boolean) as string[]
  const programs = await db.program.findMany({
    where: { id: { in: programIds } },
    select: { id: true, type: true },
  })
  const programTypeMap = new Map(programs.map(p => [p.id, p.type]))
  const typeCounts: Record<string, number> = {}
  for (const s of studentsByType) {
    const type = programTypeMap.get(s.programId!) || 'UNKNOWN'
    typeCounts[type] = (typeCounts[type] || 0) + s._count
  }

  // Students by college
  const studentsByCollege = await db.student.groupBy({
    by: ['collegeId'],
    _count: true,
  })
  const collegeIds = studentsByCollege.map(s => s.collegeId)
  const colleges = await db.college.findMany({
    where: { id: { in: collegeIds } },
    select: { id: true, shortName: true, name: true },
  })
  const collegeMap = new Map(colleges.map(c => [c.id, c]))
  const collegeCounts = studentsByCollege.map(s => ({
    name: collegeMap.get(s.collegeId)?.shortName || 'Unknown',
    fullName: collegeMap.get(s.collegeId)?.name || 'Unknown',
    count: s._count,
  })).sort((a, b) => b.count - a.count)

  // Fee collection by month (last 6 months)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
  const feePayments = await db.feePayment.findMany({
    where: {
      ...collegeFilter,
      paymentDate: { gte: sixMonthsAgo },
    },
    select: { amount: true, paymentDate: true },
  })
  const monthlyFees: Record<string, number> = {}
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  for (const p of feePayments) {
    const key = `${monthNames[p.paymentDate.getMonth()]} ${p.paymentDate.getFullYear()}`
    monthlyFees[key] = (monthlyFees[key] || 0) + p.amount
  }

  // Attendance stats
  const totalAttendance = await db.attendance.count({ where: { ...collegeFilter, type: 'STUDENT' } })
  const presentCount = await db.attendance.count({ where: { ...collegeFilter, type: 'STUDENT', status: 'PRESENT' } })

  return NextResponse.json({
    stats: {
      totalColleges,
      totalStudents,
      totalEmployees,
      totalPrograms,
      totalCourses,
      totalSessions,
      totalFeePayments,
      totalFeeCollected: feeAgg._sum.amount || 0,
      totalPlacements,
      totalBooks,
      totalResearch,
      totalComplaints,
      openComplaints,
      totalNotices,
      totalEvents,
      attendancePercentage: totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0,
    },
    charts: {
      studentsByType: Object.entries(typeCounts).map(([name, value]) => ({ name, value })),
      studentsByCollege: collegeCounts,
      monthlyFeeCollection: Object.entries(monthlyFees).map(([name, value]) => ({ name, value })),
    },
    recentAdmissions: recentAdmissions.map(s => ({
      id: s.id,
      name: s.fullName,
      enrollmentNo: s.enrollmentNo,
      program: s.program?.name || 'N/A',
      college: s.college?.shortName || 'N/A',
      date: s.admissionDate,
      status: s.status,
    })),
    user,
  })
}
