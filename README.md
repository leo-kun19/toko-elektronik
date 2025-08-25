# 🛍️ Toko Elektronik

Aplikasi e-commerce untuk toko elektronik dengan sistem manajemen inventori terintegrasi.

## 👥 Tim Pengembang

| Role | Nama | Tanggung Jawab |
|------|------|----------------|
| 🎯 **Project Manager** | Leo | Koordinasi project, timeline, dan quality assurance |
| 🎨 **UI/UX Designer** | Nisa | Design interface, user experience, dan prototyping |
| 💻 **Frontend Developer** | Aulia | Implementasi UI dengan ReactJS |
| ⚙️ **Backend Developer** | Dini | API development dengan NextJS |
| 📊 **Product & Financial Manager** | Diki | Business logic, financial features, dan product management |

## 🚀 Tech Stack

### Frontend
- **Framework**: ReactJS
- **UI Library**: Material-UI (MUI)
- **State Management**: React Query
- **Form Handling**: Formik + Yup
- **Routing**: React Router DOM

### Backend  
- **Framework**: NextJS (API Routes)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **File Upload**: Cloudinary

### Development Tools
- **Design**: Figma
- **Version Control**: GitHub
- **Package Manager**: NPM Workspaces
- **Code Quality**: ESLint, Prettier, Husky

## 🔧 API Integrations

- **Raja Ongkir**: Shipping cost calculation
- **Google OAuth**: User authentication  
- **Payment Gateway**: Payment processing
- **Custom Product API**: Internal product management

## 📋 Fitur Utama

### 👤 Admin Features
- ✅ Input stok barang masuk/keluar
- ✅ Laporan keuangan
- ✅ Monitoring stok real-time
- ✅ Manajemen pembelian
- ✅ Form pengaduan pelanggan (terintegrasi WhatsApp)
- ✅ Notifikasi low stock
- 🔄 CCTV monitoring (opsional)
- 🔄 Sistem voucher (opsional)

### 🛒 Customer Features
**Pengguna Belum Terdaftar:**
- ✅ Browse produk
- ✅ Tambah ke keranjang
- ✅ Registrasi akun (Google OAuth)

**Pengguna Terdaftar:**
- ✅ Login (Google OAuth)
- ✅ Browse & beli produk
- ✅ Proses pembayaran
- ✅ Download invoice
- ✅ Submit pengaduan
- ✅ Kelola profil

## 🏗️ Struktur Project

```
toko-elektronik/
├── 📁 frontend/                 # ReactJS Application
│   ├── src/
│   ├── public/
│   └── package.json
├── 📁 backend/                  # NextJS API
│   ├── pages/api/
│   ├── prisma/
│   └── package.json
├── 📁 database/                 # Database files
│   ├── migrations/
│   └── seeds/
├── 📁 docs/                     # Documentation
│   ├── api/
│   └── deployment/
├── 📁 assets/                   # Static assets
│   ├── images/
│   └── icons/
├── 📁 .github/                  # GitHub configs
│   ├── workflows/
│   └── ISSUE_TEMPLATE/
└── 📄 README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- npm >= 8.x
- PostgreSQL >= 13.x
- Git

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/leo-kun19/toko-elektronik.git
   cd toko-elektronik
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Setup environment variables**
   ```bash
   # Backend (.env.local)
   cp backend/.env.example backend/.env.local
   
   # Edit dengan database credentials dan API keys
   ```

4. **Setup database**
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📚 Scripts

### Root Level
```bash
npm run dev                 # Start both frontend & backend
npm run build              # Build production version
npm run install:all        # Install all dependencies
npm run lint               # Lint all projects
```

### Frontend
```bash
cd frontend
npm run dev                # Start development server
npm run build              # Build for production  
npm run test               # Run tests
npm run lint               # Lint frontend code
```

### Backend
```bash
cd backend
npm run dev                # Start API server
npm run build              # Build for production
npm run db:migrate         # Run database migrations
npm run db:studio          # Open Prisma Studio
```

## 🌟 Development Workflow

### Branching Strategy
- `main`: Production ready code
- `development`: Integration branch
- `feature/[feature-name]`: Feature development
- `hotfix/[issue-name]`: Critical fixes

### Commit Convention
```
feat: add new feature
fix: bug fixes
docs: documentation updates
style: formatting changes
refactor: code refactoring
test: testing related changes
chore: maintenance tasks
```

### Code Review Process
1. Create feature branch from `development`
2. Implement feature with tests
3. Create Pull Request to `development`
4. Code review by 2+ team members
5. Merge after approval and CI passes

## 🔒 Environment Variables

### Backend (.env.local)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/toko_elektronik"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# APIs
RAJAONGKIR_API_KEY="your-rajaongkir-key"
PAYMENT_GATEWAY_KEY="your-payment-key"
CLOUDINARY_URL="your-cloudinary-url"

# Email
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-email-password"
```

## 📊 Database Schema

### Main Entities
- **Users**: Customer & admin data
- **Products**: Product catalog
- **Orders**: Purchase transactions
- **Inventory**: Stock management
- **Payments**: Payment records
- **Complaints**: Customer support tickets

## 🚀 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] CDN configured for assets
- [ ] Monitoring setup
- [ ] Backup strategy implemented

### Staging Environment
- **Frontend**: https://staging-toko-elektronik.vercel.app
- **Backend API**: https://staging-api-toko-elektronik.vercel.app

### Production Environment
- **Frontend**: https://toko-elektronik.com
- **Backend API**: https://api.toko-elektronik.com

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Style

- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for consistent formatting
- Write meaningful commit messages
- Add JSDoc comments for functions
- Write tests for new features

## 🐛 Issue Reporting

Gunakan GitHub Issues dengan template yang sesuai:
- 🐛 **Bug Report**: Untuk melaporkan bug
- 🚀 **Feature Request**: Untuk request fitur baru
- 📝 **Documentation**: Untuk improvement dokumentasi
- ❓ **Question**: Untuk pertanyaan umum

## 📞 Support

- **Project Manager**: Leo - leo@example.com
- **Technical Lead**: Dini - dini@example.com
- **Documentation**: Lihat folder `/docs` untuk dokumentasi detail

## 📜 License

This project is licensed under UNLICENSED - see the [LICENSE](LICENSE) file for details.

---

🎯 **Project Status**: Active Development
📅 **Last Updated**: August 2025
🔄 **Version**: 1.0.0

**Happy Coding!** 🚀
