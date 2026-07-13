'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Menu, X, Search, ChevronRight, GraduationCap, Building2, BookOpen,
  Trophy, FlaskConical, Briefcase, MapPin, Phone, Mail, Globe,
  Calendar, Megaphone, Newspaper, Download, Users, Award,
  ArrowRight, Facebook, Twitter, Instagram, Youtube, Linkedin, Globe2
} from 'lucide-react'
import { useAppStore } from '@/lib/store/app-store'

interface CMSData {
  news: any[]
  notices: any[]
  events: any[]
  heroSlides: any[]
  pages: any[]
  galleryAlbums: any[]
  downloads: any[]
}

export function PublicWebsite() {
  const { setMode } = useAppStore()
  const [data, setData] = useState<CMSData | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cms')
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false))
  }, [])

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Academics', href: '#academics' },
    { label: 'Admissions', href: '#admissions' },
    { label: 'Research', href: '#research' },
    { label: 'Campus Life', href: '#campus' },
    { label: 'Notices', href: '#notices' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground text-xs py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> +91-522-1234567</span>
            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> info@tysuniversity.edu</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:opacity-80">Student Login</a>
            <span>|</span>
            <a href="#" className="hover:opacity-80">Faculty Login</a>
            <span>|</span>
            <a href="#" className="hover:opacity-80">Staff Login</a>
            <span>|</span>
            <Button
              size="sm"
              variant="secondary"
              className="h-6 text-xs"
              onClick={() => setMode('login')}
            >
              Admin / ERP Login
            </Button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-primary">TYS University</h1>
                <p className="text-xs text-muted-foreground">Empowering Minds, Shaping Futures</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex"
                onClick={() => setMode('login')}
              >
                <Search className="w-4 h-4 mr-1" /> Search
              </Button>
              <Button
                size="sm"
                onClick={() => setMode('login')}
              >
                Apply Now <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>

          {menuOpen && (
            <div className="lg:hidden border-t py-4 space-y-2">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-sm font-medium hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Slider */}
        <section id="home" className="relative h-[500px] md:h-[600px] bg-gradient-to-br from-primary via-primary to-accent overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-3xl text-white">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-12 bg-white/20 rounded animate-pulse w-2/3" />
                  <div className="h-6 bg-white/20 rounded animate-pulse w-full" />
                  <div className="h-6 bg-white/20 rounded animate-pulse w-3/4" />
                </div>
              ) : data?.heroSlides[0] ? (
                <>
                  <Badge className="bg-accent text-accent-foreground mb-4">Admissions Open 2025-26</Badge>
                  <h2 className="text-4xl md:text-6xl font-bold mb-4">{data.heroSlides[0].title}</h2>
                  <p className="text-lg md:text-xl mb-8 text-white/90">{data.heroSlides[0].subtitle}</p>
                  <div className="flex flex-wrap gap-3">
                    <Button size="lg" variant="secondary">
                      {data.heroSlides[0].buttonText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                      Explore Programs
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-white">
                  <Badge className="bg-accent text-accent-foreground mb-4">Welcome</Badge>
                  <h2 className="text-4xl md:text-6xl font-bold mb-4">Welcome to TYS University</h2>
                  <p className="text-lg md:text-xl mb-8 text-white/90">A premier state university empowering minds and shaping futures through quality education.</p>
                  <Button size="lg" variant="secondary">Apply Now <ArrowRight className="w-4 h-4 ml-2" /></Button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Banner */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20">
            <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
              {[
                { icon: Building2, label: 'Affiliated Colleges', value: '30+' },
                { icon: Users, label: 'Active Students', value: '12,000+' },
                { icon: GraduationCap, label: 'Programs', value: '200+' },
                { icon: Award, label: 'Placement Rate', value: '95%' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <stat.icon className="w-6 h-6 mx-auto mb-1 text-accent" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Access Cards */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">Quick Access</h2>
              <p className="text-muted-foreground">Important links and resources for students, faculty, and staff</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: FileText, label: 'Online Admission', desc: 'Apply Now' },
                { icon: Calendar, label: 'Examination', desc: 'Schedule & Forms' },
                { icon: Wallet, label: 'Fee Payment', desc: 'Online Portal' },
                { icon: BookOpen, label: 'Library', desc: 'Digital Library' },
                { icon: Briefcase, label: 'Placement', desc: 'Career Cell' },
                { icon: Download, label: 'Downloads', desc: 'Forms & Docs' },
              ].map((card, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer text-center">
                  <CardContent className="pt-6 pb-4">
                    <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <card.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{card.label}</h3>
                    <p className="text-xs text-muted-foreground">{card.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Notices & News Section */}
        <section id="notices" className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Notices */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Megaphone className="w-5 h-5 text-primary" /> Notices & Announcements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                    {loading ? (
                      <div className="space-y-2">
                        {[1,2,3,4].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded" />)}
                      </div>
                    ) : data?.notices.slice(0, 6).map((notice: any) => (
                      <div key={notice.id} className="border-l-4 border-primary pl-3 py-2 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <Badge variant="outline" className="text-xs mb-1">{notice.category}</Badge>
                            <p className="text-sm font-medium line-clamp-2">{notice.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(notice.publishedAt).toLocaleDateString()}
                            </p>
                          </div>
                          {notice.isPinned && <Badge className="bg-red-500">Pinned</Badge>}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* News */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Newspaper className="w-5 h-5 text-primary" /> Latest News & Updates
                    </CardTitle>
                    <Button variant="ghost" size="sm">View All <ChevronRight className="w-4 h-4" /></Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {loading ? (
                        <div className="md:col-span-2 space-y-3">
                          {[1,2,3].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded" />)}
                        </div>
                      ) : data?.news.slice(0, 4).map((news: any) => (
                        <div key={news.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">{news.category}</Badge>
                            {news.isFeatured && <Badge className="bg-accent text-accent-foreground">Featured</Badge>}
                          </div>
                          <h4 className="font-semibold text-sm mb-2 line-clamp-2">{news.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{news.excerpt}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(news.publishedAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-3">About TYS University</Badge>
                <h2 className="text-3xl font-bold mb-4">A Legacy of Excellence in Higher Education</h2>
                <p className="text-muted-foreground mb-4">
                  TYS University, established in 2024, is a premier state university offering quality higher education across multiple disciplines. With 30+ affiliated colleges and over 12,000 students, we are committed to academic excellence, research innovation, and holistic development of our students.
                </p>
                <p className="text-muted-foreground mb-6">
                  Our university is dedicated to fostering an environment of intellectual curiosity, critical thinking, and creative expression. We offer undergraduate, postgraduate, and doctoral programs across six schools covering Engineering, Management, Sciences, Arts, Education, and Law.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">NAAC A+</p>
                      <p className="text-xs text-muted-foreground">Accredited</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">NIRF Ranked</p>
                      <p className="text-xs text-muted-foreground">Top 100</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Building2, label: 'Schools', value: '6' },
                  { icon: BookOpen, label: 'Departments', value: '20+' },
                  { icon: GraduationCap, label: 'Programs', value: '200+' },
                  { icon: FlaskConical, label: 'Research Centers', value: '15+' },
                  { icon: Users, label: 'Faculty', value: '500+' },
                  { icon: Briefcase, label: 'Placements', value: '95%' },
                ].map((stat, i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <stat.icon className="w-8 h-8 text-primary mb-2" />
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Schools Section */}
        <section id="academics" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-3">Academic Schools</Badge>
              <h2 className="text-3xl font-bold mb-2">Explore Our Schools</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Choose from six specialized schools offering world-class education and research opportunities</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'School of Engineering & Technology', icon: '⚙️', desc: 'B.Tech, M.Tech, PhD in CS, EC, ME, CE', programs: 4 },
                { name: 'School of Management Studies', icon: '📊', desc: 'MBA, BBA, B.Com, PhD', programs: 3 },
                { name: 'School of Sciences', icon: '🔬', desc: 'B.Sc, M.Sc in Physics, Chemistry, Maths, Bio', programs: 4 },
                { name: 'School of Arts & Humanities', icon: '📚', desc: 'B.A, M.A in English, Hindi, History, Sociology', programs: 3 },
                { name: 'School of Education', icon: '🎓', desc: 'B.Ed, M.Ed programs', programs: 2 },
                { name: 'School of Law', icon: '⚖️', desc: 'LL.B, LL.M programs', programs: 2 },
              ].map((school, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-primary/5 to-accent/5">
                    <div className="text-4xl mb-2">{school.icon}</div>
                    <CardTitle className="text-lg">{school.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-3">{school.desc}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{school.programs} Programs</Badge>
                      <Button variant="ghost" size="sm" className="text-primary">
                        Explore <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-3">Events</Badge>
              <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
              <p className="text-muted-foreground">Join us at our next big event</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                <div className="md:col-span-2 lg:col-span-4 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1,2,3,4].map(i => <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />)}
                </div>
              ) : data?.events.slice(0, 4).map((event: any) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-br from-primary to-accent p-4 text-white">
                      <div className="text-3xl font-bold">{new Date(event.startDate).getDate()}</div>
                      <div className="text-sm">{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                    </div>
                    <div className="p-4">
                      <Badge variant="outline" className="text-xs mb-2">{event.category}</Badge>
                      <h4 className="font-semibold text-sm mb-2 line-clamp-2">{event.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{event.description}</p>
                      {event.venue && <p className="text-xs flex items-center gap-1 text-muted-foreground"><MapPin className="w-3 h-3" /> {event.venue}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Affiliated Colleges */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-3">Multi-Tenant Architecture</Badge>
              <h2 className="text-3xl font-bold mb-2">Our Affiliated Colleges</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Each affiliated college operates on its own subdomain with independent administration, students, and faculty
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'TYS Mahavidyalaya', sub: 'tysmahavidyalaya', city: 'Lucknow' },
                { name: 'ABC College of Engineering', sub: 'abc', city: 'Kanpur' },
                { name: 'XYZ College of Management', sub: 'xyz', city: 'Varanasi' },
                { name: 'Saraswati Graduate College', sub: 'sgc', city: 'Gorakhpur' },
                { name: 'Vidya Science & Engineering College', sub: 'vsec', city: 'Agra' },
                { name: 'Radha Krishna College', sub: 'rkc', city: 'Meerut' },
              ].map((college, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <Globe2 className="w-3 h-3 mr-1" /> {college.sub}.tysuniversity.edu
                      </Badge>
                    </div>
                    <h4 className="font-semibold mb-1">{college.name}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {college.city}, UP
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <Badge className="mb-3">Get in Touch</Badge>
                <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
                <p className="text-muted-foreground mb-6">
                  Have questions? We're here to help. Reach out to us through any of the channels below.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-sm text-muted-foreground">University Campus, Knowledge City, Lucknow - 226001, Uttar Pradesh, India</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-sm text-muted-foreground">+91-522-1234567, +91-522-7654321</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-sm text-muted-foreground">info@tysuniversity.edu</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">Website</p>
                      <p className="text-sm text-muted-foreground">https://tysuniversity.edu</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
                    <a key={i} href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="First Name" />
                    <Input placeholder="Last Name" />
                  </div>
                  <Input placeholder="Email Address" type="email" />
                  <Input placeholder="Phone Number" />
                  <Input placeholder="Subject" />
                  <textarea
                    className="w-full min-h-[120px] p-3 border rounded-md text-sm"
                    placeholder="Your message..."
                  />
                  <Button className="w-full">Send Message</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Important Links / Footer */}
        <section className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <h3 className="text-xl font-bold mb-6 text-center">Important Links & Resources</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
              {['UGC', 'NAAC', 'NIRF', 'AISHE', 'ABC', 'NAD', 'DigiLocker', 'Scholarships'].map(link => (
                <a
                  key={link}
                  href="#"
                  className="bg-white/10 hover:bg-white/20 transition-colors rounded-lg p-3 text-center text-sm font-medium"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-white">TYS University</h3>
                  <p className="text-xs text-zinc-400">Empowering Minds</p>
                </div>
              </div>
              <p className="text-sm text-zinc-400">
                A premier state university committed to academic excellence, research innovation, and holistic development.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {['About University', 'Vision & Mission', 'Chancellor Message', 'NAAC', 'NIRF', 'Mandatory Disclosure'].map(link => (
                  <li key={link}><a href="#" className="hover:text-white">{link}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Academics</h4>
              <ul className="space-y-2 text-sm">
                {['Schools', 'Departments', 'Programs', 'Courses', 'Faculty', 'Library'].map(link => (
                  <li key={link}><a href="#" className="hover:text-white">{link}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                {['Student Portal', 'Faculty Portal', 'Employee Portal', 'Admissions', 'Examinations', 'Downloads'].map(link => (
                  <li key={link}><a href="#" className="hover:text-white">{link}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-zinc-400">
            <p>© 2025 TYS University. All Rights Reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Add FileText, Wallet icons
import { FileText, Wallet } from 'lucide-react'
