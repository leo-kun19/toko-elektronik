import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Ambil 3 barang keluar terbaru
export async function GET() {
  try {
    const barangKeluar = await prisma.barang_keluar.findMany({
      take: 3,
      orderBy: {
        created_at: "desc"
      }
    });

    // Transform ke format frontend
    const transformed = barangKeluar.map(item => ({
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
      gambar: item.gambar ? `http://localhost:3001/api${item.gambar}` : "http://localhost:3001/api/images/default.jpg"
    }));

    return Response.json(
      {
        success: true,
        data: transformed
      },
      {
      }
    );
  } catch (error) {
    console.error("Error fetching latest barang keluar:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data barang keluar terbaru" },
      {
        status: 500
      }
    );
  }
}
