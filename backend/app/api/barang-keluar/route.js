import { PrismaClient } from "@prisma/client";

import { handleCorsOptions } from "../lib/cors.js";

const prisma = new PrismaClient();

// GET - Ambil semua barang keluar

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

    const barangKeluar = await prisma.barang_keluar.findMany({
      where,
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
    console.error("Error fetching barang keluar:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data barang keluar" },
      {
        status: 500
      }
    );
  }
}

// POST - Tambah barang keluar
export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, kategori, supplier, deskripsi, harga, qty, tanggal, gambar } = body;

    if (!nama || !harga || !qty) {
      return Response.json(
        { success: false, error: "Nama, harga, dan qty harus diisi" },
        {
          status: 400
        }
      );
    }

    const qtyNum = parseInt(qty);
    const hargaNum = parseFloat(harga);
    const total = qtyNum * hargaNum;

    // Cek stok produk
    const produk = await prisma.produk.findFirst({
      where: {
        name: {
          equals: nama,
          mode: "insensitive"
        }
      }
    });

    if (produk && produk.stock < qtyNum) {
      return Response.json(
        { 
          success: false, 
          error: `Stok tidak mencukupi. Stok tersedia: ${produk.stock}` 
        },
        {
          status: 400
        }
      );
    }

    const barangKeluar = await prisma.barang_keluar.create({
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
    if (produk) {
      await prisma.produk.update({
        where: { produk_id: produk.produk_id },
        data: {
          stock: Math.max(0, produk.stock - qtyNum),
          updated_at: new Date()
        }
      });
    }

    return Response.json(
      {
        success: true,
        message: "Barang keluar berhasil ditambahkan",
        data: barangKeluar
      },
      {
        status: 201
      }
    );
  } catch (error) {
    console.error("Error creating barang keluar:", error);
    return Response.json(
      { success: false, error: "Gagal menambahkan barang keluar" },
      {
        status: 500
      }
    );
  }
}
