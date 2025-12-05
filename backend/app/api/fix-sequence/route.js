import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fix sequence untuk produk_id
export async function GET(request) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    // Get max produk_id
    const maxProduk = await prisma.produk.findFirst({
      orderBy: { produk_id: "desc" }
    });
    
    const maxId = maxProduk?.produk_id || 0;
    
    // Reset sequence to max + 1
    await prisma.$executeRawUnsafe(
      `SELECT setval('produk_produk_id_seq', ${maxId + 1}, false)`
    );

    // Also fix other sequences
    const maxBarangMasuk = await prisma.barang_masuk.findFirst({
      orderBy: { id: "desc" }
    });
    if (maxBarangMasuk) {
      await prisma.$executeRawUnsafe(
        `SELECT setval('barang_masuk_id_seq', ${maxBarangMasuk.id + 1}, false)`
      );
    }

    const maxBarangKeluar = await prisma.barang_keluar.findFirst({
      orderBy: { id: "desc" }
    });
    if (maxBarangKeluar) {
      await prisma.$executeRawUnsafe(
        `SELECT setval('barang_keluar_id_seq', ${maxBarangKeluar.id + 1}, false)`
      );
    }

    return Response.json({
      success: true,
      message: "Sequences fixed successfully",
      data: {
        produk_max_id: maxId,
        produk_next_id: maxId + 1,
        barang_masuk_max_id: maxBarangMasuk?.id || 0,
        barang_keluar_max_id: maxBarangKeluar?.id || 0
      }
    }, { status: 200, headers });

  } catch (error) {
    console.error("Fix sequence error:", error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers });
  }
}
