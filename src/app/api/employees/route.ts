import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const collegeId = searchParams.get('collegeId')
  const departmentId = searchParams.get('departmentId')
  const employeeType = searchParams.get('employeeType')
  const status = searchParams.get('status') || 'ACTIVE'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const where: any = { status }
  if (search) {
    where.OR = [
      { fullName: { contains: search } },
      { employeeCode: { contains: search } },
      { email: { contains: search } },
    ]
  }
  if (collegeId) where.collegeId = collegeId
  if (departmentId) where.departmentId = departmentId
  if (employeeType) where.employeeType = employeeType

  if (user.roleName !== 'SUPER_ADMIN' && user.roleName !== 'UNIVERSITY_ADMIN' && user.collegeId) {
    where.collegeId = user.collegeId
  }

  const [employees, total] = await Promise.all([
    db.employee.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { department: true, college: true },
    }),
    db.employee.count({ where }),
  ])

  return NextResponse.json({
    employees: employees.map(e => ({
      id: e.id,
      employeeCode: e.employeeCode,
      name: e.fullName,
      email: e.email,
      phone: e.phone,
      gender: e.gender,
      designation: e.designation,
      employeeType: e.employeeType,
      department: e.department?.name || 'N/A',
      college: e.college?.shortName || 'N/A',
      qualification: e.qualification,
      experience: e.experience,
      salary: e.salary,
      dateOfJoining: e.dateOfJoining,
      status: e.status,
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}
