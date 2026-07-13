import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const collegeId = searchParams.get('collegeId')
  const sessionId = searchParams.get('sessionId')

  const where: any = {}
  if (collegeId) where.collegeId = collegeId
  if (sessionId) where.sessionId = sessionId

  if (user.collegeId && user.roleName !== 'SUPER_ADMIN' && user.roleName !== 'UNIVERSITY_ADMIN') {
    where.collegeId = user.collegeId
  }

  const [payments, agg] = await Promise.all([
    db.feePayment.findMany({
      where,
      orderBy: { paymentDate: 'desc' },
      take: 100,
      include: { student: true, session: true, college: true },
    }),
    db.feePayment.aggregate({
      where,
      _sum: { amount: true, discount: true, fine: true },
      _count: true,
    }),
  ])

  return NextResponse.json({
    payments: payments.map(p => ({
      id: p.id,
      receiptNo: p.receiptNo,
      student: p.student?.fullName || 'N/A',
      enrollmentNo: p.student?.enrollmentNo || 'N/A',
      college: p.college?.shortName || 'N/A',
      session: p.session?.name || 'N/A',
      amount: p.amount,
      discount: p.discount,
      fine: p.fine,
      netAmount: p.amount - p.discount + p.fine,
      paymentMode: p.paymentMode,
      transactionId: p.transactionId,
      paymentDate: p.paymentDate,
    })),
    summary: {
      total: agg._count,
      totalAmount: agg._sum.amount || 0,
      totalDiscount: agg._sum.discount || 0,
      totalFine: agg._sum.fine || 0,
      netCollected: (agg._sum.amount || 0) - (agg._sum.discount || 0) + (agg._sum.fine || 0),
    },
  })
}
