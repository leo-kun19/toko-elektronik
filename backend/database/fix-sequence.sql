-- Fix PostgreSQL sequence untuk auto-increment
-- Jalankan ini jika ada error "Unique constraint failed on produk_id"

-- Reset sequence produk_id
SELECT setval('produk_produk_id_seq', (SELECT MAX(produk_id) FROM produk));

-- Reset sequence lainnya juga untuk jaga-jaga
SELECT setval('admin_admin_id_seq', (SELECT MAX(admin_id) FROM admin));
SELECT setval('categori_categori_id_seq', (SELECT MAX(categori_id) FROM categori));
SELECT setval('suplier_suplier_id_seq', (SELECT MAX(suplier_id) FROM suplier));
SELECT setval('barang_masuk_id_seq', (SELECT MAX(id) FROM barang_masuk));
SELECT setval('barang_keluar_id_seq', (SELECT MAX(id) FROM barang_keluar));

-- Verifikasi
SELECT 
  'produk' as table_name,
  last_value as current_sequence,
  (SELECT MAX(produk_id) FROM produk) as max_id
FROM produk_produk_id_seq;
