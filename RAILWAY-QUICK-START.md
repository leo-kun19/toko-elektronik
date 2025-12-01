# 🚀 Railway Quick Start - Toko Elektronik

Panduan cepat deploy ke Railway dalam 10 menit!

## 📦 Persiapan

1. **Push ke GitHub** (jika belum):
```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

2. **Login Railway**: https://railway.app

---

## ⚡ Deploy dalam 3 Langkah

### **LANGKAH 1: Deploy Database (2 menit)**

1. Buka Railway → **New Project**
2. Klik **"+ New"** → **"Database"** → **"PostgreSQL"**
3. ✅ Database siap! Copy **DATABASE_URL** dari tab Variables

---

### **LANGKAH 2: Deploy Backend (3 menit)**

1. Klik **"+ New"** → **"GitHub Repo"** → Pilih `toko-elektronik`
2. **Settings**:
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Start Command: `npm run start`

3. **Variables** (tab Variables):
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=ganti-dengan-secret-key-yang-kuat-minimal-32-karakter
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3001
```

4. Tunggu deploy selesai (3-5 menit)
5. Copy **Public Domain** (contoh: `backend-production-abc123.up.railway.app`)

6. **Setup Database** (pilih salah satu):

**Opsi A - Via Railway CLI:**
```bash
npm i -g @railway/cli
railway login
railway link
railway run npm run db:setup --service backend
```

**Opsi B - Via Local:**
```bash
# Update backend/.env dengan DATABASE_URL dari Railway
DATABASE_URL="postgresql://postgres:xxx@xxx.railway.app:5432/railway"

# Run setup
cd backend
npm run db:setup
```

---

### **LANGKAH 3: Deploy Frontend (3 menit)**

1. Klik **"+ New"** → **"GitHub Repo"** → Pilih `toko-elektronik` lagi
2. **Settings**:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Start Command: `npm run preview -- --host 0.0.0.0 --port $PORT`

3. **Variables**:
```env
VITE_API_URL=https://backend-production-abc123.up.railway.app
```
*(Ganti dengan Public Domain backend Anda)*

4. Tunggu deploy selesai (2-3 menit)
5. ✅ **DONE!** Buka Public Domain frontend

---

## 🔧 Update CORS Backend

Setelah frontend deploy, update Backend Variables:

```env
FRONTEND_URL=https://frontend-production-xyz789.up.railway.app
```
*(Ganti dengan Public Domain frontend Anda)*

Backend akan auto-redeploy dan CORS akan work!

---

## ✅ Testing

1. Buka frontend URL: `https://your-frontend.railway.app`
2. Login:
   - Username: `admin`
   - Password: `admin123`
3. Test fitur:
   - Dashboard
   - Stok Barang
   - Barang Masuk/Keluar
   - Supplier
   - Kategori

---

## 🐛 Troubleshooting Cepat

### ❌ Frontend tidak bisa connect ke Backend
**Fix:**
1. Check VITE_API_URL di Frontend Variables
2. Check FRONTEND_URL di Backend Variables
3. Pastikan tidak ada typo di URL

### ❌ Database error
**Fix:**
```bash
railway run npm run db:push --service backend
railway run npm run db:seed --service backend
```

### ❌ Build failed
**Fix:**
1. Check logs di Railway dashboard
2. Pastikan Root Directory benar
3. Check package.json scripts

---

## 🎯 Custom Domain (Optional)

1. Beli domain (Namecheap, GoDaddy, dll)
2. Di Railway service → Settings → Domains
3. Add custom domain
4. Update DNS records sesuai instruksi Railway
5. Update VITE_API_URL dan FRONTEND_URL

---

## 💡 Tips

- **Free Tier**: $5/month credit (cukup untuk development)
- **Logs**: Klik service → Logs untuk debug
- **Redeploy**: Klik service → Deployments → Redeploy
- **Rollback**: Klik deployment lama → Rollback

---

## 📊 Monitoring

Railway Dashboard menampilkan:
- ✅ CPU Usage
- ✅ Memory Usage
- ✅ Network Traffic
- ✅ Build Time
- ✅ Deployment History

---

## 🎉 Selesai!

Aplikasi Anda sekarang live di:
- **Frontend**: `https://your-frontend.railway.app`
- **Backend**: `https://your-backend.railway.app`
- **Database**: PostgreSQL di Railway

**Total waktu**: ~10 menit
**Total cost**: $0 (free tier)

---

## 📞 Butuh Bantuan?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Buat issue di GitHub repo

**Happy Deploying! 🚀**
