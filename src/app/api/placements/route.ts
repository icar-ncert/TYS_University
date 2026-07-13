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

  const drives = await db.placementDrive.findMany({
    where,
    orderBy: { driveDate: 'desc' },
    take: 50,
    include: { _count: { select: { applications: true } } },
  })

  return NextResponse.json({
    drives: drives.map(d => ({
      id: d.id,
      company: d.companyName,
      designation: d.designation,
      package: d.package,
      location: d.location,
      driveDate: d.driveDate,
      lastDate: d.lastDate,
      status: d.status,
      applications: d._count.applications,
    })),
  })
}
