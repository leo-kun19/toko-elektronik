# Backend - Toko Elektronik

Backend API untuk aplikasi manajemen stok toko elektronik menggunakan NextJS 13 App Router, Prisma ORM, dan PostgreSQL.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
Pastikan PostgreSQL sudah berjalan, lalu:

```bash
# Buat database di PostgreSQL
CREATE DATABASE gimbers_elektronik;

# Setup database (generate Prisma Client, push schema, seed data)
npm run db:setup
```

Atau manual:
```bash
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema ke database
npm run db:seed      # Seed data awal
```

### 3. Jalankan Server
```bash
npm run dev
```

Server akan berjalan di: **http://localhost:3001**

Atau double-click file: `START-SERVER.bat`

## 📁 Struktur Folder

```
backend/
├── app/
│   ├── api/
│   │   ├── auth/              # Authentication endpoints
│   │   │   ├── login/
│   │   │   └── logout/
│   │   ├── stok/              # Stok barang (produk) endpoints
│   │   ├── barang-masuk/      # Barang masuk endpoints
│   │   ├── barang-keluar/     # Barang keluar endpoints
│   │   ├── kategori/          # Kategori endpoints
│   │   ├── supplier/          # Supplier endpoints
│   │   ├── produk/            # Produk endpoints (raw)
│   │   ├── dashboard/         # Dashboard statistics
│   │   └── upload/            # File upload
│   └── uploads/               # Uploaded files
├── database/
│   └── seeds/
│       └── seed-from-json.js  # Seed script dari FINAL_SEED.json
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── FINAL_SEED.json        # Data seed
├── .env                       # Environment variables
├── API-DOCUMENTATION.md       # API documentation lengkap
└── package.json
```

## 🗄️ Database Schema

### Tables:
- **admin** - Data admin user
- **categori** - Kategori produk
- **suplier** - Data supplier
- **produk** - Master data produk
- **barang_masuk** - Transaksi barang masuk
- **barang_keluar** - Transaksi barang keluar

### Relationships:
- produk → categori (many-to-one)
- produk → suplier (many-to-one)
- barang_masuk → suplier (many-to-one)
- barang_keluar → suplier (many-to-one)

## 🔑 Environment Variables

File `.env`:
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/gimbers_elektronik"

# JWT
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN="7d"

# Server
NODE_ENV="development"
PORT=3001
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Login admin
- `POST /api/auth/logout` - Logout

### Stok Barang
- `GET /api/stok` - List semua stok
- `GET /api/stok/:id` - Detail stok
- `POST /api/stok` - Tambah stok baru
- `DELETE /api/stok/:id` - Hapus stok

### Barang Masuk
- `GET /api/barang-masuk` - List barang masuk
- `GET /api/barang-masuk/:id` - Detail barang masuk
- `POST /api/barang-masuk` - Tambah barang masuk
- `PUT /api/barang-masuk/:id` - Update barang masuk
- `DELETE /api/barang-masuk/:id` - Hapus barang masuk

### Barang Keluar
- `GET /api/barang-keluar` - List barang keluar
- `GET /api/barang-keluar/:id` - Detail barang keluar
- `POST /api/barang-keluar` - Tambah barang keluar
- `PUT /api/barang-keluar/:id` - Update barang keluar
- `DELETE /api/barang-keluar/:id` - Hapus barang keluar

### Kategori
- `GET /api/kategori` - List kategori
- `GET /api/kategori/:id` - Detail kategori
- `POST /api/kategori` - Tambah kategori
- `PUT /api/kategori/:id` - Update kategori
- `DELETE /api/kategori/:id` - Hapus kategori

### Supplier
- `GET /api/supplier` - List supplier
- `GET /api/supplier/:id` - Detail supplier
- `POST /api/supplier` - Tambah supplier
- `PUT /api/supplier/:id` - Update supplier
- `DELETE /api/supplier/:id` - Hapus supplier

### Dashboard
- `GET /api/dashboard/stats` - Statistik dashboard

### Upload
- `POST /api/upload` - Upload gambar

Lihat dokumentasi lengkap di: **[API-DOCUMENTATION.md](./API-DOCUMENTATION.md)**

## 🔐 Default Login

```
Username: admin
Password: admin123
```

## 🎯 Fitur Backend

### ✅ Auto Stock Management
- Barang masuk → stok produk otomatis bertambah
- Barang keluar → stok produk otomatis berkurang
- Edit/hapus transaksi → stok otomatis disesuaikan

### ✅ Data Transformation
- API mengembalikan data dalam format yang sesuai dengan frontend
- Field `brand` otomatis di-extract dari nama produk
- Tanggal dalam format ISO (YYYY-MM-DD)

### ✅ Low Stock Alert
- Produk dengan stok < 5 akan masuk ke lowStockItems
- Dashboard menampilkan jumlah produk dengan stok rendah

### ✅ CORS Support
- Configured untuk frontend di `http://localhost:5173`
- Support credentials dan custom headers

### ✅ Error Handling
- Consistent error response format
- Proper HTTP status codes
- Detailed error messages

### ✅ Data Validation
- Foreign key constraints
- Required field validation
- Stock availability check (barang keluar)

## 🛠️ NPM Scripts

```bash
# Development
npm run dev              # Start development server

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema ke database
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed data dari FINAL_SEED.json
npm run db:setup         # Setup lengkap (generate + push + seed)

# Production
npm run build            # Build untuk production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
```

## 📊 Seed Data

Data seed diambil dari `prisma/FINAL_SEED.json` yang berisi:
- 5 Kategori
- 10 Supplier (3 dari JSON + 7 auto-generated)
- 93 Produk elektronik lengkap
- Sample barang masuk & keluar

Untuk re-seed database:
```bash
npm run db:seed
```

## 🔧 Troubleshooting

### Error: "Can't reach database server"
- Pastikan PostgreSQL berjalan
- Cek DATABASE_URL di .env
- Cek port PostgreSQL (default: 5432)

### Error: "Foreign key constraint failed"
- Jalankan `npm run db:seed` lagi
- Script akan otomatis menambahkan supplier yang hilang

### Error: "Prisma Client not generated"
- Jalankan `npm run db:generate`

### Error: "cb.apply is not a function"
- Gunakan `npm run` bukan `npx`
- Update Node.js ke versi terbaru

## 📝 Development Notes

### Menambah Endpoint Baru
1. Buat folder di `app/api/nama-endpoint/`
2. Buat file `route.js` dengan export `GET`, `POST`, dll
3. Tambahkan CORS headers
4. Transform data ke format frontend jika perlu

### Menambah Table Baru
1. Update `prisma/schema.prisma`
2. Run `npm run db:push`
3. Run `npm run db:generate`

### Testing API
Gunakan tools seperti:
- Postman
- Thunder Client (VS Code extension)
- curl
- Browser (untuk GET requests)

## 🚀 Deployment

### Production Checklist
- [ ] Update DATABASE_URL untuk production database
- [ ] Set NODE_ENV="production"
- [ ] Update CORS origin untuk production frontend
- [ ] Set strong JWT_SECRET
- [ ] Enable SSL/HTTPS
- [ ] Setup backup database
- [ ] Configure logging
- [ ] Setup monitoring

### Build Production
```bash
npm run build
npm run start
```

## 📞 Support

Jika ada masalah, cek:
1. [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) - API reference lengkap
2. [PANDUAN-SETUP.md](./PANDUAN-SETUP.md) - Panduan setup database
3. Console log di terminal untuk error details

## 📄 License

UNLICENSED - Private project
