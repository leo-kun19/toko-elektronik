import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Hapus barang masuk/keluar yang produknya sudah tidak ada
export async function GET(request) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    // Get all product names
    const products = await prisma.produk.findMany({
      select: { name: true }
    });
    const productNames = products.map(p => p.name);

    // Find orphan barang_masuk (nama tidak ada di produk)
    const allBarangMasuk = await prisma.barang_masuk.findMany();
    const orphanMasuk = allBarangMasuk.filter(bm => !productNames.includes(bm.nama));

    // Find orphan barang_keluar
    const allBarangKeluar = await prisma.barang_keluar.findMany();
    const orphanKeluar = allBarangKeluar.filter(bk => !productNames.includes(bk.nama));

    // Delete orphans
    let deletedMasuk = 0;
    let deletedKeluar = 0;

    for (const item of orphanMasuk) {
      await prisma.barang_masuk.delete({ where: { id: item.id } });
      deletedMasuk++;
    }

    for (const item of orphanKeluar) {
      await prisma.barang_keluar.delete({ where: { id: item.id } });
      deletedKeluar++;
    }

    return Response.json({
      success: true,
      message: "Orphan records cleaned up",
      deleted: {
        barang_masuk: deletedMasuk,
        barang_keluar: deletedKeluar,
        orphan_masuk_names: orphanMasuk.map(o => o.nama),
        orphan_keluar_names: orphanKeluar.map(o => o.nama)
      }
    }, { status: 200, headers });

  } catch (error) {
    console.error("Cleanup error:", error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers });
  }
}
