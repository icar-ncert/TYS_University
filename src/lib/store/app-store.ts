// Navigation state management using Zustand

import { create } from 'zustand'

export type ERPView =
  | 'dashboard'
  | 'colleges'
  | 'schools'
  | 'programs'
  | 'courses'
  | 'sessions'
  | 'students'
  | 'employees'
  | 'admissions'
  | 'fees'
  | 'attendance'
  | 'exams'
  | 'results'
  | 'library'
  | 'hostel'
  | 'transport'
  | 'placements'
  | 'research'
  | 'alumni'
  | 'hr'
  | 'recruitment'
  | 'payroll'
  | 'cms'
  | 'notices'
  | 'events'
  | 'news'
  | 'gallery'
  | 'downloads'
  | 'complaints'
  | 'feedback'
  | 'reports'
  | 'notifications'
  | 'users'
  | 'roles'
  | 'audit'
  | 'settings'

export type AppMode = 'public' | 'login' | 'erp'

interface AppState {
  mode: AppMode
  view: ERPView
  user: any | null
  setMode: (mode: AppMode) => void
  setView: (view: ERPView) => void
  setUser: (user: any | null) => void
  logout: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  mode: 'public',
  view: 'dashboard',
  user: null,
  setMode: (mode) => set({ mode }),
  setView: (view) => set({ view }),
  setUser: (user) => set({ user, mode: user ? 'erp' : 'public' }),
  logout: () => {
    fetch('/api/auth/logout', { method: 'POST' })
    set({ user: null, mode: 'public', view: 'dashboard' })
  },
}))

// Module config for sidebar
export const MODULE_GROUPS: { label: string; icon: string; items: { view: ERPView; label: string; icon: string }[] }[] = [
  {
    label: 'Overview',
    icon: 'LayoutDashboard',
    items: [
      { view: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
      { view: 'reports', label: 'Reports & Analytics', icon: 'BarChart3' },
      { view: 'notifications', label: 'Notifications', icon: 'Bell' },
    ],
  },
  {
    label: 'University Structure',
    icon: 'Building2',
    items: [
      { view: 'colleges', label: 'Affiliated Colleges', icon: 'Building2' },
      { view: 'schools', label: 'Schools & Departments', icon: 'School' },
      { view: 'programs', label: 'Programs', icon: 'GraduationCap' },
      { view: 'courses', label: 'Courses & Subjects', icon: 'BookOpen' },
      { view: 'sessions', label: 'Academic Sessions', icon: 'Calendar' },
    ],
  },
  {
    label: 'Academics',
    icon: 'GraduationCap',
    items: [
      { view: 'students', label: 'Students', icon: 'Users' },
      { view: 'employees', label: 'Faculty & Staff', icon: 'UserCog' },
      { view: 'admissions', label: 'Admissions', icon: 'FileText' },
      { view: 'attendance', label: 'Attendance', icon: 'ClipboardCheck' },
      { view: 'exams', label: 'Examinations', icon: 'FileCheck' },
      { view: 'results', label: 'Results', icon: 'Award' },
    ],
  },
  {
    label: 'Finance & HR',
    icon: 'DollarSign',
    items: [
      { view: 'fees', label: 'Fee Management', icon: 'Wallet' },
      { view: 'payroll', label: 'Payroll', icon: 'Banknote' },
      { view: 'hr', label: 'HR Management', icon: 'UserCog' },
      { view: 'recruitment', label: 'Recruitment', icon: 'UserPlus' },
    ],
  },
  {
    label: 'Facilities',
    icon: 'Building',
    items: [
      { view: 'library', label: 'Library', icon: 'Library' },
      { view: 'hostel', label: 'Hostel', icon: 'BedDouble' },
      { view: 'transport', label: 'Transport', icon: 'Bus' },
    ],
  },
  {
    label: 'Career & Research',
    icon: 'Briefcase',
    items: [
      { view: 'placements', label: 'Placement Cell', icon: 'Briefcase' },
      { view: 'research', label: 'Research', icon: 'FlaskConical' },
      { view: 'alumni', label: 'Alumni', icon: 'Users2' },
    ],
  },
  {
    label: 'CMS & Communication',
    icon: 'Globe',
    items: [
      { view: 'cms', label: 'Website Pages', icon: 'FileText' },
      { view: 'notices', label: 'Notices', icon: 'Megaphone' },
      { view: 'events', label: 'Events', icon: 'CalendarDays' },
      { view: 'news', label: 'News & Articles', icon: 'Newspaper' },
      { view: 'gallery', label: 'Gallery', icon: 'Image' },
      { view: 'downloads', label: 'Downloads', icon: 'Download' },
      { view: 'complaints', label: 'Complaints', icon: 'MessageSquareWarning' },
      { view: 'feedback', label: 'Feedback', icon: 'MessageCircle' },
    ],
  },
  {
    label: 'System',
    icon: 'Settings',
    items: [
      { view: 'users', label: 'User Management', icon: 'Users' },
      { view: 'roles', label: 'Roles & Permissions', icon: 'Shield' },
      { view: 'audit', label: 'Audit Logs', icon: 'History' },
      { view: 'settings', label: 'Settings', icon: 'Settings' },
    ],
  },
]
