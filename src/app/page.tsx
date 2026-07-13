'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store/app-store'
import { PublicWebsite } from '@/components/public/public-website'
import { LoginScreen } from '@/components/auth/login-screen'
import { ERPLayout } from '@/components/erp/erp-layout'
import { DashboardView } from '@/components/erp/dashboard-view'
import { StudentsView } from '@/components/erp/students-view'
import { ReportsView } from '@/components/erp/reports-view'
import {
  CollegesView, SchoolsView, ProgramsView, SessionsView, EmployeesView,
  FeesView, LibraryView, HostelView, TransportView, PlacementsView,
  ResearchView, ComplaintsView, NoticesView, EventsView, NewsView,
  RolesView, AuditView, SettingsView, PlaceholderView
} from '@/components/erp/module-views'
import {
  FileText, FileCheck, Award, Banknote, UserCog, UserPlus,
  Image as ImageIcon, Download, MessageCircle, Bell, Users,
  Calendar, BookOpen, Globe
} from 'lucide-react'

export default function Home() {
  const { mode, view, setUser, setMode } = useAppStore()

  // Check existing session on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(() => {})
  }, [])

  // Render based on mode
  if (mode === 'login') {
    return <LoginScreen />
  }

  if (mode === 'public' || !useAppStore.getState().user) {
    return <PublicWebsite />
  }

  // ERP mode - render based on selected view
  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <DashboardView />
      case 'colleges':
        return <CollegesView />
      case 'schools':
        return <SchoolsView />
      case 'programs':
        return <ProgramsView />
      case 'courses':
        return <PlaceholderView title="Courses & Subjects" icon={BookOpen} description="Manage all courses and subjects across programs" />
      case 'sessions':
        return <SessionsView />
      case 'students':
        return <StudentsView />
      case 'employees':
        return <EmployeesView />
      case 'admissions':
        return <PlaceholderView title="Admission Portal" icon={FileText} description="Online admission applications, merit lists, enrollment" />
      case 'fees':
        return <FeesView />
      case 'attendance':
        return <PlaceholderView title="Attendance System" icon={Calendar} description="Student, faculty, and employee attendance with QR support" />
      case 'exams':
        return <PlaceholderView title="Examination ERP" icon={FileCheck} description="Exam schedules, hall tickets, marks entry, results" />
      case 'results':
        return <PlaceholderView title="Results & Transcripts" icon={Award} description="Grade cards, transcripts, CGPA, revaluation" />
      case 'library':
        return <LibraryView />
      case 'hostel':
        return <HostelView />
      case 'transport':
        return <TransportView />
      case 'placements':
        return <PlacementsView />
      case 'research':
        return <ResearchView />
      case 'alumni':
        return <PlaceholderView title="Alumni Network" icon={Users} description="Alumni directory, donations, events, networking" />
      case 'hr':
        return <PlaceholderView title="HR Management" icon={UserCog} description="Employee master, recruitment, leave, payroll, service records" />
      case 'recruitment':
        return <PlaceholderView title="Recruitment Portal" icon={UserPlus} description="Vacancies, applications, shortlisting, interviews, appointments" />
      case 'payroll':
        return <PlaceholderView title="Payroll Management" icon={Banknote} description="Salary processing, payslips, increments, deductions" />
      case 'cms':
        return <PlaceholderView title="Website CMS" icon={Globe} description="Manage website pages, menus, widgets, blocks, SEO" />
      case 'notices':
        return <NoticesView />
      case 'events':
        return <EventsView />
      case 'news':
        return <NewsView />
      case 'gallery':
        return <PlaceholderView title="Gallery" icon={ImageIcon} description="Albums, photos, videos, categories, tags" />
      case 'downloads':
        return <PlaceholderView title="Downloads" icon={Download} description="Forms, prospectus, reports, syllabus, timetables, brochures" />
      case 'complaints':
        return <ComplaintsView />
      case 'feedback':
        return <PlaceholderView title="Feedback System" icon={MessageCircle} description="Student, faculty, parent, employer, anonymous feedback" />
      case 'reports':
        return <ReportsView />
      case 'notifications':
        return <PlaceholderView title="Notifications" icon={Bell} description="Email, SMS, WhatsApp, push, in-app notifications" />
      case 'users':
        return <PlaceholderView title="User Management" icon={Users} description="Manage all system users across colleges and roles" />
      case 'roles':
        return <RolesView />
      case 'audit':
        return <AuditView />
      case 'settings':
        return <SettingsView />
      default:
        return <DashboardView />
    }
  }

  return <ERPLayout>{renderView()}</ERPLayout>
}
