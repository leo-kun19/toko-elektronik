import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixSequences() {
  console.log("🔧 Fixing PostgreSQL sequences...\n");

  try {
    // Fix produk sequence
    await prisma.$executeRawUnsafe(`
      SELECT setval('produk_produk_id_seq', (SELECT COALESCE(MAX(produk_id), 0) FROM produk) + 1, false);
    `);
    console.log("✅ Fixed produk_produk_id_seq");

    // Fix admin sequence
    await prisma.$executeRawUnsafe(`
      SELECT setval('admin_admin_id_seq', (SELECT COALESCE(MAX(admin_id), 0) FROM admin) + 1, false);
    `);
    console.log("✅ Fixed admin_admin_id_seq");

    // Fix categori sequence
    await prisma.$executeRawUnsafe(`
      SELECT setval('categori_categori_id_seq', (SELECT COALESCE(MAX(categori_id), 0) FROM categori) + 1, false);
    `);
    console.log("✅ Fixed categori_categori_id_seq");

    // Fix suplier sequence
    await prisma.$executeRawUnsafe(`
      SELECT setval('suplier_suplier_id_seq', (SELECT COALESCE(MAX(suplier_id), 0) FROM suplier) + 1, false);
    `);
    console.log("✅ Fixed suplier_suplier_id_seq");

    // Fix barang_masuk sequence
    await prisma.$executeRawUnsafe(`
      SELECT setval('barang_masuk_id_seq', (SELECT COALESCE(MAX(id), 0) FROM barang_masuk) + 1, false);
    `);
    console.log("✅ Fixed barang_masuk_id_seq");

    // Fix barang_keluar sequence
    await prisma.$executeRawUnsafe(`
      SELECT setval('barang_keluar_id_seq', (SELECT COALESCE(MAX(id), 0) FROM barang_keluar) + 1, false);
    `);
    console.log("✅ Fixed barang_keluar_id_seq");

    console.log("\n🎉 All sequences fixed successfully!");
  } catch (error) {
    console.error("❌ Error fixing sequences:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixSequences()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
