import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Seeding dimulai...");

  // Baca file JSON final (hasil merge data)
  const seed = JSON.parse(fs.readFileSync("./prisma/FINAL_SEED.json", "utf-8"));

  // Hapus data lama supaya tidak double
  await prisma.produk.deleteMany();
  await prisma.categori.deleteMany();
  await prisma.suplier.deleteMany();
  await prisma.admin.deleteMany();

  // ------------------ Seed Admin ------------------
  const hashedPassword = await bcrypt.hash("12345", 10);

  await prisma.admin.create({
    data: {
      username: "admin",
      password: hashedPassword,
    },
  });

  console.log("✅ Admin dibuat");

  // ------------------ Seed Categori ------------------
  console.log("➡️ Seeding kategori...");

  const categoryMap = {}; // mapping JSON id → ID database

  for (const cat of seed.categori) {
    const created = await prisma.categori.create({
      data: {
        name: cat.name,
        description: cat.description ?? null,
      },
    });

    categoryMap[cat.categori_id] = created.categori_id;
  }

  console.log("✅ Category selesai disimpan");

  // ------------------ Seed Suplier ------------------
  console.log("➡️ Seeding suplier...");

  const suplierMap = {};

  for (const sup of seed.suplier) {
    const created = await prisma.suplier.create({
      data: {
        nama: sup.nama,
        contact: sup.contact ?? null,
      },
    });

    suplierMap[sup.suplier_id] = created.suplier_id;
  }

  console.log("✅ Suplier selesai disimpan");

  // ------------------ Seed Produk ------------------
  console.log("➡️ Seeding produk...");

  for (const item of seed.produk) {
    await prisma.produk.create({
      data: {
        name: item.name,
        description: item.description ?? null,
        image: item.image ?? null,
        price: item.price,
        stock: item.stock ?? 0,
        categori_id: categoryMap[item.categori_id], // pakai ID hasil insert
        suplier_id: suplierMap[item.suplier_id],   // pakai ID hasil insert
        created_at: new Date(item.created_at),
        updated_at: new Date(item.updated_at),
      },
    });
  }

  console.log("✅ Produk selesai disimpan");
  console.log("🎉 Semua seeding berhasil!");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
