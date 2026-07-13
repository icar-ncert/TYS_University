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

  const books = await db.book.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { _count: { select: { issues: true } } },
  })

  const totalBooks = await db.book.count({ where })
  const totalCopies = await db.book.aggregate({ where, _sum: { quantity: true, available: true } })
  const issued = await db.bookIssue.count({ where: { status: 'ISSUED' } })

  return NextResponse.json({
    books: books.map(b => ({
      id: b.id,
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      publisher: b.publisher,
      category: b.category,
      quantity: b.quantity,
      available: b.available,
      shelfLocation: b.shelfLocation,
      price: b.price,
      issues: b._count.issues,
    })),
    summary: {
      totalTitles: totalBooks,
      totalCopies: totalCopies._sum.quantity || 0,
      availableCopies: totalCopies._sum.available || 0,
      issued,
    },
  })
}
