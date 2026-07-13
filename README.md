# TYS University Management ERP

> Enterprise-grade University ERP with multi-tenant architecture, session-aware academics, and CMS-driven public website. Built with Next.js 16, TypeScript, Tailwind CSS, Prisma, and shadcn/ui.

![TYS University](https://img.shields.io/badge/TYS-University-8B2635?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Quick Start (Local)](#-quick-start-local)
4. [Free Hosting Options](#-free-hosting-options)
5. [Own Server (VPS) Deployment](#-own-server-vps-deployment)
6. [Demo Login](#-demo-login)
7. [Project Structure](#-project-structure)
8. [API Documentation](#-api-documentation)
9. [Database Schema](#-database-schema)
10. [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### Public Website (CMS-driven)
- Hero slider with dynamic slides
- News, Notices, Events management
- 6 academic schools showcase
- Affiliated colleges listing with subdomain URLs
- Gallery, Downloads, Contact form
- SEO-optimized pages

### ERP Modules (35+ modules)
- **University Structure**: Colleges, Schools, Departments, Programs, Courses, Subjects
- **Academic Sessions**: 2023-24, 2024-25, 2025-26 (session-aware data)
- **Student Information System**: Full CRUD with search, filter, pagination
- **Faculty & Employee Management**
- **Admission Portal**: Online applications, merit, enrollment
- **Examination ERP**: Schedules, hall tickets, marks, results
- **Fee Management**: Structure, payments, receipts, scholarships
- **Attendance System**: Student, faculty, employee
- **Library**: Books, issues, returns, fines
- **Hostel**: Buildings, rooms, allocations
- **Transport**: Routes, vehicles, allocations
- **Placement Cell**: Companies, drives, applications
- **Research Portal**: Projects, publications, grants
- **Complaint System**: Multi-category complaint tracking
- **HR & Payroll**: Employee master, salary, payslips
- **CMS**: Pages, news, notices, events, gallery, downloads
- **Reports**: Dynamic report builder with 9 chart types
- **RBAC**: 14 roles (Super Admin → Student)
- **Audit Logs**: Track every action
- **Settings**: University-wide configuration

### Multi-Tenant Architecture
- Subdomain-based isolation for affiliated colleges
- Each college has own students, faculty, staff, admissions, fees
- University Super Admin can access all colleges
- College Admin sees only own college data

---

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 16, React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, shadcn/ui |
| Database | PostgreSQL 16 (production) / SQLite (demo) |
| ORM | Prisma 6 |
| Auth | Cookie-based session (production: NextAuth.js + JWT) |
| Charts | Recharts |
| State | Zustand |
| Icons | Lucide React |
| Cache | Redis (production) |
| Deployment | Docker, Nginx, Vercel |

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 20+ or Bun 1.0+
- npm/bun package manager

### Installation

```bash
# 1. Extract the ZIP
unzip tys-university-erp.zip
cd tys-university-erp

# 2. Install dependencies
bun install
# OR
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Push database schema
bun run db:push
# OR
npx prisma db push

# 5. Seed demo data
bun run scripts/seed.ts
# OR
npx tsx scripts/seed.ts

# 6. Start development server
bun run dev
# OR
npm run dev
```

Visit `http://localhost:3000`

---

## 🆓 Free Hosting Options

### Option A: Vercel + Neon (RECOMMENDED - 100% Free)

**Cost: $0/month** | Best for demos and small deployments

#### Step 1: Get Free PostgreSQL from Neon
1. Go to https://neon.tech
2. Sign up (free, no credit card)
3. Create new project → "TYS University"
4. Copy connection string: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/tys?sslmode=require`

#### Step 2: Push Schema to Neon
```bash
# Update .env with Neon connection string
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/tys?sslmode=require"

# Push schema
bun run db:push

# Seed data
bun run scripts/seed.ts
```

#### Step 3: Deploy to Vercel
1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/tys-university-erp.git
   git push -u origin main
   ```

2. Go to https://vercel.com
3. Click "New Project" → Import your GitHub repo
4. Add Environment Variables:
   ```
   DATABASE_URL = postgresql://user:pass@ep-xxx.neon.tech/tys?sslmode=require
   NEXTAUTH_SECRET = (generate from https://generate-secret.now.sh/32)
   NEXTAUTH_URL = https://your-app.vercel.app
   ```
5. Click "Deploy"

#### Step 4: Run Database Setup on Vercel
After first deploy, run the seed:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run seed on production
vercel env pull .env.production.local
npx prisma db push
npx tsx scripts/seed.ts
```

**✅ Live at: `https://tys-university-erp.vercel.app`**

---

### Option B: Railway (Free Tier)

1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Add PostgreSQL plugin (Railway provides free PostgreSQL)
4. Set environment variables:
   ```
   DATABASE_URL = ${{Postgres.DATABASE_URL}}
   NEXTAUTH_SECRET = random-32-char-string
   ```
5. Railway auto-deploys on every push

---

### Option C: Render (Free Tier)

1. Go to https://render.com
2. "New +" → "Web Service" → Connect GitHub repo
3. Settings:
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run start`
   - **Environment**: `Node`
4. Add PostgreSQL database: "New +" → "PostgreSQL"
5. Set `DATABASE_URL` from Render's PostgreSQL instance

---

### Option D: Cloudflare Pages + Supabase (100% Free)

1. **Database**: Sign up at https://supabase.com (free 500MB PostgreSQL)
   - Create project → Get connection string
   - Run: `DATABASE_URL="postgresql://..." bun run db:push`
   - Run: `bun run scripts/seed.ts`

2. **Frontend**: Cloudflare Pages
   - Go to https://pages.cloudflare.com
   - "Create a project" → Connect GitHub
   - Build command: `npm run build`
   - Output directory: `.next`
   - Add environment variables

---

### Free Tier Comparison

| Platform | Database | Storage | Bandwidth | Custom Domain | SSL |
|----------|----------|---------|-----------|---------------|-----|
| **Vercel + Neon** | 0.5GB (Neon) | 100GB | 100GB/mo | ✅ Free | ✅ Auto |
| **Railway** | 1GB | 100GB | 100GB/mo | ✅ Free | ✅ Auto |
| **Render** | 1GB (expires 90d) | 100GB | 100GB/mo | ✅ Free | ✅ Auto |
| **Cloudflare + Supabase** | 500MB | Unlimited | Unlimited | ✅ Free | ✅ Auto |

**🏆 Winner: Vercel + Neon** (most reliable, never expires)

---

## 🖥 Own Server (VPS) Deployment

### Recommended VPS Providers

| Provider | Spec | Cost | Link |
|----------|------|------|------|
| **Hetzner** | 4 vCPU, 8GB RAM, 160GB | $15/mo | https://hetzner.cloud |
| **DigitalOcean** | 2 vCPU, 4GB RAM, 80GB | $24/mo | https://digitalocean.com |
| **Vultr** | 2 vCPU, 4GB RAM, 80GB | $24/mo | https://vultr.com |
| **Linode** | 2 vCPU, 4GB RAM, 80GB | $24/mo | https://linode.com |
| **AWS EC2** | t3.medium | $30/mo | https://aws.amazon.com |
| **Contabo** | 4 vCPU, 8GB RAM, 200GB | $6/mo | https://contabo.com |

### Step 1: Provision VPS

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Verify
docker --version
docker compose version
```

### Step 2: Deploy with Docker Compose

```bash
# Create project directory
mkdir -p /opt/tys-erp && cd /opt/tys-erp

# Clone or upload project
git clone https://github.com/yourusername/tys-university-erp.git .
# OR upload via SCP:
# scp -r ./tys-university-erp/* root@your-server-ip:/opt/tys-erp/

# Create .env file
cp .env.example .env
nano .env
# Update:
#   DATABASE_URL=postgresql://tys_user:tys_password@db:5432/tys_university
#   NEXTAUTH_SECRET=generate-random-32-chars
#   NEXTAUTH_URL=https://tysuniversity.edu

# Switch to PostgreSQL schema
# Edit prisma/schema.prisma:
#   datasource db {
#     provider = "postgresql"
#     url      = env("DATABASE_URL")
#   }

# Build and start
docker compose up -d --build

# Initialize database
docker compose exec app npx prisma db push
docker compose exec app npx tsx scripts/seed.ts

# Check status
docker compose ps
docker compose logs -f app
```

### Step 3: Setup SSL with Let's Encrypt

```bash
# Install Certbot
apt install certbot

# Get SSL certificate
certbot certonly --standalone -d tysuniversity.edu -d www.tysuniversity.edu

# Copy certs to nginx
cp /etc/letsencrypt/live/tysuniversity.edu/fullchain.pem /opt/tys-erp/nginx/certs/
cp /etc/letsencrypt/live/tysuniversity.edu/privkey.pem /opt/tys-erp/nginx/certs/

# For wildcard (affiliated colleges):
certbot certonly --standalone -d *.tysuniversity.edu -d tysuniversity.edu --server https://acme-v02.api.letsencrypt.org/directory

# Restart nginx
docker compose restart nginx
```

### Step 4: Setup Wildcard DNS

In your DNS provider (Cloudflare recommended):
```
A    @            → YOUR_SERVER_IP
A    www          → YOUR_SERVER_IP
CNAME *.tysuniversity.edu → tysuniversity.edu
```

### Step 5: Auto-Renew SSL

```bash
# Add cron job
crontab -e

# Add this line:
0 3 * * * certbot renew --quiet && cp /etc/letsencrypt/live/tysuniversity.edu/*.pem /opt/tys-erp/nginx/certs/ && docker compose -f /opt/tys-erp/docker-compose.yml restart nginx
```

### Step 6: Setup Backups

```bash
# Create backup script
cat > /opt/tys-erp/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/tys-erp/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker compose -f /opt/tys-erp/docker-compose.yml exec -T db pg_dump -U tys_user tys_university | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
EOF

chmod +x /opt/tys-erp/backup.sh

# Add daily backup cron
echo "0 2 * * * /opt/tys-erp/backup.sh" | crontab -
```

---

## 🔐 Demo Login

After seeding, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| University Admin | admin@tysuniversity.edu | demo123 |
| College Admin | (any college admin email) | demo123 |
| Faculty | (any faculty email) | demo123 |
| Student | (any student email) | demo123 |

**Note**: For demo, any password with 3+ characters works. For production, implement bcrypt in `src/lib/auth.ts`.

---

## 📁 Project Structure

```
tys-university-erp/
├── prisma/
│   └── schema.prisma          # 30+ database models
├── scripts/
│   └── seed.ts                # Comprehensive seed script
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main entry (mode router)
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # TYS brand theme
│   │   └── api/               # 20+ REST endpoints
│   │       ├── auth/
│   │       ├── dashboard/
│   │       ├── students/
│   │       ├── colleges/
│   │       ├── fees/
│   │       ├── reports/
│   │       └── ...
│   ├── components/
│   │   ├── public/            # Public website
│   │   ├── auth/              # Login screen
│   │   ├── erp/               # ERP module views
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── db.ts              # Prisma client
│   │   ├── auth.ts            # Session auth
│   │   └── store/             # Zustand state
│   └── hooks/
├── nginx/                     # Nginx configs
├── Dockerfile                 # Production Docker image
├── docker-compose.yml         # Full stack deployment
├── .env.example               # Environment template
└── package.json
```

---

## 📊 Database Schema

30+ models covering:
- **Tenancy**: College, User, Role, AuditLog, Setting, Notification
- **University**: School → Department → Program → Course → Subject
- **Academics**: AcademicSession, StudentEnrollment, Attendance, Result, ExamSchedule
- **People**: Student, Employee
- **Finance**: FeeStructure, FeePayment, Payroll
- **Facilities**: Book, Hostel, Transport
- **Career**: PlacementDrive, ResearchProject
- **CMS**: CMSPage, News, Notice, Event, GalleryAlbum, Download

Run `npx prisma studio` to view/edit data visually.

---

## 🔌 API Documentation

### Authentication
```
POST /api/auth/login     - Login (returns user + sets cookie)
POST /api/auth/logout    - Logout (clears cookie)
GET  /api/auth/me        - Get current user
```

### ERP Modules
```
GET  /api/dashboard      - Dashboard stats + charts
GET  /api/students       - List students (with filters)
POST /api/students       - Create student
GET  /api/colleges       - List affiliated colleges
GET  /api/employees      - List faculty & staff
GET  /api/sessions       - List academic sessions
GET  /api/schools        - List schools & departments
GET  /api/programs       - List academic programs
GET  /api/fees           - List fee payments + summary
GET  /api/library        - List books + summary
GET  /api/hostel         - List hostels
GET  /api/transport      - List transport routes
GET  /api/placements     - List placement drives
GET  /api/research       - List research projects
GET  /api/complaints     - List complaints + summary
GET  /api/reports        - Dynamic report data (?module=all|overview|attendance|employees)
GET  /api/cms            - Public website content
GET  /api/roles          - List RBAC roles
GET  /api/audit          - List audit logs
GET  /api/settings       - System settings
GET  /api/notifications  - User notifications
```

All `/api/*` endpoints (except `/api/auth/login` and `/api/cms`) require authentication.

---

## 🛠 Troubleshooting

### Database Connection Issues
```bash
# Check Prisma can connect
npx prisma db pull

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# View database visually
npx prisma studio
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
bun install

# Rebuild
bun run build
```

### Docker Issues
```bash
# View logs
docker compose logs -f app
docker compose logs -f db

# Restart services
docker compose restart

# Rebuild from scratch
docker compose down -v
docker compose up -d --build
```

### Production: Switch from SQLite to PostgreSQL

1. Edit `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

2. Update `.env`:
```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
```

3. Push schema:
```bash
npx prisma db push
npx tsx scripts/seed.ts
```

---

## 📝 Production Checklist

- [ ] Switch database from SQLite to PostgreSQL
- [ ] Implement bcrypt password hashing in `src/lib/auth.ts`
- [ ] Set strong `NEXTAUTH_SECRET` (32+ random chars)
- [ ] Configure `NEXTAUTH_URL` to your domain
- [ ] Setup SSL certificate (Let's Encrypt)
- [ ] Configure wildcard DNS for affiliated colleges
- [ ] Setup daily database backups
- [ ] Configure rate limiting in Nginx
- [ ] Setup monitoring (Uptime Robot - free)
- [ ] Enable Cloudflare CDN (free)
- [ ] Configure email service (Resend, SendGrid)
- [ ] Setup SMS gateway (MSG91, Twilio)

---

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review `dev.log` for error details
3. Check browser console for frontend errors

---

## 📄 License

MIT License - feel free to use this for your institution.

---

**Built with ❤️ for TYS University**
