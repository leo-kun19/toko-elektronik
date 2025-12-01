# 🔧 Railway Troubleshooting Guide

Solusi untuk masalah umum saat deploy ke Railway.

---

## 🚨 Common Issues

### 1. ❌ Build Failed

**Error**: `Build failed with exit code 1`

**Penyebab**:
- Dependencies tidak terinstall
- Build command salah
- Node version incompatible

**Solusi**:
```bash
# Check package.json scripts
cat package.json | grep "build"

# Pastikan build command benar:
# Backend: npm run build
# Frontend: npm run build

# Check Node version di Railway Settings
# Recommended: Node 18.x atau 20.x
```

**Fix di Railway**:
1. Settings → Environment → Node Version
2. Set ke `18.x` atau `20.x`
3. Redeploy

---

### 2. ❌ Database Connection Failed

**Error**: `Can't reach database server at xxx.railway.app:5432`

**Penyebab**:
- DATABASE_URL salah
- Database service belum ready
- Network issue

**Solusi**:
```bash
# Check DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://postgres:PASSWORD@HOST:PORT/railway

# Test connection via Railway CLI
railway run npm run db:studio --service backend
```

**Fix**:
1. Copy DATABASE_URL dari Postgres service
2. Paste ke Backend Variables
3. Pastikan format: `${{Postgres.DATABASE_URL}}`
4. Redeploy backend

---

### 3. ❌ CORS Error

**Error**: `Access to fetch at 'https://backend.railway.app' from origin 'https://frontend.railway.app' has been blocked by CORS policy`

**Penyebab**:
- FRONTEND_URL tidak di-set di backend
- CORS headers tidak configured

**Solusi**:
```javascript
// backend/next.config.js should have:
{
  key: "Access-Control-Allow-Origin", 
  value: process.env.FRONTEND_URL || "http://localhost:5173" 
}
```

**Fix**:
1. Backend Variables → Add `FRONTEND_URL`
2. Value: `https://your-frontend.railway.app`
3. Redeploy backend
4. Clear browser cache
5. Test again

---

### 4. ❌ Frontend Can't Connect to Backend

**Error**: `Failed to fetch` atau `Network Error`

**Penyebab**:
- VITE_API_URL salah
- Backend tidak running
- HTTPS/HTTP mismatch

**Solusi**:
```bash
# Check frontend environment
echo $VITE_API_URL
# Should be: https://your-backend.railway.app (no /api)

# Check backend is running
curl https://your-backend.railway.app/api/dashboard/stats
```

**Fix**:
1. Frontend Variables → Check `VITE_API_URL`
2. Pastikan HTTPS (bukan HTTP)
3. Pastikan tidak ada trailing slash
4. Redeploy frontend

---

### 5. ❌ Database Schema Not Synced

**Error**: `Invalid prisma.table.findMany() invocation`

**Penyebab**:
- Schema tidak di-push ke production database
- Prisma Client tidak generated

**Solusi**:
```bash
# Via Railway CLI
railway run npm run db:push --service backend
railway run npm run db:generate --service backend

# Or via local with production DATABASE_URL
cd backend
npm run db:push
npm run db:generate
```

**Fix**:
1. Update backend/.env dengan production DATABASE_URL
2. Run `npm run db:push`
3. Run `npm run db:seed`
4. Redeploy backend

---

### 6. ❌ No Data in Database

**Error**: Database empty, no products/categories

**Penyebab**:
- Database belum di-seed
- Seed script failed

**Solusi**:
```bash
# Check if tables exist
railway run npm run db:studio --service backend

# Seed database
railway run npm run db:seed --service backend
```

**Fix**:
1. Check logs untuk error saat seed
2. Pastikan FINAL_SEED.json ada
3. Run seed manual via Railway CLI
4. Verify data di Prisma Studio

---

### 7. ❌ Images Not Loading

**Error**: 404 on image URLs

**Penyebab**:
- Image path salah
- Static files tidak served
- CORS untuk images

**Solusi**:
```javascript
// Check next.config.js rewrites
async rewrites() {
  return [
    {
      source: '/images/:path*',
      destination: '/../image/:path*',
    },
  ];
}
```

