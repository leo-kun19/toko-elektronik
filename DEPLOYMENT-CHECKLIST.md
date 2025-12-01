# ✅ Railway Deployment Checklist

## 📋 Pre-Deployment

- [ ] Code sudah di-push ke GitHub
- [ ] Aplikasi berjalan normal di local
- [ ] Database local sudah ada data seed
- [ ] Semua environment variables sudah dicatat

## 🗄️ Database Setup

- [ ] PostgreSQL service created di Railway
- [ ] DATABASE_URL copied
- [ ] Database schema pushed (`npm run db:push`)
- [ ] Database seeded (`npm run db:seed`)
- [ ] Test connection berhasil

## 🔧 Backend Deployment

- [ ] Backend service created
- [ ] Root directory set ke `backend`
- [ ] Build command: `npm run build`
- [ ] Start command: `npm run start`
- [ ] Environment variables configured:
  - [ ] DATABASE_URL
  - [ ] JWT_SECRET
  - [ ] JWT_EXPIRES_IN
  - [ ] NODE_ENV=production
  - [ ] PORT=3001
- [ ] Build successful
- [ ] Service running (check logs)
- [ ] Public domain noted
- [ ] API endpoints accessible

## 🎨 Frontend Deployment

- [ ] Frontend service created
- [ ] Root directory set ke `frontend`
- [ ] Build command: `npm run build`
- [ ] Start command: `npm run preview -- --host 0.0.0.0 --port $PORT`
- [ ] Environment variables configured:
  - [ ] VITE_API_URL (backend public domain)
- [ ] Build successful
- [ ] Service running (check logs)
- [ ] Public domain noted
- [ ] Website accessible

## 🔗 Integration

- [ ] FRONTEND_URL added to backend variables
- [ ] Backend redeployed with new CORS settings
- [ ] Frontend can connect to backend API
- [ ] Login working
- [ ] All API calls working

## 🧪 Testing

- [ ] Login page loads
- [ ] Login successful (admin/admin123)
- [ ] Dashboard loads with data
- [ ] Stok Barang page working
- [ ] Barang Masuk page working
- [ ] Barang Keluar page working
- [ ] Supplier page working
- [ ] Kategori page working
- [ ] CRUD operations working
- [ ] Images loading
- [ ] No console errors

## 🔐 Security

- [ ] Default admin password changed
- [ ] Strong JWT_SECRET set
- [ ] CORS properly configured
- [ ] HTTPS enabled (Railway default)
- [ ] Environment variables secured
- [ ] No sensitive data in logs

## 📊 Monitoring

- [ ] Railway dashboard accessible
- [ ] Logs readable
- [ ] Metrics showing
- [ ] Alerts configured (optional)

## 📝 Documentation

- [ ] Deployment URLs documented
- [ ] Environment variables documented
- [ ] Access credentials documented
- [ ] Team notified

## 🎉 Go Live

- [ ] All checks passed
- [ ] Stakeholders notified
- [ ] Documentation shared
- [ ] Support plan ready

---

## 🚨 Rollback Plan

If something goes wrong:

1. **Check Logs**: Railway Dashboard → Service → Logs
2. **Rollback**: Deployments → Previous deployment → Rollback
3. **Fix Issue**: Update code/config
4. **Redeploy**: Push to GitHub or manual redeploy

---

## 📞 Support Contacts

- **Railway Support**: https://railway.app/help
- **Railway Discord**: https://discord.gg/railway
- **Team Lead**: [Your Name]
- **Backend Dev**: Dini
- **Frontend Dev**: Aulia

---

**Last Updated**: [Date]
**Deployed By**: [Your Name]
**Environment**: Production
