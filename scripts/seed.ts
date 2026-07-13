// TYS University ERP - Seed Script
// Run with: bun run /home/z/my-project/scripts/seed.ts

import { db } from '../src/lib/db'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Password hash placeholder - in production use bcrypt
const PASS_HASH = 'demo_hash_password_2025'

async function main() {
  console.log('🌱 Seeding TYS University ERP...')

  // ============== ROLES ==============
  const roles = [
    { name: 'SUPER_ADMIN', displayName: 'Super Admin', description: 'Full system access', isSystem: true, permissions: '["*"]' },
    { name: 'UNIVERSITY_ADMIN', displayName: 'University Admin', description: 'University-wide admin', isSystem: true, permissions: '["university.*","reports.*","cms.*"]' },
    { name: 'COLLEGE_ADMIN', displayName: 'College Admin', description: 'Affiliated college admin', isSystem: true, permissions: '["college.*"]' },
    { name: 'REGISTRAR', displayName: 'Registrar', description: 'Registrar office', isSystem: true, permissions: '["admissions.*","students.read"]' },
    { name: 'FINANCE_OFFICER', displayName: 'Finance Officer', description: 'Finance & fees', isSystem: true, permissions: '["finance.*"]' },
    { name: 'HR_MANAGER', displayName: 'HR Manager', description: 'HR management', isSystem: true, permissions: '["hr.*"]' },
    { name: 'EXAM_CONTROLLER', displayName: 'Exam Controller', description: 'Examinations', isSystem: true, permissions: '["exams.*"]' },
    { name: 'DEAN', displayName: 'Dean', description: 'School Dean', isSystem: true, permissions: '["school.*"]' },
    { name: 'HOD', displayName: 'HOD', description: 'Head of Department', isSystem: true, permissions: '["department.*"]' },
    { name: 'FACULTY', displayName: 'Faculty', description: 'Teaching staff', isSystem: true, permissions: '["faculty.*"]' },
    { name: 'EMPLOYEE', displayName: 'Employee', description: 'Non-teaching staff', isSystem: true, permissions: '["employee.*"]' },
    { name: 'STUDENT', displayName: 'Student', description: 'Student portal', isSystem: true, permissions: '["student.*"]' },
    { name: 'LIBRARIAN', displayName: 'Librarian', description: 'Library management', isSystem: true, permissions: '["library.*"]' },
    { name: 'PLACEMENT_OFFICER', displayName: 'Placement Officer', description: 'Placement cell', isSystem: true, permissions: '["placement.*"]' },
  ]

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    })
  }
  console.log(`✅ Created ${roles.length} roles`)

  // ============== MAIN UNIVERSITY ==============
  const university = await prisma.college.upsert({
    where: { subdomain: 'www' },
    update: {},
    create: {
      code: 'TYSU',
      name: 'TYS University',
      shortName: 'TYSU',
      subdomain: 'www',
      address: 'University Campus, Knowledge City',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '226001',
      phone: '+91-522-1234567',
      email: 'info@tysuniversity.edu',
      website: 'https://tysuniversity.edu',
      isActive: true,
      isUniversity: true,
      establishedYear: 2024,
      description: 'A premier state university offering quality higher education across multiple disciplines.',
    },
  })
  console.log(`✅ Created university: ${university.name}`)

  // ============== AFFILIATED COLLEGES ==============
  const collegesData = [
    { code: 'TYSM', name: 'TYS Mahavidyalaya', shortName: 'TYSM', subdomain: 'tysmahavidyalaya', city: 'Lucknow', state: 'UP' },
    { code: 'ABC', name: 'ABC College of Engineering', shortName: 'ABC', subdomain: 'abc', city: 'Kanpur', state: 'UP' },
    { code: 'XYZ', name: 'XYZ College of Management', shortName: 'XYZ', subdomain: 'xyz', city: 'Varanasi', state: 'UP' },
    { code: 'SGC', name: 'Saraswati Graduate College', shortName: 'SGC', subdomain: 'sgc', city: 'Gorakhpur', state: 'UP' },
    { code: 'VSEC', name: 'Vidya Science & Engineering College', shortName: 'VSEC', subdomain: 'vsec', city: 'Agra', state: 'UP' },
    { code: 'RKC', name: 'Radha Krishna College', shortName: 'RKC', subdomain: 'rkc', city: 'Meerut', state: 'UP' },
  ]

  const colleges = [university]
  for (const c of collegesData) {
    const college = await prisma.college.upsert({
      where: { subdomain: c.subdomain },
      update: {},
      create: {
        ...c,
        address: `${c.city} Campus`,
        phone: '+91-555-0000',
        email: `info@${c.subdomain}.tysuniversity.edu`,
        website: `https://${c.subdomain}.tysuniversity.edu`,
        isActive: true,
        isUniversity: false,
        establishedYear: 2000 + Math.floor(Math.random() * 24),
        description: `Premier affiliated college at ${c.city}`,
      },
    })
    colleges.push(college)
  }
  console.log(`✅ Created ${colleges.length} colleges (incl. university)`)

  // ============== SCHOOLS, DEPARTMENTS, PROGRAMS ==============
  const schoolsData = [
    { name: 'School of Engineering & Technology', code: 'SOET', departments: ['Computer Science', 'Electronics', 'Mechanical', 'Civil'], programs: [
      { name: 'B.Tech Computer Science', code: 'BT-CS', type: 'UG', duration: 4, credits: 160, seats: 120, fee: 120000 },
      { name: 'B.Tech Electronics', code: 'BT-EC', type: 'UG', duration: 4, credits: 160, seats: 60, fee: 120000 },
      { name: 'M.Tech Computer Science', code: 'MT-CS', type: 'PG', duration: 2, credits: 80, seats: 30, fee: 150000 },
      { name: 'Ph.D Computer Science', code: 'PHD-CS', type: 'PHD', duration: 5, credits: 0, seats: 10, fee: 80000 },
    ]},
    { name: 'School of Management Studies', code: 'SOMS', departments: ['Management', 'Commerce'], programs: [
      { name: 'MBA', code: 'MBA', type: 'PG', duration: 2, credits: 96, seats: 120, fee: 200000 },
      { name: 'BBA', code: 'BBA', type: 'UG', duration: 3, credits: 120, seats: 180, fee: 80000 },
      { name: 'B.Com', code: 'BCOM', type: 'UG', duration: 3, credits: 120, seats: 240, fee: 40000 },
    ]},
    { name: 'School of Sciences', code: 'SOS', departments: ['Physics', 'Chemistry', 'Mathematics', 'Botany', 'Zoology'], programs: [
      { name: 'B.Sc Physics', code: 'BSC-PHY', type: 'UG', duration: 3, credits: 120, seats: 60, fee: 35000 },
      { name: 'B.Sc Chemistry', code: 'BSC-CHM', type: 'UG', duration: 3, credits: 120, seats: 60, fee: 35000 },
      { name: 'M.Sc Physics', code: 'MSC-PHY', type: 'PG', duration: 2, credits: 80, seats: 30, fee: 60000 },
      { name: 'M.Sc Mathematics', code: 'MSC-MTH', type: 'PG', duration: 2, credits: 80, seats: 40, fee: 60000 },
    ]},
    { name: 'School of Arts & Humanities', code: 'SOAH', departments: ['English', 'Hindi', 'History', 'Sociology'], programs: [
      { name: 'B.A English', code: 'BA-ENG', type: 'UG', duration: 3, credits: 120, seats: 120, fee: 25000 },
      { name: 'B.A History', code: 'BA-HIS', type: 'UG', duration: 3, credits: 120, seats: 120, fee: 25000 },
      { name: 'M.A English', code: 'MA-ENG', type: 'PG', duration: 2, credits: 80, seats: 40, fee: 45000 },
    ]},
    { name: 'School of Education', code: 'SOE', departments: ['Education'], programs: [
      { name: 'B.Ed', code: 'BED', type: 'UG', duration: 2, credits: 80, seats: 100, fee: 50000 },
      { name: 'M.Ed', code: 'MED', type: 'PG', duration: 2, credits: 80, seats: 50, fee: 75000 },
    ]},
    { name: 'School of Law', code: 'SOL', departments: ['Law'], programs: [
      { name: 'LL.B', code: 'LLB', type: 'UG', duration: 3, credits: 100, seats: 80, fee: 90000 },
      { name: 'LL.M', code: 'LLM', type: 'PG', duration: 2, credits: 80, seats: 30, fee: 120000 },
    ]},
  ]

  // Apply to main university
  for (const college of colleges) {
    for (const sData of schoolsData) {
      const school = await prisma.school.create({
        data: {
          collegeId: college.id,
          name: sData.name,
          code: sData.code,
          description: `${sData.name} at ${college.shortName}`,
          isActive: true,
        },
      })

      for (const deptName of sData.departments) {
        const dept = await prisma.department.create({
          data: {
            schoolId: school.id,
            name: deptName,
            code: deptName.substring(0, 3).toUpperCase(),
            description: `Department of ${deptName}`,
            isActive: true,
          },
        })

        for (const pData of sData.programs) {
          const program = await prisma.program.create({
            data: {
              schoolId: school.id,
              departmentId: dept.id,
              name: pData.name,
              code: pData.code,
              type: pData.type,
              duration: pData.duration,
              credits: pData.credits,
              totalSeats: pData.seats,
              feePerYear: pData.fee,
              eligibility: pData.type === 'PG' ? 'Graduation in relevant stream with 50%' : '10+2 with relevant subjects',
              careerScope: 'Multiple career opportunities in industry, research, and academia',
              isActive: true,
            },
          })

          // Courses for program
          for (let sem = 1; sem <= Math.min(pData.duration * 2, 4); sem++) {
            for (let c = 1; c <= 3; c++) {
              const course = await prisma.course.create({
                data: {
                  departmentId: dept.id,
                  programId: program.id,
                  name: `${pData.code} Sem ${sem} Course ${c}`,
                  code: `${pData.code}-S${sem}C${c}`,
                  semester: sem,
                  credits: 4,
                  description: `Course ${c} for semester ${sem}`,
                  isActive: true,
                },
              })

              for (let sub = 1; sub <= 2; sub++) {
                await prisma.subject.create({
                  data: {
                    courseId: course.id,
                    name: `Subject ${sub} of ${course.name}`,
                    code: `${course.code}-SUB${sub}`,
                    credits: 2,
                  },
                })
              }
            }
          }

          // Fee Structure
          await prisma.feeStructure.create({
            data: {
              collegeId: college.id,
              programId: program.id,
              semester: 1,
              name: 'Tuition Fee',
              amount: pData.fee,
              type: 'TUITION',
              isActive: true,
            },
          })
        }
      }
    }
  }
  console.log(`✅ Created schools, departments, programs, courses for all colleges`)

  // ============== ACADEMIC SESSIONS ==============
  const sessionYears: Record<string, { start: string; end: string }> = {
    '2023-24': { start: '2023-07-01', end: '2024-06-30' },
    '2024-25': { start: '2024-07-01', end: '2025-06-30' },
    '2025-26': { start: '2025-07-01', end: '2026-06-30' },
  }
  for (const college of colleges) {
    for (const [year, dates] of Object.entries(sessionYears)) {
      await prisma.academicSession.create({
        data: {
          collegeId: college.id,
          name: year,
          startDate: new Date(dates.start),
          endDate: new Date(dates.end),
          isActive: year === '2025-26',
          isArchived: year === '2023-24',
        },
      })
    }
  }
  console.log(`✅ Created academic sessions (2023-24, 2024-25, 2025-26)`)

  // ============== USERS & STUDENTS ==============
  const studentRole = await prisma.role.findUnique({ where: { name: 'STUDENT' } })
  const facultyRole = await prisma.role.findUnique({ where: { name: 'FACULTY' } })
  const adminRole = await prisma.role.findUnique({ where: { name: 'UNIVERSITY_ADMIN' } })
  const collegeAdminRole = await prisma.role.findUnique({ where: { name: 'COLLEGE_ADMIN' } })

  // Demo users - easy login
  const superAdminUser = await prisma.user.upsert({
    where: { email: 'admin@tysuniversity.edu' },
    update: {},
    create: {
      email: 'admin@tysuniversity.edu',
      name: 'Super Administrator',
      passwordHash: PASS_HASH,
      roleId: adminRole!.id,
      collegeId: university.id,
      isActive: true,
    },
  })
  console.log(`✅ Created super admin: admin@tysuniversity.edu / ${PASS_HASH}`)

  const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Ananya', 'Aaradhya', 'Saanvi', 'Aadhya', 'Pari', 'Diya', 'Myra', 'Anika', 'Navya', 'Kiara']
  const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Yadav', 'Mishra', 'Pandey', 'Tiwari', 'Dubey', 'Awasthi', 'Srivastava', 'Chaturvedi', 'Tripathi', 'Agarwal', 'Khan', 'Ali', 'Kumar', 'Reddy', 'Nair', 'Joshi']

  let studentCounter = 1
  for (const college of colleges) {
    const collegePrograms = await prisma.program.findMany({
      where: { school: { collegeId: college.id } },
    })

    const activeSession = await prisma.academicSession.findFirst({
      where: { collegeId: college.id, isActive: true },
    })

    // Create 30-50 students per college
    const studentCount = college.isUniversity ? 80 : 30 + Math.floor(Math.random() * 20)
    for (let i = 0; i < studentCount; i++) {
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)]
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)]
      const program = collegePrograms[Math.floor(Math.random() * collegePrograms.length)]
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${studentCounter}@${college.subdomain}.tysuniversity.edu`
      const enrollmentNo = `${college.code}${new Date().getFullYear()}${String(studentCounter).padStart(4, '0')}`

      const user = await prisma.user.create({
        data: {
          email,
          name: `${fn} ${ln}`,
          passwordHash: PASS_HASH,
          roleId: studentRole!.id,
          collegeId: college.id,
          isActive: true,
        },
      })

      const student = await prisma.student.create({
        data: {
          enrollmentNo,
          collegeId: college.id,
          userId: user.id,
          programId: program.id,
          firstName: fn,
          lastName: ln,
          fullName: `${fn} ${ln}`,
          email,
          phone: `+91${Math.floor(9000000000 + Math.random() * 999999999)}`,
          gender: Math.random() > 0.5 ? 'MALE' : 'FEMALE',
          category: ['GENERAL', 'OBC', 'SC', 'ST'][Math.floor(Math.random() * 4)],
          dateOfBirth: new Date(2000 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          bloodGroup: ['A+', 'B+', 'O+', 'AB+'][Math.floor(Math.random() * 4)],
          fatherName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${ln}`,
          motherName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${ln}`,
          guardianPhone: `+91${Math.floor(9000000000 + Math.random() * 999999999)}`,
          permanentAddress: `${college.city}, ${college.state}`,
          status: 'ACTIVE',
        },
      })

      // Enroll in active session
      if (activeSession) {
        await prisma.studentEnrollment.create({
          data: {
            studentId: student.id,
            sessionId: activeSession.id,
            programId: program.id,
            semester: Math.ceil(Math.random() * program.duration * 2),
            section: 'A',
            rollNo: `${String(studentCounter).padStart(3, '0')}`,
            status: 'ENROLLED',
          },
        })

        // Some fee payments
        if (Math.random() > 0.3) {
          await prisma.feePayment.create({
            data: {
              receiptNo: `RCP${activeSession.name.replace('-', '')}${String(studentCounter).padStart(4, '0')}`,
              collegeId: college.id,
              studentId: student.id,
              sessionId: activeSession.id,
              amount: program.feePerYear || 50000,
              discount: Math.random() > 0.7 ? 5000 : 0,
              fine: 0,
              paymentMode: ['CASH', 'ONLINE', 'CHEQUE'][Math.floor(Math.random() * 3)],
              transactionId: Math.random() > 0.5 ? `TXN${Date.now()}${studentCounter}` : null,
              paymentDate: new Date(),
            },
          })
        }

        // Attendance for last 30 days
        for (let d = 0; d < 30; d++) {
          if (Math.random() > 0.85) continue
          await prisma.attendance.create({
            data: {
              collegeId: college.id,
              studentId: student.id,
              sessionId: activeSession.id,
              date: new Date(Date.now() - d * 86400000),
              type: 'STUDENT',
              status: Math.random() > 0.15 ? 'PRESENT' : 'ABSENT',
            },
          })
        }

        // Some results
        if (Math.random() > 0.5) {
          await prisma.result.create({
            data: {
              studentId: student.id,
              sessionId: activeSession.id,
              semester: 1,
              subjectCode: 'SUB101',
              subjectName: 'Foundation Course',
              internalMarks: Math.floor(Math.random() * 20) + 15,
              externalMarks: Math.floor(Math.random() * 50) + 30,
              totalMarks: 0,
              maxMarks: 100,
              grade: 'A',
              result: 'PASS',
            },
          })
        }
      }

      studentCounter++
    }
  }
  console.log(`✅ Created ${studentCounter - 1} students with enrollments, attendance, fees`)

  // ============== EMPLOYEES / FACULTY ==============
  let empCounter = 1
  for (const college of colleges) {
    const collegeDepts = await prisma.department.findMany({
      where: { school: { collegeId: college.id } },
    })

    const empCount = college.isUniversity ? 60 : 15 + Math.floor(Math.random() * 10)
    for (let i = 0; i < empCount; i++) {
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)]
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)]
      const dept = collegeDepts[Math.floor(Math.random() * collegeDepts.length)]
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${empCounter}@${college.subdomain}.tysuniversity.edu`
      const empCode = `EMP${college.code}${String(empCounter).padStart(4, '0')}`
      const isTeaching = Math.random() > 0.3

      const user = await prisma.user.create({
        data: {
          email,
          name: `${fn} ${ln}`,
          passwordHash: PASS_HASH,
          roleId: isTeaching ? facultyRole!.id : (await prisma.role.findUnique({ where: { name: 'EMPLOYEE' } }))!.id,
          collegeId: college.id,
          isActive: true,
        },
      })

      await prisma.employee.create({
        data: {
          employeeCode: empCode,
          collegeId: college.id,
          userId: user.id,
          departmentId: dept.id,
          firstName: fn,
          lastName: ln,
          fullName: `${fn} ${ln}`,
          email,
          phone: `+91${Math.floor(9000000000 + Math.random() * 999999999)}`,
          gender: Math.random() > 0.3 ? 'MALE' : 'FEMALE',
          dateOfBirth: new Date(1970 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          dateOfJoining: new Date(2010 + Math.floor(Math.random() * 14), Math.floor(Math.random() * 12), 1),
          designation: isTeaching ? ['Assistant Professor', 'Associate Professor', 'Professor', 'Lecturer'][Math.floor(Math.random() * 4)] : ['Clerk', 'Accountant', 'Lab Assistant', 'Peon'][Math.floor(Math.random() * 4)],
          employeeType: isTeaching ? 'TEACHING' : 'NON_TEACHING',
          qualification: isTeaching ? ['Ph.D', 'M.Tech', 'M.Sc', 'MBA'][Math.floor(Math.random() * 4)] : 'Graduate',
          experience: Math.floor(Math.random() * 25),
          salary: isTeaching ? 50000 + Math.floor(Math.random() * 100000) : 20000 + Math.floor(Math.random() * 30000),
          status: 'ACTIVE',
        },
      })

      empCounter++
    }
  }
  console.log(`✅ Created ${empCounter - 1} employees`)

  // ============== CMS CONTENT - HOMEPAGE ==============
  const heroSlides = [
    { title: 'Welcome to TYS University', subtitle: 'Empowering minds, shaping futures through quality education', buttonText: 'Apply Now', buttonLink: '/admissions' },
    { title: 'Admissions Open 2025-26', subtitle: 'Join 30+ affiliated colleges and 5000+ students across India', buttonText: 'View Programs', buttonLink: '/programs' },
    { title: 'Excellence in Research', subtitle: 'State-of-the-art facilities and 100+ research projects', buttonText: 'Explore Research', buttonLink: '/research' },
    { title: 'Placement Cell', subtitle: '95% placement record with top companies', buttonText: 'View Placements', buttonLink: '/placements' },
  ]
  for (let i = 0; i < heroSlides.length; i++) {
    await prisma.heroSlide.create({
      data: {
        collegeId: null, // University-wide
        ...heroSlides[i],
        order: i,
        isActive: true,
      },
    })
  }

  const newsData = [
    { title: 'TYS University achieves NAAC A+ grading', excerpt: 'University has been accredited with A+ grade by NAAC for academic excellence.', content: 'The National Assessment and Accreditation Council (NAAC) has awarded TYS University with A+ grade, recognizing its commitment to quality education and infrastructure.', category: 'ACHIEVEMENT', isFeatured: true },
    { title: 'Admissions for 2025-26 session now open', excerpt: 'Applications invited for UG, PG, and PhD programs across all schools.', content: 'TYS University invites applications for the academic session 2025-26 across all undergraduate, postgraduate, and doctoral programs.', category: 'ADMISSION', isFeatured: true },
    { title: 'International Conference on AI & ML', excerpt: 'Department of Computer Science organizing 3-day international conference.', content: 'The Department of Computer Science is organizing an international conference on Artificial Intelligence and Machine Learning from March 15-17, 2025.', category: 'EVENT', isFeatured: false },
    { title: 'New Research Lab inaugurated', excerpt: 'Advanced research lab for quantum computing inaugurated.', content: 'The university has inaugurated a new state-of-the-art research lab for quantum computing research.', category: 'RESEARCH', isFeatured: false },
    { title: 'Sports meet 2025 concludes', excerpt: 'Annual sports meet concludes with record participation.', content: 'The annual sports meet 2025 concluded successfully with over 2000 participants from various colleges.', category: 'SPORTS', isFeatured: false },
  ]
  for (const news of newsData) {
    await prisma.news.create({
      data: {
        ...news,
        slug: news.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        status: 'PUBLISHED',
        authorId: superAdminUser.id,
      },
    })
  }

  const noticesData = [
    { title: 'Examination Schedule - End Semester Exam 2025', category: 'EXAM', content: 'The end semester examinations for session 2025-26 will commence from May 15, 2025. Detailed schedule available on the examination portal.', isPinned: true },
    { title: 'Holiday Notice - Foundation Day', category: 'HOLIDAY', content: 'The university will remain closed on August 15, 2025 on account of Foundation Day.', isPinned: true },
    { title: 'Scholarship applications invited', category: 'SCHOLARSHIP', content: 'Applications for merit-cum-means scholarship are now open. Last date to apply is March 31, 2025.', isPinned: false },
    { title: 'Recruitment - Faculty positions', category: 'RECRUITMENT', content: 'Applications invited for various faculty positions. See recruitment portal for details.', isPinned: false },
    { title: 'Tender - Supply of lab equipment', category: 'TENDER', content: 'Sealed tenders invited for supply of laboratory equipment. Last date: February 28, 2025.', isPinned: false },
    { title: 'Circular - Library timing extended', category: 'CIRCULAR', content: 'Library will remain open till 10 PM during examination period.', isPinned: false },
  ]
  for (const notice of noticesData) {
    await prisma.notice.create({
      data: {
        ...notice,
        authorId: superAdminUser.id,
        expiryDate: new Date(Date.now() + 30 * 86400000),
      },
    })
  }

  const eventsData = [
    { title: 'Annual Convocation 2025', description: 'Annual convocation ceremony for the batch of 2024-25', startDate: new Date(Date.now() + 30 * 86400000), endDate: new Date(Date.now() + 31 * 86400000), venue: 'Main Auditorium', category: 'CONFERENCE' },
    { title: 'Tech Fest - Innovate 2025', description: 'National level technical festival with coding, robotics, and hackathon events', startDate: new Date(Date.now() + 15 * 86400000), endDate: new Date(Date.now() + 17 * 86400000), venue: 'Engineering Block', category: 'CULTURAL' },
    { title: 'Workshop on Data Science', description: '3-day workshop on Data Science and Machine Learning fundamentals', startDate: new Date(Date.now() + 7 * 86400000), endDate: new Date(Date.now() + 9 * 86400000), venue: 'Computer Lab 1', category: 'WORKSHOP' },
    { title: 'Inter-college Sports Meet', description: 'Annual inter-college sports competition', startDate: new Date(Date.now() + 45 * 86400000), endDate: new Date(Date.now() + 50 * 86400000), venue: 'Sports Ground', category: 'SPORTS' },
  ]
  for (const event of eventsData) {
    await prisma.event.create({
      data: {
        ...event,
        authorId: superAdminUser.id,
      },
    })
  }

  // Gallery
  const album = await prisma.galleryAlbum.create({
    data: {
      title: 'Campus Life 2025',
      description: 'Glimpses of campus life at TYS University',
      coverImage: '',
      category: 'CAMPUS',
    },
  })
  for (let i = 1; i <= 8; i++) {
    await prisma.galleryPhoto.create({
      data: {
        albumId: album.id,
        url: '',
        caption: `Campus photo ${i}`,
      },
    })
  }

  // Downloads
  const downloads = [
    { title: 'Prospectus 2025-26', fileType: 'PDF', category: 'PROSPECTUS' },
    { title: 'Admission Form 2025-26', fileType: 'PDF', category: 'FORM' },
    { title: 'B.Tech Syllabus', fileType: 'PDF', category: 'SYLLABUS' },
    { title: 'MBA Syllabus', fileType: 'PDF', category: 'SYLLABUS' },
    { title: 'Annual Report 2024', fileType: 'PDF', category: 'REPORT' },
    { title: 'Examination Timetable', fileType: 'PDF', category: 'TIMETABLE' },
  ]
  for (const d of downloads) {
    await prisma.download.create({
      data: { ...d, fileUrl: '', description: d.title },
    })
  }

  // CMS Pages
  const pages = [
    { title: 'About University', slug: 'about', content: 'TYS University, established in 2024, is a premier state university...' },
    { title: 'Vision & Mission', slug: 'vision-mission', content: 'Our vision is to be a globally recognized institution...' },
    { title: 'Chancellor Message', slug: 'chancellor-message', content: 'Welcome to TYS University...' },
    { title: 'NAAC', slug: 'naac', content: 'NAAC accreditation details...' },
    { title: 'Contact Us', slug: 'contact', content: 'Reach out to us at...' },
  ]
  for (const p of pages) {
    await prisma.cMSPage.create({
      data: {
        ...p,
        status: 'PUBLISHED',
        authorId: superAdminUser.id,
      },
    })
  }

  console.log(`✅ Created CMS content (hero, news, notices, events, gallery, downloads, pages)`)

  // ============== LIBRARY, HOSTEL, TRANSPORT ==============
  for (const college of colleges) {
    // Library
    const books = [
      { title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest, Stein', category: 'CS', isbn: '978-0262033848' },
      { title: 'Data Structures and Algorithms', author: 'Mark Allen Weiss', category: 'CS', isbn: '978-0321541406' },
      { title: 'Principles of Management', author: 'P.C. Tripathi', category: 'MGMT', isbn: '978-9332518442' },
      { title: 'Organic Chemistry', author: 'Morrison & Boyd', category: 'CHEM', isbn: '978-0136436690' },
      { title: 'University Physics', author: 'Young & Freedman', category: 'PHY', isbn: '978-0321973610' },
      { title: 'Indian Constitution', author: 'D.D. Basu', category: 'LAW', isbn: '978-9351432580' },
    ]
    for (const b of books) {
      await prisma.book.create({
        data: {
          collegeId: college.id,
          ...b,
          publisher: 'Pearson',
          edition: 'Latest',
          quantity: 5,
          available: 5,
          shelfLocation: `${b.category}-${Math.floor(Math.random() * 100)}`,
          price: 500 + Math.floor(Math.random() * 2000),
        },
      })
    }

    // Hostels
    const hostel1 = await prisma.hostel.create({
      data: {
        collegeId: college.id,
        name: 'Boys Hostel - Block A',
        type: 'BOYS',
        totalRooms: 50,
        totalBeds: 100,
        feePerYear: 40000,
        description: 'Boys hostel with all modern amenities',
      },
    })
    const hostel2 = await prisma.hostel.create({
      data: {
        collegeId: college.id,
        name: 'Girls Hostel - Block B',
        type: 'GIRLS',
        totalRooms: 50,
        totalBeds: 100,
        feePerYear: 40000,
        description: 'Girls hostel with all modern amenities',
      },
    })
    for (let i = 1; i <= 10; i++) {
      for (const h of [hostel1, hostel2]) {
        await prisma.hostelRoom.create({
          data: {
            hostelId: h.id,
            roomNo: `${i}01`,
            floor: 1,
            capacity: 2,
            occupied: Math.floor(Math.random() * 3),
            type: 'DOUBLE',
          },
        })
      }
    }

    // Transport
    const routes = [
      { name: 'Route 1 - City Center', vehicleNo: 'UP32-AB-1234', driverName: 'Ramesh Kumar', capacity: 40, feePerYear: 15000 },
      { name: 'Route 2 - Railway Station', vehicleNo: 'UP32-CD-5678', driverName: 'Suresh Yadav', capacity: 40, feePerYear: 15000 },
      { name: 'Route 3 - Airport', vehicleNo: 'UP32-EF-9012', driverName: 'Mahesh Singh', capacity: 30, feePerYear: 18000 },
    ]
    for (const r of routes) {
      await prisma.transportRoute.create({
        data: {
          collegeId: college.id,
          ...r,
          driverPhone: `+91${Math.floor(9000000000 + Math.random() * 999999999)}`,
          stops: JSON.stringify(['Stop 1', 'Stop 2', 'Stop 3', 'Stop 4']),
          startTime: '07:00',
          endTime: '17:00',
        },
      })
    }
  }
  console.log(`✅ Created library, hostel, transport for all colleges`)

  // ============== PLACEMENTS & RESEARCH ==============
  const placementDrives = [
    { company: 'TCS', designation: 'Software Engineer', package: 3.5, location: 'Pan India' },
    { company: 'Infosys', designation: 'Systems Engineer', package: 4.0, location: 'Pan India' },
    { company: 'Wipro', designation: 'Project Engineer', package: 3.75, location: 'Pan India' },
    { company: 'HCL', designation: 'Graduate Engineer Trainee', package: 4.5, location: 'Noida' },
    { company: 'Accenture', designation: 'Associate Software Engineer', package: 4.5, location: 'Bangalore' },
    { company: 'Cognizant', designation: 'Programmer Analyst Trainee', package: 4.0, location: 'Pune' },
    { company: 'Capgemini', designation: 'Analyst', package: 4.0, location: 'Mumbai' },
    { company: 'Amazon', designation: 'Software Development Engineer', package: 28.0, location: 'Bangalore' },
  ]
  for (const p of placementDrives) {
    await prisma.placementDrive.create({
      data: {
        collegeId: university.id,
        companyName: p.company,
        designation: p.designation,
        package: p.package,
        location: p.location,
        eligibility: 'B.Tech / MCA with 60% throughout',
        driveDate: new Date(Date.now() + Math.floor(Math.random() * 60) * 86400000),
        lastDate: new Date(Date.now() + 7 * 86400000),
        description: `Campus placement drive by ${p.company}`,
        status: 'SCHEDULED',
      },
    })
  }

  // Research projects
  const research = [
    { title: 'AI-based Healthcare Diagnostics', fundingAgency: 'DST', amount: 2500000, status: 'ONGOING' },
    { title: 'Quantum Computing Applications', fundingAgency: 'SERB', amount: 5000000, status: 'ONGOING' },
    { title: 'Sustainable Energy Solutions', fundingAgency: 'MNRE', amount: 3500000, status: 'COMPLETED' },
    { title: 'Smart City Infrastructure', fundingAgency: 'MoUD', amount: 4000000, status: 'ONGOING' },
    { title: 'Rural Education Technology', fundingAgency: 'UGC', amount: 1500000, status: 'COMPLETED' },
  ]
  for (const r of research) {
    await prisma.researchProject.create({
      data: {
        collegeId: university.id,
        title: r.title,
        fundingAgency: r.fundingAgency,
        amount: r.amount,
        startDate: new Date(2022 + Math.floor(Math.random() * 3), 0, 1),
        status: r.status,
        description: `Research project on ${r.title}`,
      },
    })
  }
  console.log(`✅ Created placement drives and research projects`)

  // ============== COMPLAINTS & FEEDBACK ==============
  const complaintsData = [
    { title: 'Wi-Fi not working in hostel', category: 'HOSTEL', priority: 'HIGH', status: 'OPEN' },
    { title: 'Library books outdated', category: 'ACADEMIC', priority: 'MEDIUM', status: 'IN_PROGRESS' },
    { title: 'Bus timing issue', category: 'TRANSPORT', priority: 'MEDIUM', status: 'OPEN' },
    { title: 'Lab equipment not functional', category: 'INFRASTRUCTURE', priority: 'HIGH', status: 'RESOLVED' },
  ]
  for (const c of complaintsData) {
    await prisma.complaint.create({
      data: {
        collegeId: university.id,
        ...c,
        description: c.title,
      },
    })
  }

  for (let i = 0; i < 10; i++) {
    await prisma.feedback.create({
      data: {
        type: ['STUDENT', 'FACULTY', 'PARENT', 'ANONYMOUS'][Math.floor(Math.random() * 4)],
        rating: Math.floor(Math.random() * 3) + 3,
        message: 'The university provides quality education and good infrastructure.',
        isAnonymous: Math.random() > 0.5,
        name: Math.random() > 0.5 ? 'Anonymous' : `${firstNames[Math.floor(Math.random() * 20)]} ${lastNames[Math.floor(Math.random() * 20)]}`,
      },
    })
  }
  console.log(`✅ Created complaints and feedback`)

  // ============== NOTIFICATIONS ==============
  const notifs = [
    { title: 'Welcome to TYS University ERP', message: 'Your account has been created successfully. Welcome aboard!', type: 'SUCCESS' },
    { title: 'Fee Payment Due', message: 'Your semester fee payment is due on March 31, 2025.', type: 'WARNING' },
    { title: 'New Notice Published', message: 'Examination schedule for end semester exam published.', type: 'INFO' },
    { title: 'Attendance Update', message: 'Your attendance is below 75%. Please regularize.', type: 'ERROR' },
    { title: 'Placement Drive', message: 'TCS campus placement drive on February 20.', type: 'INFO' },
  ]
  for (const n of notifs) {
    await prisma.notification.create({
      data: {
        userId: superAdminUser.id,
        ...n,
      },
    })
  }
  console.log(`✅ Created notifications`)

  // ============== SETTINGS ==============
  const settings = [
    { key: 'university_name', value: 'TYS University', category: 'GENERAL' },
    { key: 'university_address', value: 'University Campus, Knowledge City, Lucknow - 226001', category: 'GENERAL' },
    { key: 'contact_email', value: 'info@tysuniversity.edu', category: 'CONTACT' },
    { key: 'contact_phone', value: '+91-522-1234567', category: 'CONTACT' },
    { key: 'current_session', value: '2025-26', category: 'ACADEMIC' },
    { key: 'currency', value: 'INR', category: 'GENERAL' },
    { key: 'timezone', value: 'Asia/Kolkata', category: 'GENERAL' },
  ]
  for (const s of settings) {
    await prisma.setting.create({ data: s })
  }
  console.log(`✅ Created settings`)

  // Stats
  const stats = {
    colleges: await prisma.college.count(),
    students: await prisma.student.count(),
    employees: await prisma.employee.count(),
    programs: await prisma.program.count(),
    courses: await prisma.course.count(),
    sessions: await prisma.academicSession.count(),
    feePayments: await prisma.feePayment.count(),
    admissions: await prisma.admissionApplication.count(),
  }
  console.log('\n📊 SEED SUMMARY:')
  console.log(JSON.stringify(stats, null, 2))
  console.log('\n✅ Seeding complete!')
  console.log('\n🔐 DEMO LOGIN:')
  console.log('   Email: admin@tysuniversity.edu')
  console.log('   Password: demo_hash_password_2025')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
