-- Setup Database untuk Toko Elektronik
-- Jalankan script ini di PostgreSQL

-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS gimbers_elektronik;

-- Gunakan database
\c gimbers_elektronik;

-- Tabel Admin
CREATE TABLE IF NOT EXISTS admin (
    admin_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Kategori
CREATE TABLE IF NOT EXISTS categori (
    categori_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    admin_id INTEGER REFERENCES admin(admin_id) ON UPDATE NO ACTION
);

-- Tabel Supplier
CREATE TABLE IF NOT EXISTS suplier (
    suplier_id SERIAL PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    contact VARCHAR(100)
);

-- Tabel Produk
CREATE TABLE IF NOT EXISTS produk (
    produk_id SERIAL PRIMARY KEY,
    categori_id INTEGER REFERENCES categori(categori_id) ON UPDATE NO ACTION,
    suplier_id INTEGER REFERENCES suplier(suplier_id) ON UPDATE NO ACTION,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    image VARCHAR(150),
    price DECIMAL(12, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Barang Masuk
CREATE TABLE IF NOT EXISTS barang_masuk (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    kategori VARCHAR(100) NOT NULL,
    supplier VARCHAR(150) NOT NULL,
    deskripsi TEXT,
    harga DECIMAL(12, 2) NOT NULL,
    qty INTEGER NOT NULL,
    total DECIMAL(15, 2) NOT NULL,
    tanggal DATE NOT NULL,
    gambar VARCHAR(255),
    suplier_id INTEGER REFERENCES suplier(suplier_id) ON UPDATE NO ACTION,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Barang Keluar
CREATE TABLE IF NOT EXISTS barang_keluar (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    kategori VARCHAR(100) NOT NULL,
    supplier VARCHAR(150) NOT NULL,
    deskripsi TEXT,
    harga DECIMAL(12, 2) NOT NULL,
    qty INTEGER NOT NULL,
    total DECIMAL(15, 2) NOT NULL,
    tanggal DATE NOT NULL,
    gambar VARCHAR(255),
    suplier_id INTEGER REFERENCES suplier(suplier_id) ON UPDATE NO ACTION,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_produk_name ON produk(name);
CREATE INDEX IF NOT EXISTS idx_produk_categori ON produk(categori_id);
CREATE INDEX IF NOT EXISTS idx_produk_suplier ON produk(suplier_id);
CREATE INDEX IF NOT EXISTS idx_barang_masuk_tanggal ON barang_masuk(tanggal);
CREATE INDEX IF NOT EXISTS idx_barang_keluar_tanggal ON barang_keluar(tanggal);
