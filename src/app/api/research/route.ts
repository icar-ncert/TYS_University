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

  const projects = await db.researchProject.findMany({
    where,
    orderBy: { startDate: 'desc' },
    take: 50,
  })

  const totalFunding = await db.researchProject.aggregate({
    where,
    _sum: { amount: true },
  })

  return NextResponse.json({
    projects: projects.map(p => ({
      id: p.id,
      title: p.title,
      fundingAgency: p.fundingAgency,
      amount: p.amount,
      startDate: p.startDate,
      endDate: p.endDate,
      status: p.status,
      description: p.description,
    })),
    totalFunding: totalFunding._sum.amount || 0,
  })
}
