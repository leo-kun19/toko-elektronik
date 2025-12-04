import { PrismaClient } from "@prisma/client";

import { handleCorsOptions, getCorsHeaders } from "../../../lib/cors.js";

const prisma = new PrismaClient();

// GET - Ambil 3 barang masuk terbaru

export async function OPTIONS() {
  return handleCorsOptions();
}

export async function GET() {
  try {
    const barangMasuk = await prisma.barang_masuk.findMany({
      take: 3,
      orderBy: {
        created_at: "desc"
      }
    });

    // Transform ke format frontend
    const transformed = barangMasuk.map(item => ({
      id: item.id,
      brand: item.nama.split(" ")[0] || "",
      nama: item.nama,
      kategori: item.kategori,
      supplier: item.supplier,
      deskripsi: item.deskripsi,
      harga: parseFloat(item.harga),
      qty: item.qty,
      total: parseFloat(item.total),
      tanggal: item.tanggal ? item.tanggal.toISOString().split('T')[0] : "",
      gambar: item.gambar ? `/api${item.gambar}` : "/api/images/default.jpg"
    }));

    return Response.json(
      {
        success: true,
        data: transformed
      }, { status: 200, headers: getCorsHeaders() });
  } catch (error) {
    console.error("Error fetching latest barang masuk:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data barang masuk terbaru" }, { status: 500, headers: getCorsHeaders() });
  }
}
