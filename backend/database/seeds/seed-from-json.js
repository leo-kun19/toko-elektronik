import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Mulai seeding database dari FINAL_SEED.json...\n");

  try {
    // Baca file JSON
    const jsonPath = join(__dirname, "../../prisma/FINAL_SEED.json");
    const jsonData = JSON.parse(readFileSync(jsonPath, "utf-8"));

    // 1. Buat Admin
    console.log("📝 Membuat admin...");
    const hashedPassword = await bcrypt.hash("12345", 10);
    
    const admin = await prisma.admin.upsert({
      where: { username: "admin" },
      update: {
        password: hashedPassword,
      },
      create: {
        username: "admin",
        password: hashedPassword,
      },
    });
    console.log("✅ Admin berhasil dibuat:", admin.username);

    // 2. Seed Kategori
    if (jsonData.categori && jsonData.categori.length > 0) {
      console.log("\n📝 Membuat kategori...");
      for (const kat of jsonData.categori) {
        await prisma.categori.upsert({
          where: { categori_id: kat.categori_id },
          update: {
            name: kat.name,
            description: kat.description,
            admin_id: kat.admin_id,
          },
          create: {
            categori_id: kat.categori_id,
            name: kat.name,
            description: kat.description,
            admin_id: kat.admin_id,
          },
        });
      }
      console.log(`✅ ${jsonData.categori.length} kategori berhasil dibuat`);
    }

    // 3. Skip Supplier - akan diisi manual oleh user
    console.log("\n⏭️  Supplier: Tidak di-seed (akan diisi manual)");

    // 3b. Tambahkan supplier yang hilang (dari produk)
    console.log("\n📝 Memeriksa supplier yang hilang...");
    const uniqueSupplierIds = [...new Set(jsonData.produk.map(p => p.suplier_id).filter(id => id))];
    const existingSuppliers = await prisma.suplier.findMany();
    const existingIds = existingSuppliers.map(s => s.suplier_id);
    
    const missingIds = uniqueSupplierIds.filter(id => !existingIds.includes(id));
    
    if (missingIds.length > 0) {
      console.log(`   Menambahkan ${missingIds.length} supplier yang hilang...`);
      for (const id of missingIds) {
        await prisma.suplier.create({
          data: {
            suplier_id: id,
            nama: `Supplier ${id}`,
            contact: `08123456789${id}`,
          },
        });
      }
      console.log(`✅ ${missingIds.length} supplier tambahan berhasil dibuat`);
    } else {
      console.log(`✅ Semua supplier sudah lengkap`);
    }

    // 4. Seed Produk
    if (jsonData.produk && jsonData.produk.length > 0) {
      console.log("\n📝 Membuat produk...");
      let count = 0;
      for (const prod of jsonData.produk) {
        await prisma.produk.upsert({
          where: { produk_id: prod.produk_id },
          update: {
            categori_id: prod.categori_id,
            suplier_id: prod.suplier_id,
            name: prod.name,
            description: prod.description,
            image: prod.image,
            price: parseFloat(prod.price),
            stock: parseInt(prod.stock),
            updated_at: prod.updated_at ? new Date(prod.updated_at) : new Date(),
          },
          create: {
            produk_id: prod.produk_id,
            categori_id: prod.categori_id,
            suplier_id: prod.suplier_id,
            name: prod.name,
            description: prod.description,
            image: prod.image,
            price: parseFloat(prod.price),
            stock: parseInt(prod.stock),
            created_at: prod.created_at ? new Date(prod.created_at) : new Date(),
            updated_at: prod.updated_at ? new Date(prod.updated_at) : new Date(),
          },
        });
        count++;
        if (count % 10 === 0) {
          process.stdout.write(`   Progress: ${count}/${jsonData.produk.length}\r`);
        }
      }
      console.log(`\n✅ ${jsonData.produk.length} produk berhasil dibuat`);
    }

    // 5. Seed Barang Masuk (sample data)
    console.log("\n📝 Membuat barang masuk (sample)...");
    const sampleProducts = await prisma.produk.findMany({ take: 10 });
    let barangMasukCount = 0;
    
    for (const prod of sampleProducts) {
      const kategori = await prisma.categori.findUnique({ where: { categori_id: prod.categori_id } });
      const supplier = await prisma.suplier.findUnique({ where: { suplier_id: prod.suplier_id } });
      
      const qty = Math.floor(Math.random() * 20) + 5; // 5-25 unit
      const harga = parseFloat(prod.price);
      const total = qty * harga;
      
      await prisma.barang_masuk.create({
        data: {
          nama: prod.name,
          kategori: kategori?.name || "Elektronik",
          supplier: supplier?.nama || "Supplier Default",
          deskripsi: prod.description || "Barang masuk dari supplier",
          harga: harga,
          qty: qty,
          total: total,
          tanggal: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random dalam 30 hari terakhir
          gambar: prod.image || "/src/assets/produk.jpg",
        },
      });
      barangMasukCount++;
    }
    console.log(`✅ ${barangMasukCount} barang masuk berhasil dibuat`);

    // 6. Seed Barang Keluar (sample data)
    console.log("\n📝 Membuat barang keluar (sample)...");
    let barangKeluarCount = 0;
    
    for (const prod of sampleProducts.slice(0, 8)) {
      const kategori = await prisma.categori.findUnique({ where: { categori_id: prod.categori_id } });
      const supplier = await prisma.suplier.findUnique({ where: { suplier_id: prod.suplier_id } });
      
      const qty = Math.floor(Math.random() * 10) + 1; // 1-10 unit
      const harga = parseFloat(prod.price) * 1.2; // Harga jual 20% lebih tinggi
      const total = qty * harga;
      
      await prisma.barang_keluar.create({
        data: {
          nama: prod.name,
          kategori: kategori?.name || "Elektronik",
          supplier: supplier?.nama || "Supplier Default",
          deskripsi: "Terjual ke customer",
          harga: harga,
          qty: qty,
          total: total,
          tanggal: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000), // Random dalam 20 hari terakhir
          gambar: prod.image || "/src/assets/produk.jpg",
        },
      });
      barangKeluarCount++;
    }
    console.log(`✅ ${barangKeluarCount} barang keluar berhasil dibuat`);

    console.log("\n🎉 Seeding selesai!");
    console.log("\n📊 Ringkasan:");
    console.log(`   - Admin: 1 (username: admin, password: 12345)`);
    console.log(`   - Kategori: ${jsonData.categori?.length || 0}`);
    console.log(`   - Supplier: ${missingIds.length + existingSuppliers.length}`);
    console.log(`   - Produk: ${jsonData.produk?.length || 0}`);
    console.log(`   - Barang Masuk: ${barangMasukCount}`);
    console.log(`   - Barang Keluar: ${barangKeluarCount}`);
  } catch (error) {
    console.error("\n❌ Error saat seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
