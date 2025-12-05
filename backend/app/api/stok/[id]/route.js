import { PrismaClient } from "@prisma/client";

import { handleCorsOptions, getCorsHeaders } from "../../../lib/cors.js";

const prisma = new PrismaClient();

// GET - Get stok by ID

export async function OPTIONS() {
  return handleCorsOptions();
}

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    
    const produk = await prisma.produk.findUnique({
      where: { produk_id: id },
      include: {
        categori: true,
        suplier: true
      }
    });

    if (!produk) {
      return Response.json(
        { success: false, error: "Produk tidak ditemukan" }, { status: 404, headers: getCorsHeaders() });
    }

    const result = {
      id: produk.produk_id,
      brand: produk.name.split(" ")[0] || "",
      nama: produk.name,
      kategori: produk.categori?.name || "",
      supplier: produk.suplier?.nama || "",
      deskripsi: produk.description || "",
      harga: parseFloat(produk.price),
      stok: produk.stock,
      tanggal: produk.updated_at ? produk.updated_at.toISOString().split('T')[0] : "",
      gambar: produk.image ? `/api${produk.image}` : "/api/images/default.jpg"
    };

    return Response.json(
      { success: true, data: result }, { status: 200, headers: getCorsHeaders() });
  } catch (error) {
    console.error("Error fetching stok:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data stok" }, { status: 500, headers: getCorsHeaders() });
  }
}

// PUT - Update stok
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { nama, kategori, supplier, deskripsi, harga, stok, gambar } = body;

    // Cari atau buat kategori
    let kategoriId = null;
    if (kategori) {
      let kat = await prisma.categori.findFirst({
        where: { name: kategori }
      });
      if (!kat) {
        kat = await prisma.categori.create({
          data: { name: kategori, description: null }
        });
      }
      kategoriId = kat.categori_id;
    }

    // Cari atau buat supplier
    let supplierId = null;
    if (supplier) {
      let sup = await prisma.suplier.findFirst({
        where: { nama: supplier }
      });
      if (!sup) {
        sup = await prisma.suplier.create({
          data: { nama: supplier, contact: null }
        });
      }
      supplierId = sup.suplier_id;
    }

    // Update produk
    const produk = await prisma.produk.update({
      where: { produk_id: id },
      data: {
        name: nama,
        description: deskripsi || null,
        image: gambar || null,
        price: parseFloat(harga),
        stock: parseInt(stok),
        categori_id: kategoriId,
        suplier_id: supplierId,
        updated_at: new Date()
      },
      include: {
        categori: true,
        suplier: true
      }
    });

    const result = {
      id: produk.produk_id,
      brand: produk.name.split(" ")[0] || "",
      nama: produk.name,
      kategori: produk.categori?.name || "",
      supplier: produk.suplier?.nama || "",
      deskripsi: produk.description || "",
      harga: parseFloat(produk.price),
      stok: produk.stock,
      tanggal: produk.updated_at ? produk.updated_at.toISOString().split('T')[0] : "",
      gambar: produk.image ? `/api${produk.image}` : "/api/images/default.jpg"
    };

    return Response.json(
      {
        success: true,
        message: "Stok berhasil diupdate",
        data: result
      }, { status: 200, headers: getCorsHeaders() });
  } catch (error) {
    console.error("Error updating stok:", error);
    return Response.json(
      { success: false, error: "Gagal mengupdate stok" }, { status: 500, headers: getCorsHeaders() });
  }
}

// DELETE - Delete stok (juga hapus barang masuk/keluar terkait)
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    // Get produk name first
    const produk = await prisma.produk.findUnique({
      where: { produk_id: id }
    });

    if (!produk) {
      return Response.json(
        { success: false, error: "Produk tidak ditemukan" }, { status: 404, headers: getCorsHeaders() });
    }

    // Delete related barang_masuk by nama
    const deletedMasuk = await prisma.barang_masuk.deleteMany({
      where: { nama: produk.name }
    });

    // Delete related barang_keluar by nama
    const deletedKeluar = await prisma.barang_keluar.deleteMany({
      where: { nama: produk.name }
    });

    // Delete produk
    await prisma.produk.delete({
      where: { produk_id: id }
    });

    return Response.json(
      {
        success: true,
        message: "Stok berhasil dihapus",
        deleted: {
          produk: produk.name,
          barang_masuk: deletedMasuk.count,
          barang_keluar: deletedKeluar.count
        }
      }, { status: 200, headers: getCorsHeaders() });
  } catch (error) {
    console.error("Error deleting stok:", error);
    return Response.json(
      { success: false, error: "Gagal menghapus stok" }, { status: 500, headers: getCorsHeaders() });
  }
}
