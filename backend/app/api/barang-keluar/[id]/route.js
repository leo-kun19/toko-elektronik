import { PrismaClient } from "@prisma/client";

import { handleCorsOptions } from "../../../lib/cors.js";

const prisma = new PrismaClient();

// GET - Ambil barang keluar by ID

export async function OPTIONS() {
  return handleCorsOptions();
}

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);

    const barangKeluar = await prisma.barang_keluar.findUnique({
      where: { id }
    });

    if (!barangKeluar) {
      return Response.json(
        { success: false, error: "Barang keluar tidak ditemukan" },
        {
          status: 404
        }
      );
    }

    return Response.json(
      {
        success: true,
        data: barangKeluar
      },
      {
      }
    );
  } catch (error) {
    console.error("Error fetching barang keluar:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data barang keluar" },
      {
        status: 500
      }
    );
  }
}

// PUT - Update barang keluar
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { nama, kategori, supplier, deskripsi, harga, qty, tanggal, gambar } = body;

    // Ambil data lama untuk menghitung selisih qty
    const oldData = await prisma.barang_keluar.findUnique({
      where: { id }
    });

    if (!oldData) {
      return Response.json(
        { success: false, error: "Barang keluar tidak ditemukan" },
        {
          status: 404
        }
      );
    }

    const qtyNum = qty !== undefined ? parseInt(qty) : oldData.qty;
    const hargaNum = harga !== undefined ? parseFloat(harga) : parseFloat(oldData.harga);
    const total = qtyNum * hargaNum;

    const barangKeluar = await prisma.barang_keluar.update({
      where: { id },
      data: {
        nama: nama || undefined,
        kategori: kategori !== undefined ? kategori : undefined,
        supplier: supplier !== undefined ? supplier : undefined,
        deskripsi: deskripsi !== undefined ? deskripsi : undefined,
        harga: harga !== undefined ? hargaNum : undefined,
        qty: qty !== undefined ? qtyNum : undefined,
        total,
        tanggal: tanggal ? new Date(tanggal) : undefined,
        gambar: gambar !== undefined ? gambar : undefined
      }
    });

    // Update stok produk jika qty berubah
    if (qty !== undefined && qty !== oldData.qty) {
      const diffQty = oldData.qty - qtyNum; // Kebalikan dari barang masuk
      const produk = await prisma.produk.findFirst({
        where: {
          name: {
            equals: nama || oldData.nama,
            mode: "insensitive"
          }
        }
      });

      if (produk) {
        await prisma.produk.update({
          where: { produk_id: produk.produk_id },
          data: {
            stock: Math.max(0, produk.stock + diffQty),
            updated_at: new Date()
          }
        });
      }
    }

    return Response.json(
      {
        success: true,
        message: "Barang keluar berhasil diupdate",
        data: barangKeluar
      },
      {
      }
    );
  } catch (error) {
    console.error("Error updating barang keluar:", error);
    return Response.json(
      { success: false, error: "Gagal mengupdate barang keluar" },
      {
        status: 500
      }
    );
  }
}

// DELETE - Hapus barang keluar
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    const barangKeluar = await prisma.barang_keluar.findUnique({
      where: { id }
    });

    if (!barangKeluar) {
      return Response.json(
        { success: false, error: "Barang keluar tidak ditemukan" },
        {
          status: 404
        }
      );
    }

    await prisma.barang_keluar.delete({
      where: { id }
    });

    // Tambah kembali stok produk
    const produk = await prisma.produk.findFirst({
      where: {
        name: {
          equals: barangKeluar.nama,
          mode: "insensitive"
        }
      }
    });

    if (produk) {
      await prisma.produk.update({
        where: { produk_id: produk.produk_id },
        data: {
          stock: produk.stock + barangKeluar.qty,
          updated_at: new Date()
        }
      });
    }

    return Response.json(
      {
        success: true,
        message: "Barang keluar berhasil dihapus"
      },
      {
      }
    );
  } catch (error) {
    console.error("Error deleting barang keluar:", error);
    return Response.json(
      { success: false, error: "Gagal menghapus barang keluar" },
      {
        status: 500
      }
    );
  }
}
