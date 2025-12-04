-- Manual Seed Script for Railway PostgreSQL
-- Run this in Railway Postgres Query tab

-- 1. Insert Admin
INSERT INTO admin (username, password) VALUES 
('admin', '$2a$10$rZ5qH8qF9vX7yJ3nK2mL4OqW8tN6pE1sR9dC5fG7hI8jK9lM0nO1p')
ON CONFLICT (username) DO NOTHING;

-- 2. Insert Categories
INSERT INTO categori (name, description, admin_id) VALUES 
('AC', 'Air Conditioner', 1),
('Elektronik Rumah Tangga', 'Peralatan elektronik untuk rumah tangga', 1),
('Komputer & Aksesoris', 'Komputer dan aksesorisnya', 1),
('Listrik & Kabel', 'Peralatan listrik dan kabel', 1),
('Audio & Video', 'Peralatan audio dan video', 1)
ON CONFLICT DO NOTHING;

-- 3. Insert Suppliers (sample)
INSERT INTO suplier (nama, contact) VALUES 
('PT Elektronik Jaya', '081234567890'),
('CV Mitra Elektronik', '081234567891'),
('Toko Elektronik Sejahtera', '081234567892'),
('PT Teknologi Maju', '081234567893'),
('CV Listrik Abadi', '081234567894'),
('Toko Komputer Central', '081234567895'),
('PT Audio Visual', '081234567896'),
('CV Kabel Indonesia', '081234567897'),
('Toko Elektronik Modern', '081234567898'),
('PT Peralatan Rumah', '081234567899')
ON CONFLICT DO NOTHING;

-- 4. Insert Sample Products (10 products)
INSERT INTO produk (name, description, image, price, stock, categori_id, suplier_id) VALUES 
('AC Daikin FTV', 'AC Split 1 PK', 'AC Daikin FTV.jpeg', 3500000, 15, 1, 1),
('AC Sharp AH', 'AC Split 1.5 PK', 'AC Sharp AH.jpeg', 4200000, 12, 1, 1),
('Kulkas LG GN', 'Kulkas 2 Pintu 200L', 'Kulkas LG GN.jpeg', 3800000, 8, 2, 2),
('Kulkas Samsung RT38', 'Kulkas 2 Pintu 300L', 'Kulkas Samsung RT38.jpeg', 5500000, 6, 2, 2),
('TV LG 50', 'Smart TV 50 inch', 'TV LG 50.jpeg', 6500000, 10, 5, 7),
('TV Samsung 43', 'Smart TV 43 inch', 'TV Samsung 43.jpeg', 5200000, 12, 5, 7),
('Laptop Gaming', 'Laptop Gaming ROG', 'laptop.jpeg', 15000000, 5, 3, 6),
('Mouse Logitech', 'Mouse Wireless', 'Mouse Logitech Wireless M185.jpeg', 150000, 50, 3, 6),
('Kabel Roll Kenmaster', 'Kabel Roll 10 Meter', 'Kabel Roll Kenmaster.jpeg', 250000, 30, 4, 8),
('Speaker JBL Flip 5', 'Speaker Bluetooth', 'Speaker JBL Flip 5.jpeg', 1500000, 20, 5, 7)
ON CONFLICT DO NOTHING;

-- Verify data
SELECT 'Admin Count:' as info, COUNT(*) as count FROM admin
UNION ALL
SELECT 'Categories Count:', COUNT(*) FROM categori
UNION ALL
SELECT 'Suppliers Count:', COUNT(*) FROM suplier
UNION ALL
SELECT 'Products Count:', COUNT(*) FROM produk;
