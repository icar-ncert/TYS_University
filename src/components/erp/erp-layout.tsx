'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  ScrollArea
} from '@/components/ui/scroll-area'
import {
  GraduationCap, Search, Bell, ChevronDown, LogOut, Menu, X,
  LayoutDashboard, Building2, School, GraduationCap as GradCap,
  BookOpen, Calendar, Users, UserCog, FileText, ClipboardCheck,
  FileCheck, Award, Wallet, Banknote, UserPlus,
  Library, BedDouble, Bus, Briefcase, FlaskConical, Users2,
  Globe, Megaphone, CalendarDays, Newspaper, Image, Download,
  MessageSquareWarning, MessageCircle, BarChart3, Shield,
  History, Settings, ChevronRight, Building
} from 'lucide-react'
import { useAppStore, MODULE_GROUPS, type ERPView } from '@/lib/store/app-store'

const ICONS: Record<string, any> = {
  LayoutDashboard, Building2, School, GraduationCap, BookOpen, Calendar,
  Users, UserCog, FileText, ClipboardCheck, FileCheck, Award,
  Wallet, Banknote, UserCog, UserPlus, Library, BedDouble, Bus,
  Briefcase, FlaskConical, Users2, Globe, Megaphone, CalendarDays,
  Newspaper, Image, Download, MessageSquareWarning, MessageCircle,
  BarChart3, Bell, Shield, History, Settings
}

export function ERPLayout({ children }: { children: React.ReactNode }) {
  const { user, view, setView, logout } = useAppStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [search, setSearch] = useState('')

  const currentViewLabel = MODULE_GROUPS
    .flatMap(g => g.items)
    .find(item => item.view === view)?.label || 'Dashboard'

  const handleNavClick = (v: ERPView) => {
    setView(v)
    setMobileOpen(false)
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 fixed inset-y-0 left-0 z-30`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-sm text-sidebar-foreground truncate">TYS University</h1>
                <p className="text-xs text-muted-foreground truncate">ERP System</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-2">
          <nav className="space-y-1 px-2">
            {MODULE_GROUPS.map(group => (
              <div key={group.label} className="mb-2">
                {sidebarOpen && (
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-1.5">
                    {group.label}
                  </p>
                )}
                {!sidebarOpen && <div className="h-px bg-border my-2 mx-2" />}
                <div className="space-y-0.5">
                  {group.items.map(item => {
                    const Icon = ICONS[item.icon] || LayoutDashboard
                    const isActive = view === item.view
                    return (
                      <button
                        key={item.view}
                        onClick={() => handleNavClick(item.view)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                          isActive
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        }`}
                        title={sidebarOpen ? undefined : item.label}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {sidebarOpen && <span className="truncate">{item.label}</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* User info at bottom */}
        <div className="p-3 border-t border-sidebar-border">
          <div className={`flex items-center gap-2 ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm flex-shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-medium truncate">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.roleDisplayName}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-sidebar border-r flex flex-col">
            <div className="h-16 flex items-center justify-between px-4 border-b">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary" />
                <span className="font-bold">TYS ERP</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <ScrollArea className="flex-1 py-2">
              <nav className="space-y-1 px-2">
                {MODULE_GROUPS.map(group => (
                  <div key={group.label} className="mb-2">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-1.5">
                      {group.label}
                    </p>
                    {group.items.map(item => {
                      const Icon = ICONS[item.icon] || LayoutDashboard
                      const isActive = view === item.view
                      return (
                        <button
                          key={item.view}
                          onClick={() => handleNavClick(item.view)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                            isActive
                              ? 'bg-primary text-primary-foreground font-medium'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      )
                    })}
                  </div>
                ))}
              </nav>
            </ScrollArea>
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className={`flex-1 flex flex-col min-w-0 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top header */}
        <header className="h-16 bg-white border-b sticky top-0 z-20 flex items-center justify-between px-4 lg:px-6 gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden flex-shrink-0"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h2 className="font-semibold text-base truncate">{currentViewLabel}</h2>
              <p className="text-xs text-muted-foreground hidden sm:block">
                TYS University ERP / {currentViewLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Session badge */}
            <Badge className="hidden sm:flex bg-accent text-accent-foreground">
              Session: 2025-26
            </Badge>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b">
                    <p className="font-semibold text-sm">Notifications</p>
                  </div>
                  <ScrollArea className="max-h-80">
                    <div className="p-2 space-y-1">
                      {[
                        { title: 'New admission application', time: '5 min ago', type: 'success' },
                        { title: 'Fee payment received', time: '1 hour ago', type: 'info' },
                        { title: 'Attendance below 75%', time: '3 hours ago', type: 'warning' },
                        { title: 'New notice published', time: '5 hours ago', type: 'info' },
                        { title: 'Exam schedule updated', time: '1 day ago', type: 'info' },
                      ].map((n, i) => (
                        <div key={i} className="p-2 hover:bg-muted rounded text-sm cursor-pointer">
                          <p className="font-medium">{n.title}</p>
                          <p className="text-xs text-muted-foreground">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-2 border-t text-center">
                    <Button variant="ghost" size="sm" className="w-full text-xs">
                      View All Notifications
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <Button
                variant="ghost"
                className="gap-2 px-2"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium leading-tight">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.roleDisplayName}</p>
                </div>
                <ChevronDown className="w-4 h-4 hidden md:block" />
              </Button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b">
                    <p className="font-semibold text-sm">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <Badge className="mt-2" variant="secondary">{user?.roleDisplayName}</Badge>
                  </div>
                  <div className="p-1">
                    <button className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm flex items-center gap-2">
                      <Users className="w-4 h-4" /> My Profile
                    </button>
                    <button className="w-full text-left px-3 py-2 hover:bg-muted rounded text-sm flex items-center gap-2">
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false) }}
                      className="w-full text-left px-3 py-2 hover:bg-red-50 hover:text-red-600 rounded text-sm flex items-center gap-2 text-red-600"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
