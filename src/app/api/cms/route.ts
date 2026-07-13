import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const [news, notices, events, heroSlides, pages, galleryAlbums, downloads] = await Promise.all([
    db.news.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 10 }),
    db.notice.findMany({ orderBy: { publishedAt: 'desc' }, take: 15 }),
    db.event.findMany({ orderBy: { startDate: 'asc' }, take: 10 }),
    db.heroSlide.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
    db.cMSPage.findMany({ where: { status: 'PUBLISHED' }, select: { id: true, title: true, slug: true } }),
    db.galleryAlbum.findMany({ take: 6, include: { _count: { select: { photos: true } } } }),
    db.download.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
  ])

  return NextResponse.json({ news, notices, events, heroSlides, pages, galleryAlbums, downloads })
}
