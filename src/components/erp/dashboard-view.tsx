'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, Legend
} from 'recharts'
import {
  Users, Building2, GraduationCap, Wallet, TrendingUp, TrendingDown,
  BookOpen, Briefcase, FlaskConical, AlertTriangle, ClipboardCheck,
  Award, FileText, Calendar, Bell, ArrowRight, Activity, DollarSign,
  Bus, BedDouble, Library, ChevronRight, UserCog
} from 'lucide-react'
import { useAppStore } from '@/lib/store/app-store'

interface DashboardData {
  stats: {
    totalColleges: number
    totalStudents: number
    totalEmployees: number
    totalPrograms: number
    totalCourses: number
    totalSessions: number
    totalFeePayments: number
    totalFeeCollected: number
    totalPlacements: number
    totalBooks: number
    totalResearch: number
    totalComplaints: number
    openComplaints: number
    totalNotices: number
    totalEvents: number
    attendancePercentage: number
  }
  charts: {
    studentsByType: { name: string; value: number }[]
    studentsByCollege: { name: string; fullName: string; count: number }[]
    monthlyFeeCollection: { name: string; value: number }[]
  }
  recentAdmissions: any[]
  user: any
}

const CHART_COLORS = ['#8B2635', '#C9A961', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']

export function DashboardView() {
  const { setView } = useAppStore()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-20 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!data) return null

  const { stats, charts, recentAdmissions, user } = data

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents.toLocaleString(), icon: Users, color: 'bg-blue-500', change: '+12%', trend: 'up' },
    { label: 'Affiliated Colleges', value: stats.totalColleges, icon: Building2, color: 'bg-orange-500', change: '+2', trend: 'up' },
    { label: 'Faculty & Staff', value: stats.totalEmployees.toLocaleString(), icon: UserCog, color: 'bg-emerald-500', change: '+5%', trend: 'up' },
    { label: 'Total Programs', value: stats.totalPrograms, icon: GraduationCap, color: 'bg-purple-500', change: '+8', trend: 'up' },
    { label: 'Fee Collected', value: `₹${(stats.totalFeeCollected / 100000).toFixed(1)}L`, icon: Wallet, color: 'bg-green-500', change: '+15%', trend: 'up' },
    { label: 'Placements', value: stats.totalPlacements, icon: Briefcase, color: 'bg-pink-500', change: '+3', trend: 'up' },
    { label: 'Research Projects', value: stats.totalResearch, icon: FlaskConical, color: 'bg-cyan-500', change: '+1', trend: 'up' },
    { label: 'Open Complaints', value: stats.openComplaints, icon: AlertTriangle, color: 'bg-red-500', change: '-2', trend: 'down' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <Card className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-0">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm opacity-90 mb-1">Welcome back,</p>
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-sm opacity-90 mt-1">
                {user?.roleDisplayName} · {user?.email}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setView('students')}>
                <Users className="w-4 h-4 mr-1" /> Manage Students
              </Button>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20" onClick={() => setView('reports')}>
                <Activity className="w-4 h-4 mr-1" /> View Reports
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <Badge variant={stat.trend === 'up' ? 'default' : 'destructive'} className="text-xs">
                  {stat.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {stat.change}
                </Badge>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Students by College */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Students by Affiliated College</span>
              <Button variant="ghost" size="sm" onClick={() => setView('colleges')}>
                View All <ChevronRight className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={charts.studentsByCollege.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Students" radius={[4, 4, 0, 0]}>
                  {charts.studentsByCollege.slice(0, 8).map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Students by Program Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Programs Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={charts.studentsByType}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(entry: any) => `${entry.name}: ${entry.value}`}
                  labelLine={false}
                >
                  {charts.studentsByType.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Fee collection + Recent admissions */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Monthly Fee Collection (Last 6 Months)</span>
              <Button variant="ghost" size="sm" onClick={() => setView('fees')}>
                View Details <ChevronRight className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={charts.monthlyFeeCollection}>
                <defs>
                  <linearGradient id="feeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B2635" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B2635" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: any) => [`₹${v.toLocaleString()}`, 'Collected']} />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Fee Collected"
                  stroke="#8B2635"
                  strokeWidth={2}
                  fill="url(#feeGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Recent Admissions</span>
              <Button variant="ghost" size="sm" onClick={() => setView('students')}>
                View All <ChevronRight className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentAdmissions.map((adm: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {adm.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{adm.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{adm.enrollmentNo} · {adm.college}</p>
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {adm.program.split(' ').slice(0, 2).join(' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions + attendance */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32 -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="#f0f0f0" strokeWidth="12" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - stats.attendancePercentage / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute">
                  <div className="text-3xl font-bold">{stats.attendancePercentage}%</div>
                  <div className="text-xs text-muted-foreground">Present</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">Average attendance for current session</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: 'Add Student', icon: Users, view: 'students' as const },
                { label: 'Publish Notice', icon: Bell, view: 'notices' as const },
                { label: 'Schedule Exam', icon: FileText, view: 'exams' as const },
                { label: 'Collect Fee', icon: Wallet, view: 'fees' as const },
                { label: 'Add College', icon: Building2, view: 'colleges' as const },
                { label: 'New Session', icon: Calendar, view: 'sessions' as const },
                { label: 'Library Issue', icon: Library, view: 'library' as const },
                { label: 'Hostel Allocate', icon: BedDouble, view: 'hostel' as const },
                { label: 'Transport Route', icon: Bus, view: 'transport' as const },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => setView(action.view)}
                  className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-muted hover:border-primary transition-colors text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <action.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module summary cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Notices Published', value: stats.totalNotices, icon: Bell, view: 'notices' as const, color: 'text-orange-600' },
          { label: 'Events Scheduled', value: stats.totalEvents, icon: Calendar, view: 'events' as const, color: 'text-purple-600' },
          { label: 'Books in Library', value: stats.totalBooks, icon: Library, view: 'library' as const, color: 'text-blue-600' },
          { label: 'Courses Available', value: stats.totalCourses, icon: BookOpen, view: 'courses' as const, color: 'text-emerald-600' },
        ].map((card, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setView(card.view)}>
            <CardContent className="pt-5 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
              <card.icon className={`w-8 h-8 ${card.color}`} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
