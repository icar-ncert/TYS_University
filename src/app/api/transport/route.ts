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

  const routes = await db.transportRoute.findMany({ where })

  return NextResponse.json({
    routes: routes.map(r => ({
      id: r.id,
      name: r.name,
      vehicleNo: r.vehicleNo,
      driverName: r.driverName,
      driverPhone: r.driverPhone,
      capacity: r.capacity,
      feePerYear: r.feePerYear,
      startTime: r.startTime,
      endTime: r.endTime,
      stops: r.stops ? JSON.parse(r.stops) : [],
    })),
  })
}
