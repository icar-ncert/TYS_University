#!/bin/bash
# ==========================================
# TYS University ERP - VPS Deploy Script
# ==========================================
# Usage: bash deploy.sh your-domain.com
# ==========================================

set -e

DOMAIN=${1:-"tysuniversity.edu"}
PROJECT_DIR="/opt/tys-erp"

echo "🚀 Deploying TYS University ERP to $DOMAIN"
echo "============================================="

# Check if root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root: sudo bash deploy.sh $DOMAIN"
  exit 1
fi

# Install Docker if not present
if ! command -v docker &> /dev/null; then
  echo "📦 Installing Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  rm get-docker.sh
fi

# Install Certbot if not present
if ! command -v certbot &> /dev/null; then
  echo "📦 Installing Certbot..."
  apt update && apt install -y certbot
fi

# Create project directory
echo "📁 Creating project directory..."
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# Check if project files exist
if [ ! -f "docker-compose.yml" ]; then
  echo "❌ Project files not found. Please upload project files to $PROJECT_DIR first."
  echo "   Run: scp -r ./tys-university-erp/* root@server:$PROJECT_DIR/"
  exit 1
fi

# Generate random secrets
NEXTAUTH_SECRET=$(openssl rand -hex 32)
DB_PASSWORD=$(openssl rand -hex 16)

# Create .env file
echo "📝 Creating environment file..."
cat > .env << EOF
DATABASE_URL=postgresql://tys_user:$DB_PASSWORD@db:5432/tys_university
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NEXTAUTH_URL=https://$DOMAIN
NODE_ENV=production
EOF

# Create nginx certs directory
mkdir -p nginx/certs

# Build and start containers
echo "🐳 Building Docker containers..."
docker compose up -d --build

# Wait for database
echo "⏳ Waiting for database to be ready..."
sleep 15

# Initialize database
echo "🗄 Initializing database..."
docker compose exec -T app npx prisma db push

# Seed demo data
echo "🌱 Seeding demo data..."
docker compose exec -T app npx tsx scripts/seed.ts

# Get SSL certificate
echo "🔒 Getting SSL certificate..."
docker compose stop nginx
certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem nginx/certs/
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem nginx/certs/
docker compose start nginx

# Setup auto-renewal
echo "⏰ Setting up SSL auto-renewal..."
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && cp /etc/letsencrypt/live/$DOMAIN/*.pem $PROJECT_DIR/nginx/certs/ && docker compose -f $PROJECT_DIR/docker-compose.yml restart nginx") | crontab -

# Setup backups
echo "💾 Setting up daily backups..."
cat > $PROJECT_DIR/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/tys-erp/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
docker compose -f /opt/tys-erp/docker-compose.yml exec -T db pg_dump -U tys_user tys_university | gzip > $BACKUP_DIR/db_$DATE.sql.gz
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
EOF
chmod +x $PROJECT_DIR/backup.sh
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/tys-erp/backup.sh") | crontab -

echo ""
echo "✅ Deployment Complete!"
echo "============================================="
echo "🌐 Website: https://$DOMAIN"
echo "🔐 Admin Login: admin@tysuniversity.edu"
echo "🔑 Password: demo123"
echo ""
echo "📋 Next Steps:"
echo "   1. Setup DNS: A record for $DOMAIN → $(curl -s ifconfig.me)"
echo "   2. Setup wildcard DNS: *.tysuniversity.edu → $(curl -s ifconfig.me)"
echo "   3. Configure email service for notifications"
echo "   4. Setup Cloudflare CDN (optional, recommended)"
echo ""
echo "📁 Project directory: $PROJECT_DIR"
echo "📄 Logs: docker compose logs -f"
echo ""
