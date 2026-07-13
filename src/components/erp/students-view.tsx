'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Users, Search, Plus, Download, Filter, MoreVertical, Eye, Edit,
  Mail, Phone, MapPin, Calendar, GraduationCap, Loader2, X,
  ChevronLeft, ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'

export function StudentsView() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [colleges, setColleges] = useState([])
  const [programs, setPrograms] = useState([])
  const [newStudent, setNewStudent] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    gender: 'MALE', category: 'GENERAL', collegeId: '', programId: '',
    fatherName: '', motherName: '', guardianPhone: '',
    dateOfBirth: '', permanentAddress: '',
  })

  useEffect(() => {
    fetchStudents()
    fetchColleges()
  }, [page, search, statusFilter])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '15',
        ...(search && { search }),
        ...(statusFilter !== 'ALL' && { status: statusFilter }),
      })
      const res = await fetch(`/api/students?${params}`)
      const data = await res.json()
      setStudents(data.students || [])
      setTotalPages(data.pagination?.totalPages || 1)
      setTotal(data.pagination?.total || 0)
    } catch (err) {
      toast.error('Failed to fetch students')
    } finally {
      setLoading(false)
    }
  }

  const fetchColleges = async () => {
    const res = await fetch('/api/colleges')
    const data = await res.json()
    setColleges(data.colleges || [])
  }

  const fetchPrograms = async (collegeId: string) => {
    const res = await fetch(`/api/programs?collegeId=${collegeId}`)
    const data = await res.json()
    setPrograms(data.programs || [])
  }

  const handleAddStudent = async () => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to create student')
        return
      }
      toast.success('Student created successfully!')
      setShowAddModal(false)
      setNewStudent({
        firstName: '', lastName: '', email: '', phone: '',
        gender: 'MALE', category: 'GENERAL', collegeId: '', programId: '',
        fatherName: '', motherName: '', guardianPhone: '',
        dateOfBirth: '', permanentAddress: '',
      })
      fetchStudents()
    } catch (err) {
      toast.error('Network error')
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5" /> Student Information System
          </h2>
          <p className="text-sm text-muted-foreground">Manage all students across colleges · {total} total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" /> Export
          </Button>
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add Student
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, enrollment no, email, phone..."
                className="pl-9"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="GRADUATED">Graduated</SelectItem>
                <SelectItem value="DROPPED">Dropped</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No students found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Enrollment No</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map(s => (
                    <TableRow key={s.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {s.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{s.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{s.enrollmentNo}</TableCell>
                      <TableCell className="text-sm">{s.program}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{s.college}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{s.currentSemester !== 'N/A' ? `Sem ${s.currentSemester}` : '-'}</TableCell>
                      <TableCell>
                        <Badge variant={s.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {s.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setSelectedStudent(s)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} · {total} total students
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>First Name *</Label>
                <Input
                  value={newStudent.firstName}
                  onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
                />
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input
                  value={newStudent.lastName}
                  onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Gender</Label>
                <Select
                  value={newStudent.gender}
                  onValueChange={(v) => setNewStudent({ ...newStudent, gender: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={newStudent.category}
                  onValueChange={(v) => setNewStudent({ ...newStudent, category: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GENERAL">General</SelectItem>
                    <SelectItem value="OBC">OBC</SelectItem>
                    <SelectItem value="SC">SC</SelectItem>
                    <SelectItem value="ST">ST</SelectItem>
                    <SelectItem value="EWS">EWS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>College *</Label>
                <Select
                  value={newStudent.collegeId}
                  onValueChange={(v) => {
                    setNewStudent({ ...newStudent, collegeId: v, programId: '' })
                    fetchPrograms(v)
                  }}
                >
                  <SelectTrigger><SelectValue placeholder="Select college" /></SelectTrigger>
                  <SelectContent>
                    {colleges.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Program *</Label>
                <Select
                  value={newStudent.programId}
                  onValueChange={(v) => setNewStudent({ ...newStudent, programId: v })}
                  disabled={!newStudent.collegeId}
                >
                  <SelectTrigger><SelectValue placeholder="Select program" /></SelectTrigger>
                  <SelectContent>
                    {programs.map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Father's Name</Label>
                <Input
                  value={newStudent.fatherName}
                  onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
                />
              </div>
              <div>
                <Label>Mother's Name</Label>
                <Input
                  value={newStudent.motherName}
                  onChange={(e) => setNewStudent({ ...newStudent, motherName: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={newStudent.dateOfBirth}
                  onChange={(e) => setNewStudent({ ...newStudent, dateOfBirth: e.target.value })}
                />
              </div>
              <div>
                <Label>Guardian Phone</Label>
                <Input
                  value={newStudent.guardianPhone}
                  onChange={(e) => setNewStudent({ ...newStudent, guardianPhone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Permanent Address</Label>
              <Input
                value={newStudent.permanentAddress}
                onChange={(e) => setNewStudent({ ...newStudent, permanentAddress: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddStudent}>Create Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Student Detail Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-semibold">
                  {selectedStudent.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedStudent.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedStudent.enrollmentNo}</p>
                  <Badge variant="outline" className="mt-1">{selectedStudent.status}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedStudent.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedStudent.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gender</p>
                  <p className="font-medium">{selectedStudent.gender || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-medium">{selectedStudent.category || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Program</p>
                  <p className="font-medium">{selectedStudent.program}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">College</p>
                  <p className="font-medium">{selectedStudent.collegeName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Semester</p>
                  <p className="font-medium">{selectedStudent.currentSemester}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Session</p>
                  <p className="font-medium">{selectedStudent.session}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Admission Date</p>
                  <p className="font-medium">{new Date(selectedStudent.admissionDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedStudent(null)}>Close</Button>
            <Button>Edit Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
