import { PrismaClient } from "@prisma/client";

import { handleCorsOptions, getCorsHeaders } from "../../lib/cors.js";

const prisma = new PrismaClient();

// GET - Ambil semua barang masuk

export async function OPTIONS() {
  return handleCorsOptions();
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const kategori = searchParams.get("kategori");
    const supplier = searchParams.get("supplier");
    const tanggal = searchParams.get("tanggal");

    const where = {};
    
    if (search) {
      where.nama = {
        contains: search,
        mode: "insensitive"
      };
    }
    
    if (kategori) {
      where.kategori = kategori;
    }
    
    if (supplier) {
      where.supplier = supplier;
    }

    if (tanggal) {
      where.tanggal = new Date(tanggal);
    }

    const barangMasuk = await prisma.barang_masuk.findMany({
      where,
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
    console.error("Error fetching barang masuk:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data barang masuk" }, { status: 500, headers: getCorsHeaders() });
  }
}

// POST - Tambah barang masuk
export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, kategori, supplier, deskripsi, harga, qty, tanggal, gambar } = body;

    if (!nama || !harga || !qty) {
      return Response.json(
        { success: false, error: "Nama, harga, dan qty harus diisi" }, { status: 400, headers: getCorsHeaders() });
    }

    const qtyNum = parseInt(qty);
    const hargaNum = parseFloat(harga);
    const total = qtyNum * hargaNum;

    const barangMasuk = await prisma.barang_masuk.create({
      data: {
        nama,
        kategori: kategori || "",
        supplier: supplier || "",
        deskripsi: deskripsi || null,
        harga: hargaNum,
        qty: qtyNum,
        total,
        tanggal: tanggal ? new Date(tanggal) : new Date(),
        gambar: gambar || null
      }
    });

    // Update stok produk jika ada
    const produk = await prisma.produk.findFirst({
      where: {
        name: {
          equals: nama,
          mode: "insensitive"
        }
      }
    });

    if (produk) {
      await prisma.produk.update({
        where: { produk_id: produk.produk_id },
        data: {
          stock: produk.stock + qtyNum,
          updated_at: new Date()
        }
      });
    }

    return Response.json(
      {
        success: true,
        message: "Barang masuk berhasil ditambahkan",
        data: barangMasuk
      }, { status: 201, headers: getCorsHeaders() });
  } catch (error) {
    console.error("Error creating barang masuk:", error);
    return Response.json(
      { success: false, error: "Gagal menambahkan barang masuk" }, { status: 500, headers: getCorsHeaders() });
  }
}
