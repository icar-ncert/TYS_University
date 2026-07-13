'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import {
  Building2, Users, School, GraduationCap, Calendar, Wallet, Library,
  BedDouble, Bus, Briefcase, FlaskConical, Megaphone, CalendarDays,
  Newspaper, Image as ImageIcon, Download, MessageSquareWarning,
  Shield, History, Settings, Bell, FileText, BookOpen, UserCog,
  Loader2, ExternalLink, MapPin, Phone, Mail, Globe2, Plus, DollarSign,
  TrendingUp, Users2, Award, CheckCircle2, AlertTriangle, Clock,
  Banknote
} from 'lucide-react'
import { useAppStore } from '@/lib/store/app-store'

const CHART_COLORS = ['#8B2635', '#C9A961', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4']

function useFetch(url: string) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(url)
      .then(r => r.json())
      .then(d => { if (!cancelled) { setData(d); setError(null); setLoading(false) } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false) } })
    return () => { cancelled = true }
  }, [url])

  return { data, loading, error }
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
      <span className="text-muted-foreground">Loading...</span>
    </div>
  )
}

function EmptyState({ icon: Icon, message }: { icon: any, message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="w-12 h-12 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

// ============== AFFILIATED COLLEGES ==============
export function CollegesView() {
  const { data, loading } = useFetch('/api/colleges')

  if (loading) return <LoadingState />
  const colleges = data?.colleges || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Building2 className="w-5 h-5" /> Affiliated Colleges
          </h2>
          <p className="text-sm text-muted-foreground">Multi-tenant architecture · {colleges.length} colleges</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add College</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {colleges.map((c: any) => (
          <Card key={c.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                {c.isUniversity ? (
                  <Badge className="bg-accent text-accent-foreground">University</Badge>
                ) : (
                  <Badge variant="outline">Affiliated</Badge>
                )}
              </div>
              <h3 className="font-semibold mb-1">{c.name}</h3>
              <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {c.city}, {c.state}
              </p>
              <div className="space-y-1 text-xs mb-3">
                <p className="flex items-center gap-1 text-muted-foreground">
                  <Globe2 className="w-3 h-3" /> {c.subdomain}.tysuniversity.edu
                </p>
                <p className="flex items-center gap-1 text-muted-foreground">
                  <Mail className="w-3 h-3" /> {c.email}
                </p>
                <p className="flex items-center gap-1 text-muted-foreground">
                  <Phone className="w-3 h-3" /> {c.phone}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                <div className="text-center">
                  <p className="font-bold text-sm">{c.students}</p>
                  <p className="text-[10px] text-muted-foreground">Students</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm">{c.employees}</p>
                  <p className="text-[10px] text-muted-foreground">Staff</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm">{c.schools}</p>
                  <p className="text-[10px] text-muted-foreground">Schools</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                <a href={`https://${c.subdomain}.tysuniversity.edu`} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" /> Visit Website
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============== SCHOOLS & DEPARTMENTS ==============
export function SchoolsView() {
  const { data, loading } = useFetch('/api/schools')

  if (loading) return <LoadingState />
  const schools = data?.schools || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <School className="w-5 h-5" /> Schools & Departments
          </h2>
          <p className="text-sm text-muted-foreground">{schools.length} schools across all colleges</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add School</Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {schools.map((s: any) => (
          <Card key={s.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{s.name}</CardTitle>
                <Badge variant="outline">{s.college}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-muted/50 rounded p-3 text-center">
                  <p className="text-xl font-bold text-primary">{s.departments}</p>
                  <p className="text-xs text-muted-foreground">Departments</p>
                </div>
                <div className="bg-muted/50 rounded p-3 text-center">
                  <p className="text-xl font-bold text-primary">{s.programs}</p>
                  <p className="text-xs text-muted-foreground">Programs</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground mb-2">DEPARTMENTS</p>
                {s.departmentsList?.map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between text-sm py-1.5 px-2 hover:bg-muted/50 rounded">
                    <span>{d.name}</span>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>{d.courses} courses</span>
                      <span>·</span>
                      <span>{d.employees} staff</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============== PROGRAMS ==============
export function ProgramsView() {
  const { data, loading } = useFetch('/api/programs')

  if (loading) return <LoadingState />
  const programs = data?.programs || []

  const typeColors: Record<string, string> = {
    UG: 'bg-blue-500',
    PG: 'bg-purple-500',
    PHD: 'bg-red-500',
    DIPLOMA: 'bg-orange-500',
    CERTIFICATE: 'bg-emerald-500',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <GraduationCap className="w-5 h-5" /> Academic Programs
          </h2>
          <p className="text-sm text-muted-foreground">{programs.length} programs across all schools</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Program</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Fee/Year</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>School</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.slice(0, 50).map((p: any) => (
                  <TableRow key={p.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.department}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{p.code}</TableCell>
                    <TableCell>
                      <Badge className={`${typeColors[p.type]} text-white`}>{p.type}</Badge>
                    </TableCell>
                    <TableCell>{p.duration} yrs</TableCell>
                    <TableCell>{p.totalSeats}</TableCell>
                    <TableCell>₹{(p.feePerYear || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{p.students}</span>
                        <Progress value={(p.students / p.totalSeats) * 100} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{p.school}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============== ACADEMIC SESSIONS ==============
export function SessionsView() {
  const { data, loading } = useFetch('/api/sessions')

  if (loading) return <LoadingState />
  const sessions = data?.sessions || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Academic Sessions
          </h2>
          <p className="text-sm text-muted-foreground">Session-wise data isolation · {sessions.length} sessions</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Create Session</Button>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="pt-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Currently Active Session</p>
              <p className="text-2xl font-bold">2025-26</p>
              <p className="text-sm text-muted-foreground">All reports default to this session · Switch any time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map((s: any) => (
          <Card key={s.id} className={s.isActive ? 'border-primary border-2' : ''}>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">{s.name}</h3>
                <div className="flex gap-1">
                  {s.isActive && <Badge className="bg-green-500">Active</Badge>}
                  {s.isArchived && <Badge variant="secondary">Archived</Badge>}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {new Date(s.startDate).toLocaleDateString()} - {new Date(s.endDate).toLocaleDateString()}
              </p>
              <Badge variant="outline" className="mb-3">{s.college}</Badge>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {s.students} students
                </div>
                <div className="flex items-center gap-1">
                  <Wallet className="w-3 h-3" /> {s.feePayments} payments
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {s.attendances} attendance
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3" /> {s.results} results
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============== EMPLOYEES ==============
export function EmployeesView() {
  const { data, loading } = useFetch('/api/employees?limit=50')
  const [search, setSearch] = useState('')

  if (loading) return <LoadingState />
  const employees = data?.employees || []

  const filtered = search
    ? employees.filter((e: any) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase())
      )
    : employees

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserCog className="w-5 h-5" /> Faculty & Staff
          </h2>
          <p className="text-sm text-muted-foreground">{employees.length} employees</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Employee</Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Input
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Salary</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e: any) => (
                  <TableRow key={e.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                          {e.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{e.name}</p>
                          <p className="text-xs text-muted-foreground">{e.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{e.employeeCode}</TableCell>
                    <TableCell className="text-sm">{e.designation}</TableCell>
                    <TableCell className="text-sm">{e.department}</TableCell>
                    <TableCell>
                      <Badge variant={e.employeeType === 'TEACHING' ? 'default' : 'secondary'}>
                        {e.employeeType === 'TEACHING' ? 'Faculty' : 'Staff'}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{(e.salary || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={e.status === 'ACTIVE' ? 'default' : 'outline'}>{e.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============== FEES ==============
export function FeesView() {
  const { data, loading } = useFetch('/api/fees')

  if (loading) return <LoadingState />
  const payments = data?.payments || []
  const summary = data?.summary || {}

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Wallet className="w-5 h-5" /> Fee Management
          </h2>
          <p className="text-sm text-muted-foreground">{summary.total} payments · Session 2025-26</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Collect Fee</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5">
            <DollarSign className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-2xl font-bold">₹{(summary.totalAmount || 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Collected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-2xl font-bold">{summary.total}</p>
            <p className="text-xs text-muted-foreground">Total Payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <Award className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-2xl font-bold">₹{(summary.totalDiscount || 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Discounts Given</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <AlertTriangle className="w-8 h-8 text-orange-600 mb-2" />
            <p className="text-2xl font-bold">₹{(summary.totalFine || 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Fines Collected</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Fee Payments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt No</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.slice(0, 30).map((p: any) => (
                  <TableRow key={p.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs">{p.receiptNo}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{p.student}</p>
                        <p className="text-xs text-muted-foreground">{p.enrollmentNo}</p>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{p.college}</Badge></TableCell>
                    <TableCell className="text-xs">{p.session}</TableCell>
                    <TableCell className="font-semibold">₹{p.netAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{p.paymentMode}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{new Date(p.paymentDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============== LIBRARY ==============
export function LibraryView() {
  const { data, loading } = useFetch('/api/library')

  if (loading) return <LoadingState />
  const books = data?.books || []
  const summary = data?.summary || {}

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Library className="w-5 h-5" /> Library Management
          </h2>
          <p className="text-sm text-muted-foreground">Centralized library across colleges</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Book</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-5">
          <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-2xl font-bold">{summary.totalTitles}</p>
          <p className="text-xs text-muted-foreground">Book Titles</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <Library className="w-8 h-8 text-purple-600 mb-2" />
          <p className="text-2xl font-bold">{summary.totalCopies}</p>
          <p className="text-xs text-muted-foreground">Total Copies</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <CheckCircle2 className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-2xl font-bold">{summary.availableCopies}</p>
          <p className="text-xs text-muted-foreground">Available</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5">
          <Clock className="w-8 h-8 text-orange-600 mb-2" />
          <p className="text-2xl font-bold">{summary.issued}</p>
          <p className="text-xs text-muted-foreground">Currently Issued</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Book Inventory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Shelf</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.slice(0, 30).map((b: any) => (
                  <TableRow key={b.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-sm">{b.title}</TableCell>
                    <TableCell className="text-sm">{b.author}</TableCell>
                    <TableCell><Badge variant="outline">{b.category}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{b.isbn || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={b.available > 0 ? 'default' : 'destructive'}>
                        {b.available} / {b.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{b.shelfLocation}</TableCell>
                    <TableCell>₹{b.price?.toLocaleString() || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============== HOSTEL ==============
export function HostelView() {
  const { data, loading } = useFetch('/api/hostel')

  if (loading) return <LoadingState />
  const hostels = data?.hostels || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BedDouble className="w-5 h-5" /> Hostel Management
          </h2>
          <p className="text-sm text-muted-foreground">{hostels.length} hostels</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Hostel</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hostels.map((h: any) => {
          const occupancy = h.totalCapacity > 0 ? (h.occupiedBeds / h.totalCapacity) * 100 : 0
          return (
            <Card key={h.id}>
              <CardContent className="pt-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BedDouble className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant={h.type === 'BOYS' ? 'default' : h.type === 'GIRLS' ? 'secondary' : 'outline'}>
                    {h.type}
                  </Badge>
                </div>
                <h3 className="font-semibold mb-1">{h.name}</h3>
                <div className="space-y-2 mt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Rooms</span>
                    <span className="font-medium">{h.totalRooms}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Beds</span>
                    <span className="font-medium">{h.totalBeds}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Occupied</span>
                    <span className="font-medium">{h.occupiedBeds} / {h.totalCapacity}</span>
                  </div>
                  <Progress value={occupancy} className="h-2" />
                  <p className="text-xs text-muted-foreground">{occupancy.toFixed(0)}% occupied</p>
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="text-muted-foreground">Fee/Year</span>
                    <span className="font-semibold text-primary">₹{h.feePerYear?.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ============== TRANSPORT ==============
export function TransportView() {
  const { data, loading } = useFetch('/api/transport')

  if (loading) return <LoadingState />
  const routes = data?.routes || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bus className="w-5 h-5" /> Transport Management
          </h2>
          <p className="text-sm text-muted-foreground">{routes.length} routes · GPS ready</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Route</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.map((r: any) => (
          <Card key={r.id}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bus className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="outline">{r.capacity} seats</Badge>
              </div>
              <h3 className="font-semibold mb-1">{r.name}</h3>
              <p className="text-xs text-muted-foreground mb-3 font-mono">{r.vehicleNo}</p>
              <div className="space-y-1 text-xs">
                <p className="flex items-center gap-1"><Users className="w-3 h-3" /> {r.driverName}</p>
                <p className="flex items-center gap-1"><Phone className="w-3 h-3" /> {r.driverPhone}</p>
                <p className="flex items-center gap-1"><Clock className="w-3 h-3" /> {r.startTime} - {r.endTime}</p>
                <p className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {r.stops?.length || 0} stops</p>
                <p className="flex items-center gap-1 pt-2 border-t"><Wallet className="w-3 h-3" /> ₹{r.feePerYear?.toLocaleString()}/year</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============== PLACEMENTS ==============
export function PlacementsView() {
  const { data, loading } = useFetch('/api/placements')

  if (loading) return <LoadingState />
  const drives = data?.drives || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="w-5 h-5" /> Placement Cell
          </h2>
          <p className="text-sm text-muted-foreground">{drives.length} placement drives</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Schedule Drive</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drives.map((d: any) => (
          <Card key={d.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
                  <Briefcase className="w-6 h-6" />
                </div>
                <Badge variant={d.status === 'SCHEDULED' ? 'default' : d.status === 'COMPLETED' ? 'secondary' : 'destructive'}>
                  {d.status}
                </Badge>
              </div>
              <h3 className="font-bold text-lg">{d.company}</h3>
              <p className="text-sm text-muted-foreground mb-2">{d.designation}</p>
              <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                <div className="bg-green-50 p-2 rounded">
                  <p className="text-muted-foreground">Package</p>
                  <p className="font-bold text-green-700">₹{d.package} LPA</p>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-muted-foreground">Applications</p>
                  <p className="font-bold text-blue-700">{d.applications}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t text-xs space-y-1">
                <p className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-3 h-3" /> {d.location || 'Pan India'}
                </p>
                <p className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-3 h-3" /> {new Date(d.driveDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============== RESEARCH ==============
export function ResearchView() {
  const { data, loading } = useFetch('/api/research')

  if (loading) return <LoadingState />
  const projects = data?.projects || []
  const totalFunding = data?.totalFunding || 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FlaskConical className="w-5 h-5" /> Research & Publications
          </h2>
          <p className="text-sm text-muted-foreground">{projects.length} projects · ₹{totalFunding.toLocaleString()} funding</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Project</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p: any) => (
          <Card key={p.id}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-purple-600" />
                </div>
                <Badge variant={p.status === 'ONGOING' ? 'default' : p.status === 'COMPLETED' ? 'secondary' : 'outline'}>
                  {p.status}
                </Badge>
              </div>
              <h3 className="font-semibold text-sm mb-2">{p.title}</h3>
              <div className="space-y-1 text-xs">
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">Funding Agency</span>
                  <span className="font-medium">{p.fundingAgency || 'N/A'}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold text-green-600">₹{(p.amount || 0).toLocaleString()}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">Started</span>
                  <span>{new Date(p.startDate).toLocaleDateString()}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============== COMPLAINTS ==============
export function ComplaintsView() {
  const { data, loading } = useFetch('/api/complaints')

  if (loading) return <LoadingState />
  const complaints = data?.complaints || []
  const summary = data?.summary || {}

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquareWarning className="w-5 h-5" /> Complaint Management
          </h2>
          <p className="text-sm text-muted-foreground">{complaints.length} total complaints</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Complaint</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">By Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={summary.byStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={(e: any) => `${e.name}: ${e.value}`}
                >
                  {summary.byStatus?.map((_: any, i: number) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">By Priority</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={summary.byPriority}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {summary.byPriority?.map((_: any, i: number) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">By Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={summary.byCategory} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {summary.byCategory?.map((_: any, i: number) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">All Complaints</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Raised By</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((c: any) => (
                  <TableRow key={c.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-sm">{c.title}</TableCell>
                    <TableCell><Badge variant="outline">{c.category}</Badge></TableCell>
                    <TableCell>
                      <Badge variant={c.priority === 'HIGH' || c.priority === 'URGENT' ? 'destructive' : 'secondary'}>
                        {c.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.status === 'RESOLVED' ? 'default' : c.status === 'OPEN' ? 'outline' : 'secondary'}>
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{c.student}</TableCell>
                    <TableCell><Badge variant="outline">{c.college}</Badge></TableCell>
                    <TableCell className="text-xs">{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============== NOTICES ==============
export function NoticesView() {
  const { data, loading } = useFetch('/api/cms')

  if (loading) return <LoadingState />
  const notices = data?.notices || []

  const categoryColors: Record<string, string> = {
    EXAM: 'bg-red-500',
    HOLIDAY: 'bg-orange-500',
    SCHOLARSHIP: 'bg-green-500',
    RECRUITMENT: 'bg-purple-500',
    TENDER: 'bg-blue-500',
    CIRCULAR: 'bg-gray-500',
    ACADEMIC: 'bg-cyan-500',
    URGENT: 'bg-red-700',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Megaphone className="w-5 h-5" /> Notice Management
          </h2>
          <p className="text-sm text-muted-foreground">{notices.length} notices published</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Publish Notice</Button>
      </div>

      <div className="space-y-3">
        {notices.map((n: any) => (
          <Card key={n.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {n.isPinned && <Badge className="bg-red-500">📌 Pinned</Badge>}
                    <Badge className={`${categoryColors[n.category] || 'bg-gray-500'} text-white`}>
                      {n.category}
                    </Badge>
                    {n.expiryDate && (
                      <span className="text-xs text-muted-foreground">
                        Expires: {new Date(n.expiryDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold mb-1">{n.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{n.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Published on {new Date(n.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============== EVENTS ==============
export function EventsView() {
  const { data, loading } = useFetch('/api/cms')

  if (loading) return <LoadingState />
  const events = data?.events || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CalendarDays className="w-5 h-5" /> Event Management
          </h2>
          <p className="text-sm text-muted-foreground">{events.length} events</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Create Event</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((e: any) => (
          <Card key={e.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-primary to-accent p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">{new Date(e.startDate).getDate()}</div>
                    <div className="text-sm">{new Date(e.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                  </div>
                  <Badge className="bg-white/20 text-white">{e.category}</Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{e.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{e.description}</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {e.venue && <p className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {e.venue}</p>}
                  <p className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(e.startDate).toLocaleDateString()} - {new Date(e.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============== NEWS ==============
export function NewsView() {
  const { data, loading } = useFetch('/api/cms')

  if (loading) return <LoadingState />
  const news = data?.news || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Newspaper className="w-5 h-5" /> News & Articles
          </h2>
          <p className="text-sm text-muted-foreground">{news.length} articles published</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Write Article</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {news.map((n: any) => (
          <Card key={n.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">{n.category}</Badge>
                {n.isFeatured && <Badge className="bg-accent text-accent-foreground">Featured</Badge>}
              </div>
              <h3 className="font-semibold mb-2 line-clamp-2">{n.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{n.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                <span>{new Date(n.publishedAt).toLocaleDateString()}</span>
                <Button variant="ghost" size="sm" className="h-6 text-xs">Read More</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============== ROLES & PERMISSIONS ==============
export function RolesView() {
  const { data, loading } = useFetch('/api/roles')

  if (loading) return <LoadingState />
  const roles = data?.roles || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5" /> Roles & Permissions
          </h2>
          <p className="text-sm text-muted-foreground">RBAC · {roles.length} roles configured</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Create Role</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((r: any) => (
          <Card key={r.id}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                {r.isSystem && <Badge variant="secondary">System</Badge>}
              </div>
              <h3 className="font-semibold">{r.displayName}</h3>
              <p className="text-xs text-muted-foreground mb-3">{r.description}</p>
              <div className="flex items-center justify-between text-sm pt-3 border-t">
                <span className="text-muted-foreground">Users</span>
                <Badge variant="outline">{r.users} users</Badge>
              </div>
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-1">Permissions</p>
                <code className="text-[10px] bg-muted px-2 py-1 rounded block break-all">{r.permissions}</code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ============== AUDIT LOGS ==============
export function AuditView() {
  const { data, loading } = useFetch('/api/audit')

  if (loading) return <LoadingState />
  const logs = data?.logs || []

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <History className="w-5 h-5" /> Audit Logs
        </h2>
        <p className="text-sm text-muted-foreground">{logs.length} recent activities</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((l: any) => (
                  <TableRow key={l.id} className="hover:bg-muted/50">
                    <TableCell className="text-sm font-medium">{l.user}</TableCell>
                    <TableCell>
                      <Badge variant={
                        l.action === 'CREATE' ? 'default' :
                        l.action === 'UPDATE' ? 'secondary' :
                        l.action === 'DELETE' ? 'destructive' : 'outline'
                      }>
                        {l.action}
                      </Badge>
                    </TableCell>
                    <TableCell><Badge variant="outline">{l.module}</Badge></TableCell>
                    <TableCell className="text-sm">{l.description}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(l.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============== SETTINGS ==============
export function SettingsView() {
  const { data, loading } = useFetch('/api/settings')

  if (loading) return <LoadingState />
  const settings = data?.settingsList || []

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Settings className="w-5 h-5" /> System Settings
        </h2>
        <p className="text-sm text-muted-foreground">Configure university-wide settings</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">General Settings</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {settings.filter((s: any) => s.category === 'GENERAL').map((s: any) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground capitalize">{s.key.replace(/_/g, ' ')}</span>
                <span className="font-medium">{s.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {settings.filter((s: any) => s.category === 'CONTACT').map((s: any) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground capitalize">{s.key.replace(/_/g, ' ')}</span>
                <span className="font-medium">{s.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Academic Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {settings.filter((s: any) => s.category === 'ACADEMIC').map((s: any) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground capitalize">{s.key.replace(/_/g, ' ')}</span>
                <span className="font-medium">{s.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">System Information</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">v1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Database</span>
              <span className="font-medium">PostgreSQL 15</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Multi-tenant</span>
              <Badge className="bg-green-500">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Session-based</span>
              <Badge className="bg-green-500">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Cache</span>
              <Badge variant="secondary">Redis</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Storage</span>
              <Badge variant="secondary">S3 Compatible</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ============== GENERIC PLACEHOLDER VIEW ==============
export function PlaceholderView({ title, icon: Icon, description }: { title: string, icon: any, description: string }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Icon className="w-5 h-5" /> {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Card>
        <CardContent className="py-12 text-center">
          <Icon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">{title} Module</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
            This module is part of the TYS University ERP. The backend schema, API endpoints, and UI components are ready to be implemented. The database tables for this module already exist.
          </p>
          <Button>Configure Module</Button>
        </CardContent>
      </Card>
    </div>
  )
}
