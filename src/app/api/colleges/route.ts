import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const colleges = await db.college.findMany({
    where: { isActive: true },
    orderBy: { isUniversity: 'desc' },
    include: {
      _count: {
        select: {
          students: true,
          employees: true,
          schools: true,
        },
      },
    },
  })

  return NextResponse.json({
    colleges: colleges.map(c => ({
      id: c.id,
      code: c.code,
      name: c.name,
      shortName: c.shortName,
      subdomain: c.subdomain,
      city: c.city,
      state: c.state,
      email: c.email,
      phone: c.phone,
      isUniversity: c.isUniversity,
      establishedYear: c.establishedYear,
      students: c._count.students,
      employees: c._count.employees,
      schools: c._count.schools,
      url: `https://${c.subdomain}.tysuniversity.edu`,
    })),
  })
}
