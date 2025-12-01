# 🚂 Railway Deployment Guide - Toko Elektronik

Panduan lengkap untuk deploy aplikasi Toko Elektronik ke Railway.

## 📋 Prerequisites

1. Akun Railway (https://railway.app)
2. GitHub repository yang sudah di-push
3. Proyek sudah berjalan di local

## 🎯 Strategi Deployment

Karena ini adalah monorepo dengan Frontend + Backend, kita akan deploy dalam **2 service terpisah**:

### **Service 1: Backend (Next.js API)**
- Port: 3001
- Database: PostgreSQL (Railway)
- Environment: Production

### **Service 2: Frontend (React + Vite)**
- Port: 5173 (atau dynamic dari Railway)
- Proxy ke Backend API

---

## 🚀 Step-by-Step Deployment

### **STEP 1: Setup Railway Project**

1. Login ke Railway: https://railway.app
2. Klik **"New Project"**
3. Pilih **"Deploy from GitHub repo"**
4. Pilih repository: `toko-elektronik`
5. Railway akan otomatis detect monorepo

---

### **STEP 2: Deploy Database (PostgreSQL)**

1. Di Railway dashboard, klik **"+ New"**
2. Pilih **"Database"** → **"PostgreSQL"**
3. Railway akan provision database otomatis
4. Copy **DATABASE_URL** dari tab "Variables"

**Format DATABASE_URL:**
```
postgresql://postgres:PASSWORD@HOST:PORT/railway
```

---

### **STEP 3: Deploy Backend Service**

#### 3.1 Create Backend Service
1. Klik **"+ New"** → **"GitHub Repo"**
2. Pilih repository yang sama
3. Railway akan detect Next.js

#### 3.2 Configure Backend
1. Klik service → **"Settings"**
2. Set **Root Directory**: `backend`
3. Set **Build Command**: `npm run build`
4. Set **Start Command**: `npm run start`

#### 3.3 Environment Variables
Klik tab **"Variables"** dan tambahkan:

```env
# Database (dari PostgreSQL service)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=production
PORT=3001

# NextAuth (optional)
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}

# Cloudinary (optional - untuk upload gambar)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### 3.4 Setup Database
Setelah deploy berhasil, jalankan di Railway CLI atau local:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Run database setup
railway run npm run db:setup --service backend
```

Atau manual via Prisma Studio:
1. Copy DATABASE_URL dari Railway
2. Update `.env` local dengan DATABASE_URL production
3. Run: `npm run db:setup` di folder backend
4. Restore `.env` ke local database

---

### **STEP 4: Deploy Frontend Service**

#### 4.1 Create Frontend Service
1. Klik **"+ New"** → **"GitHub Repo"**
2. Pilih repository yang sama lagi
3. Railway akan detect Vite

#### 4.2 Configure Frontend
1. Klik service → **"Settings"**
2. Set **Root Directory**: `frontend`
3. Set **Build Command**: `npm run build`
4. Set **Start Command**: `npm run preview -- --host 0.0.0.0 --port $PORT`

#### 4.3 Environment Variables
Klik tab **"Variables"** dan tambahkan:

```env
# Backend API URL (dari backend service)
VITE_API_URL=${{Backend.RAILWAY_PUBLIC_DOMAIN}}

# atau jika sudah punya custom domain:
VITE_API_URL=https://your-backend-domain.railway.app
```

#### 4.4 Update Frontend API Config
Edit file `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = {
  baseURL: API_BASE_URL,
  // ... rest of config
};
```

---

### **STEP 5: Update CORS di Backend**

Edit `backend/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { 
            key: "Access-Control-Allow-Origin", 
            value: process.env.FRONTEND_URL || "http://localhost:5173" 
          },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
```

Tambahkan environment variable di Backend service:
```env
FRONTEND_URL=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}
```

---

## 🔧 Alternative: Deploy as Single Service

Jika ingin deploy sebagai 1 service (lebih simple):

### Update `package.json` root:

```json
{
  "scripts": {
    "build": "npm run build:frontend && npm run build:backend",
    "start": "cd backend && npm run start",
    "postbuild": "cp -r frontend/dist backend/public"
  }
}
```

### Update `backend/next.config.js`:

```javascript
const nextConfig = {
  // ... existing config
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/public/:path*',
      },
    ];
  },
};
```

### Railway Settings:
- **Root Directory**: `.` (root)
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

---

## 📝 Post-Deployment Checklist

- [ ] Backend service running (check logs)
- [ ] Frontend service running (check logs)
- [ ] Database connected (check backend logs)
- [ ] Database seeded with initial data
- [ ] CORS configured correctly
- [ ] API endpoints accessible from frontend
- [ ] Login working (username: admin, password: admin123)
- [ ] Images loading correctly
- [ ] All CRUD operations working

---

## 🐛 Troubleshooting

### Backend tidak connect ke database
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test connection
railway run npm run db:studio --service backend
```

### Frontend tidak bisa akses API
1. Check VITE_API_URL di frontend variables
2. Check CORS settings di backend
3. Check browser console untuk CORS errors

### Database schema tidak sync
```bash
# Push schema to production database
railway run npm run db:push --service backend

# Seed data
railway run npm run db:seed --service backend
```

### Build failed
1. Check logs di Railway dashboard
2. Pastikan semua dependencies ada di package.json
3. Check Node.js version compatibility

---

## 🔐 Security Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS (Railway auto-provides)
- [ ] Set proper CORS origins
- [ ] Don't commit .env files
- [ ] Use Railway secrets for sensitive data
- [ ] Enable rate limiting (optional)
- [ ] Setup database backups

---

## 📊 Monitoring

Railway provides:
- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: History of all deployments
- **Webhooks**: Notifications for deploy events

---

## 💰 Pricing

Railway Free Tier includes:
- $5 free credit per month
- Unlimited projects
- 500 hours of usage
- 1GB RAM per service
- 1GB disk per service

Upgrade to Pro for:
- $20/month
- More resources
- Custom domains
- Priority support

---

## 🎉 Success!

Setelah semua langkah selesai, aplikasi Anda akan accessible di:

- **Frontend**: `https://your-frontend.railway.app`
- **Backend API**: `https://your-backend.railway.app/api`

Test dengan:
1. Buka frontend URL
2. Login dengan: `admin` / `admin123`
3. Test semua fitur CRUD

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: Create issue di repository

---

**Happy Deploying! 🚀**
