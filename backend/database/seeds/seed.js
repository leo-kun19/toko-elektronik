import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Mulai seeding database...");

  // 1. Buat Admin
  console.log("📝 Membuat admin...");
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
    },
  });
  console.log("✅ Admin berhasil dibuat:", admin.username);

  // 2. Buat Kategori
  console.log("📝 Membuat kategori...");
  const kategoriData = [
    { name: "Elektronik", description: "Peralatan elektronik rumah tangga" },
    { name: "Peralatan Rumah", description: "Peralatan rumah tangga" },
    { name: "Pencahayaan", description: "Lampu dan perlengkapan pencahayaan" },
    { name: "Audio", description: "Peralatan audio dan speaker" },
    { name: "Dapur", description: "Peralatan dapur" },
    { name: "Aksesoris", description: "Aksesoris elektronik" },
  ];

  const kategoriList = [];
  for (const kat of kategoriData) {
    const kategori = await prisma.categori.upsert({
      where: { categori_id: kategoriData.indexOf(kat) + 1 },
      update: {},
      create: {
        name: kat.name,
        description: kat.description,
        admin_id: admin.admin_id,
      },
    });
    kategoriList.push(kategori);
  }
  console.log(`✅ ${kategoriList.length} kategori berhasil dibuat`);

  // 3. Buat Supplier
  console.log("📝 Membuat supplier...");
  const supplierData = [
    { nama: "PT Jaya Kaya", contact: "021-12345678" },
    { nama: "PT Makmur Korea", contact: "021-87654321" },
    { nama: "PT Jay Aul", contact: "021-11223344" },
    { nama: "PT MPTI", contact: "021-55667788" },
    { nama: "PT Elektronik Baru", contact: "021-99887766" },
    { nama: "PT Jaya Sound", contact: "021-44556677" },
    { nama: "PT Rumah Listrik", contact: "021-33445566" },
    { nama: "CV Jaya Persada", contact: "021-22334455" },
  ];

  const supplierList = [];
  for (const sup of supplierData) {
    const supplier = await prisma.suplier.upsert({
      where: { suplier_id: supplierData.indexOf(sup) + 1 },
      update: {},
      create: {
        nama: sup.nama,
        contact: sup.contact,
      },
    });
    supplierList.push(supplier);
  }
  console.log(`✅ ${supplierList.length} supplier berhasil dibuat`);

  // 4. Buat Produk
  console.log("📝 Membuat produk...");
  const produkData = [
    {
      name: "Kulkas Samsung RT38",
      description: "Kulkas 2 pintu, kapasitas 500L, hemat energi",
      price: 9700000,
      stock: 10,
      categori_id: 1,
      suplier_id: 1,
      image: "/uploads/kulkas-samsung.jpg",
    },
    {
      name: "Kulkas LG GN",
      description: "Kulkas side-by-side premium, fitur ice maker",
      price: 12500000,
      stock: 7,
      categori_id: 1,
      suplier_id: 2,
      image: "/uploads/kulkas-lg.jpg",
    },
    {
      name: "Kipas Angin Miyako 16inch",
      description: "Kipas angin berdiri, 3 kecepatan",
      price: 350000,
      stock: 35,
      categori_id: 2,
      suplier_id: 3,
      image: "/uploads/kipas-miyako.jpg",
    },
    {
      name: "Lampu Panasonic Neo slim 18W",
      description: "Lampu LED 18W, hangat, tahan 25.000 jam",
      price: 150000,
      stock: 150,
      categori_id: 3,
      suplier_id: 4,
      image: "/uploads/lampu-panasonic.jpg",
    },
    {
      name: "TV LG 50",
      description: "TV OLED 4K HDR, AI ThinQ",
      price: 30000000,
      stock: 5,
      categori_id: 1,
      suplier_id: 5,
      image: "/uploads/tv-lg.jpg",
    },
    {
      name: "Speaker JBL Flip 5",
      description: "Speaker bluetooth waterproof, bass ekstra",
      price: 600000,
      stock: 20,
      categori_id: 4,
      suplier_id: 6,
      image: "/uploads/speaker-jbl.jpg",
    },
    {
      name: "Microwave Panasonic NN101",
      description: "Microwave 20L, grill & defrost",
      price: 1200000,
      stock: 15,
      categori_id: 5,
      suplier_id: 7,
      image: "/uploads/microwave-panasonic.jpg",
    },
    {
      name: "AC Daikin FTV",
      description: "AC 1 PK, inverter, hemat listrik",
      price: 4500000,
      stock: 8,
      categori_id: 1,
      suplier_id: 1,
      image: "/uploads/ac-daikin.jpg",
    },
    {
      name: "Mesin Cuci Samsung WA90",
      description: "Mesin cuci 9kg, top loading",
      price: 3200000,
      stock: 12,
      categori_id: 1,
      suplier_id: 1,
      image: "/uploads/mesin-cuci-samsung.jpg",
    },
    {
      name: "Blender Philips HR",
      description: "Blender 2L, 600W, 5 kecepatan",
      price: 450000,
      stock: 25,
      categori_id: 5,
      suplier_id: 4,
      image: "/uploads/blender-philips.jpg",
    },
  ];

  for (const prod of produkData) {
    await prisma.produk.create({
      data: prod,
    });
  }
  console.log(`✅ ${produkData.length} produk berhasil dibuat`);

  // 5. Buat Barang Masuk (sample data)
  console.log("📝 Membuat data barang masuk...");
  const barangMasukData = [
    {
      nama: "Kulkas Samsung RT38",
      kategori: "Elektronik",
      supplier: "PT Jaya Kaya",
      deskripsi: "Kulkas 2 pintu untuk stok awal",
      harga: 9700000,
      qty: 10,
      total: 97000000,
      tanggal: new Date("2025-11-01"),
      gambar: "/uploads/kulkas-samsung.jpg",
    },
    {
      nama: "Kipas Angin Miyako 16inch",
      kategori: "Peralatan Rumah",
      supplier: "PT Jay Aul",
      deskripsi: "Kipas angin berdiri",
      harga: 350000,
      qty: 35,
      total: 12250000,
      tanggal: new Date("2025-11-02"),
      gambar: "/uploads/kipas-miyako.jpg",
    },
    {
      nama: "Lampu Panasonic Neo slim 18W",
      kategori: "Pencahayaan",
      supplier: "PT MPTI",
      deskripsi: "Lampu LED hemat energi",
      harga: 150000,
      qty: 150,
      total: 22500000,
      tanggal: new Date("2025-11-03"),
      gambar: "/uploads/lampu-panasonic.jpg",
    },
  ];

  for (const item of barangMasukData) {
    await prisma.barang_masuk.create({
      data: item,
    });
  }
  console.log(`✅ ${barangMasukData.length} data barang masuk berhasil dibuat`);

  // 6. Buat Barang Keluar (sample data)
  console.log("📝 Membuat data barang keluar...");
  const barangKeluarData = [
    {
      nama: "Kulkas Samsung RT38",
      kategori: "Elektronik",
      supplier: "PT Jaya Kaya",
      deskripsi: "Terjual ke customer",
      harga: 10500000,
      qty: 2,
      total: 21000000,
      tanggal: new Date("2025-11-05"),
      gambar: "/uploads/kulkas-samsung.jpg",
    },
    {
      nama: "Kipas Angin Miyako 16inch",
      kategori: "Peralatan Rumah",
      supplier: "PT Jay Aul",
      deskripsi: "Terjual ke toko retail",
      harga: 400000,
      qty: 10,
      total: 4000000,
      tanggal: new Date("2025-11-06"),
      gambar: "/uploads/kipas-miyako.jpg",
    },
    {
      nama: "Lampu Panasonic Neo slim 18W",
      kategori: "Pencahayaan",
      supplier: "PT MPTI",
      deskripsi: "Proyek penerangan",
      harga: 180000,
      qty: 50,
      total: 9000000,
      tanggal: new Date("2025-11-07"),
      gambar: "/uploads/lampu-panasonic.jpg",
    },
  ];

  for (const item of barangKeluarData) {
    await prisma.barang_keluar.create({
      data: item,
    });
  }
  console.log(`✅ ${barangKeluarData.length} data barang keluar berhasil dibuat`);

  console.log("\n🎉 Seeding selesai!");
  console.log("\n📊 Ringkasan:");
  console.log(`   - Admin: 1 (username: admin, password: admin123)`);
  console.log(`   - Kategori: ${kategoriList.length}`);
  console.log(`   - Supplier: ${supplierList.length}`);
  console.log(`   - Produk: ${produkData.length}`);
  console.log(`   - Barang Masuk: ${barangMasukData.length}`);
  console.log(`   - Barang Keluar: ${barangKeluarData.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
