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
  const programId = searchParams.get('programId')
  const sessionId = searchParams.get('sessionId')
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const where: any = {}
  if (search) {
    where.OR = [
      { fullName: { contains: search } },
      { enrollmentNo: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
    ]
  }
  if (collegeId) where.collegeId = collegeId
  if (programId) where.programId = programId
  if (status) where.status = status

  // Role-based filtering
  if (user.roleName !== 'SUPER_ADMIN' && user.roleName !== 'UNIVERSITY_ADMIN' && user.collegeId) {
    where.collegeId = user.collegeId
  }

  if (sessionId) {
    where.enrollments = { some: { sessionId } }
  }

  const [students, total] = await Promise.all([
    db.student.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        program: true,
        college: true,
        enrollments: { include: { session: true }, orderBy: { createdAt: 'desc' }, take: 1 },
      },
    }),
    db.student.count({ where }),
  ])

  return NextResponse.json({
    students: students.map(s => ({
      id: s.id,
      enrollmentNo: s.enrollmentNo,
      name: s.fullName,
      email: s.email,
      phone: s.phone,
      gender: s.gender,
      category: s.category,
      program: s.program?.name || 'N/A',
      college: s.college?.shortName || 'N/A',
      collegeName: s.college?.name || 'N/A',
      status: s.status,
      currentSemester: s.enrollments[0]?.semester || 'N/A',
      session: s.enrollments[0]?.session?.name || 'N/A',
      photo: s.photo,
      admissionDate: s.admissionDate,
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      firstName, lastName, email, phone, gender, category, dateOfBirth,
      fatherName, motherName, guardianPhone, permanentAddress,
      collegeId, programId, bloodGroup, aadhaarNo,
    } = body

    if (!firstName || !lastName || !email || !collegeId || !programId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const fullName = `${firstName} ${lastName}`
    const college = await db.college.findUnique({ where: { id: collegeId } })
    if (!college) return NextResponse.json({ error: 'Invalid college' }, { status: 400 })

    // Get active session
    const activeSession = await db.academicSession.findFirst({
      where: { collegeId, isActive: true },
    })

    // Create user
    const newUser = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name: fullName,
        passwordHash: 'demo_hash_password_2025',
        roleId: (await db.role.findUnique({ where: { name: 'STUDENT' } }))!.id,
        collegeId,
        isActive: true,
      },
    })

    const enrollmentNo = `${college.code}${new Date().getFullYear()}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`

    const student = await db.student.create({
      data: {
        enrollmentNo,
        collegeId,
        userId: newUser.id,
        programId,
        firstName, lastName, fullName,
        email: email.toLowerCase(),
        phone, gender, category,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        bloodGroup, aadhaarNo,
        fatherName, motherName, guardianPhone,
        permanentAddress,
        status: 'ACTIVE',
      },
    })

    // Enroll in active session
    if (activeSession) {
      await db.studentEnrollment.create({
        data: {
          studentId: student.id,
          sessionId: activeSession.id,
          programId,
          semester: 1,
          section: 'A',
          rollNo: enrollmentNo.slice(-3),
          status: 'ENROLLED',
        },
      })
    }

    // Audit
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: 'CREATE',
        module: 'STUDENT',
        description: `Created student ${fullName} (${enrollmentNo})`,
      },
    })

    return NextResponse.json({ success: true, student })
  } catch (error: any) {
    console.error('Create student error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create student' }, { status: 500 })
  }
}
