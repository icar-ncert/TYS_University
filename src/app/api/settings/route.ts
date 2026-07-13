import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const settings = await db.setting.findMany()
  const settingsObj: Record<string, any> = {}
  for (const s of settings) {
    settingsObj[s.key] = s.value
    settingsObj[s.category] = settingsObj[s.category] || {}
    settingsObj[s.category][s.key] = s.value
  }

  return NextResponse.json({ settings: settingsObj, settingsList: settings })
}
