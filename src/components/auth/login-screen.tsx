'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  GraduationCap, ArrowLeft, Eye, EyeOff, LogIn, Shield, Users,
  UserCog, Building2, Loader2, KeyRound, Mail
} from 'lucide-react'
import { useAppStore } from '@/lib/store/app-store'

export function LoginScreen() {
  const { setMode, setUser } = useAppStore()
  const [email, setEmail] = useState('admin@tysuniversity.edu')
  const [password, setPassword] = useState('demo123')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Login failed')
        return
      }

      toast.success(`Welcome back, ${data.user.name}!`)
      setUser(data.user)
    } catch (err) {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const demoAccounts = [
    { role: 'University Admin', email: 'admin@tysuniversity.edu', icon: Shield, color: 'bg-red-500' },
    { role: 'College Admin', email: 'college.admin@abc.tysuniversity.edu', icon: Building2, color: 'bg-orange-500' },
    { role: 'Faculty', email: 'faculty@tysmahavidyalaya.tysuniversity.edu', icon: UserCog, color: 'bg-emerald-500' },
    { role: 'Student', email: 'student@tysmahavidyalaya.tysuniversity.edu', icon: Users, color: 'bg-blue-500' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary via-primary to-zinc-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
            onClick={() => setMode('public')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Website
          </Button>
          <div className="flex items-center gap-2 text-white">
            <GraduationCap className="w-6 h-6" />
            <span className="font-bold">TYS University ERP</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <div className="hidden lg:block text-white space-y-6">
            <Badge className="bg-accent text-accent-foreground">Enterprise ERP System</Badge>
            <h1 className="text-4xl font-bold leading-tight">
              TYS University<br />Management ERP
            </h1>
            <p className="text-white/80 text-lg">
              Complete enterprise-grade ERP for managing universities, affiliated colleges,
              students, faculty, examinations, finance, and more.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { label: 'Modules', value: '40+' },
                { label: 'Affiliated Colleges', value: '30+' },
                { label: 'Active Users', value: '12K+' },
                { label: 'API Endpoints', value: '1000+' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-accent">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Login form */}
          <Card className="shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <LogIn className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Sign In</CardTitle>
                  <p className="text-sm text-muted-foreground">Enter your credentials to access ERP</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@tysuniversity.edu"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPwd ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</>
                  ) : (
                    <>Sign In to ERP</>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t">
                <p className="text-xs font-semibold text-muted-foreground mb-3 text-center">
                  DEMO ACCOUNTS - Click to autofill
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {demoAccounts.map(acc => (
                    <button
                      key={acc.email}
                      onClick={() => { setEmail(acc.email); setPassword('demo123') }}
                      className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted transition-colors text-left"
                    >
                      <div className={`w-7 h-7 rounded-full ${acc.color} flex items-center justify-center flex-shrink-0`}>
                        <acc.icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{acc.role}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{acc.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-center text-muted-foreground mt-3">
                  Password for all demo accounts: <code className="bg-muted px-1 rounded">demo123</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