**Fix**:
1. Upload images ke Cloudinary (recommended)
2. Or ensure image folder deployed
3. Update image URLs di database
4. Check CORS headers untuk /images/*

---

### 8. ❌ Environment Variables Not Working

**Error**: `undefined` when accessing env vars

**Penyebab**:
- Env var tidak di-set
- Typo di nama variable
- Frontend env var tidak prefix VITE_

**Solusi**:
```bash
# Backend: Direct access
process.env.JWT_SECRET

# Frontend: Must prefix with VITE_
import.meta.env.VITE_API_URL
```

**Fix**:
1. Check variable names (case-sensitive)
2. Frontend vars must start with `VITE_`
3. Redeploy after adding variables
4. Check logs untuk undefined vars

---

### 9. ❌ Port Already in Use

**Error**: `Port 3001 is already in use`

**Penyebab**:
- Railway assigns dynamic port
- Hard-coded port in code

**Solusi**:
```javascript
// Use Railway's PORT env var
const PORT = process.env.PORT || 3001;
```

**Fix**:
1. Update code to use `process.env.PORT`
2. Railway will auto-assign port
3. Don't hard-code ports

---

### 10. ❌ Login Not Working

**Error**: `Invalid credentials` atau `Unauthorized`

**Penyebab**:
- Database tidak ada admin user
- Password hash tidak match
- JWT_SECRET berbeda

**Solusi**:
```bash
# Check admin user exists
railway run npm run db:studio --service backend

# Default credentials:
# Username: admin
# Password: admin123
```

**Fix**:
1. Verify admin user di database
2. Re-seed database jika perlu
3. Check JWT_SECRET consistent
4. Clear browser cookies
5. Try login again

---

## 🔍 Debugging Tips

### Check Logs
```bash
# Via Railway Dashboard
Service → Logs → Real-time logs

# Via Railway CLI
railway logs --service backend
railway logs --service frontend
```

### Check Environment Variables
```bash
# List all variables
railway variables --service backend

# Check specific variable
railway run echo $DATABASE_URL --service backend
```

### Test API Endpoints
```bash
# Test backend health
curl https://your-backend.railway.app/api/dashboard/stats

# Test with auth
curl -X POST https://your-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Check Database
```bash
# Open Prisma Studio
railway run npm run db:studio --service backend

# Or connect via psql
railway connect Postgres
```

---

## 🆘 Still Having Issues?

### 1. Check Railway Status
https://status.railway.app

### 2. Search Railway Docs
https://docs.railway.app

### 3. Ask Railway Community
https://discord.gg/railway

### 4. Check GitHub Issues
Search for similar issues in Railway GitHub

### 5. Create Support Ticket
Railway Dashboard → Help → Contact Support

---

## 📊 Monitoring & Alerts

### Setup Monitoring
1. Railway Dashboard → Service → Metrics
2. Monitor: CPU, Memory, Network
3. Set up alerts for high usage

### Log Aggregation
```bash
# Save logs for analysis
railway logs --service backend > backend-logs.txt
railway logs --service frontend > frontend-logs.txt
```

### Performance Monitoring
- Use Railway's built-in metrics
- Add custom logging in code
- Monitor response times
- Track error rates

---

## 🔄 Rollback Procedure

If deployment breaks production:

1. **Immediate Rollback**:
   - Railway Dashboard → Deployments
   - Click previous working deployment
   - Click "Rollback to this deployment"

2. **Fix Issue Locally**:
   - Identify problem in logs
   - Fix code/config
   - Test locally

3. **Redeploy**:
   - Push to GitHub
   - Or manual redeploy in Railway

4. **Verify**:
   - Check logs
   - Test all features
   - Monitor metrics

---

## 📞 Emergency Contacts

- **Railway Support**: support@railway.app
- **Railway Discord**: https://discord.gg/railway
- **Team Lead**: [Your Name]
- **DevOps**: [DevOps Contact]

---

**Remember**: Always test in development before deploying to production!

**Last Updated**: [Date]
