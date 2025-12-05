import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fix ALL sequences
export async function GET(request) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const results = {};

    // Fix produk sequence
    const maxProduk = await prisma.produk.findFirst({ orderBy: { produk_id: "desc" } });
    const produkMaxId = maxProduk?.produk_id || 0;
    await prisma.$executeRawUnsafe(`SELECT setval('produk_produk_id_seq', ${produkMaxId}, true)`);
    results.produk = { max_id: produkMaxId, next_id: produkMaxId + 1 };

    // Fix suplier sequence
    const maxSuplier = await prisma.suplier.findFirst({ orderBy: { suplier_id: "desc" } });
    const suplierMaxId = maxSuplier?.suplier_id || 0;
    await prisma.$executeRawUnsafe(`SELECT setval('suplier_suplier_id_seq', ${suplierMaxId}, true)`);
    results.suplier = { max_id: suplierMaxId, next_id: suplierMaxId + 1 };

    // Fix categori sequence
    const maxCategori = await prisma.categori.findFirst({ orderBy: { categori_id: "desc" } });
    const categoriMaxId = maxCategori?.categori_id || 0;
    await prisma.$executeRawUnsafe(`SELECT setval('categori_categori_id_seq', ${categoriMaxId}, true)`);
    results.categori = { max_id: categoriMaxId, next_id: categoriMaxId + 1 };

    // Fix barang_masuk sequence
    const maxBarangMasuk = await prisma.barang_masuk.findFirst({ orderBy: { id: "desc" } });
    const barangMasukMaxId = maxBarangMasuk?.id || 0;
    await prisma.$executeRawUnsafe(`SELECT setval('barang_masuk_id_seq', ${barangMasukMaxId}, true)`);
    results.barang_masuk = { max_id: barangMasukMaxId, next_id: barangMasukMaxId + 1 };

    // Fix barang_keluar sequence
    const maxBarangKeluar = await prisma.barang_keluar.findFirst({ orderBy: { id: "desc" } });
    const barangKeluarMaxId = maxBarangKeluar?.id || 0;
    await prisma.$executeRawUnsafe(`SELECT setval('barang_keluar_id_seq', ${barangKeluarMaxId}, true)`);
    results.barang_keluar = { max_id: barangKeluarMaxId, next_id: barangKeluarMaxId + 1 };

    // Fix admin sequence
    const maxAdmin = await prisma.admin.findFirst({ orderBy: { admin_id: "desc" } });
    const adminMaxId = maxAdmin?.admin_id || 0;
    await prisma.$executeRawUnsafe(`SELECT setval('admin_admin_id_seq', ${adminMaxId}, true)`);
    results.admin = { max_id: adminMaxId, next_id: adminMaxId + 1 };

    return Response.json({
      success: true,
      message: "All sequences fixed successfully",
      data: results
    }, { status: 200, headers });

  } catch (error) {
    console.error("Fix sequence error:", error);
    return Response.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500, headers });
  }
}
