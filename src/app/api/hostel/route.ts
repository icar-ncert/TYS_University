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

  const hostels = await db.hostel.findMany({
    where,
    include: {
      rooms: { select: { capacity: true, occupied: true } },
      _count: { select: { rooms: true } },
    },
  })

  return NextResponse.json({
    hostels: hostels.map(h => ({
      id: h.id,
      name: h.name,
      type: h.type,
      totalRooms: h.totalRooms,
      totalBeds: h.totalBeds,
      feePerYear: h.feePerYear,
      roomsCount: h._count.rooms,
      occupiedBeds: h.rooms.reduce((sum, r) => sum + r.occupied, 0),
      totalCapacity: h.rooms.reduce((sum, r) => sum + r.capacity, 0),
    })),
  })
}
