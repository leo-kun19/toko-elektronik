import { PrismaClient } from "@prisma/client";

import { handleCorsOptions, getCorsHeaders } from "../../lib/cors.js";

const prisma = new PrismaClient();

// GET - Ambil semua produk

export async function OPTIONS() {
  return handleCorsOptions();
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const kategori = searchParams.get("kategori");
    const supplier = searchParams.get("supplier");

    const where = {};
    
    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive"
      };
    }
    
    if (kategori) {
      where.categori_id = parseInt(kategori);
    }
    
    if (supplier) {
      where.suplier_id = parseInt(supplier);
    }

    const produk = await prisma.produk.findMany({
      where,
      include: {
        categori: true,
        suplier: true
      },
      orderBy: {
        created_at: "desc"
      }
    });

    return Response.json(
      {
        success: true,
        data: produk
      }, { status: 200, headers: getCorsHeaders() });
  } catch (error) {
    console.error("Error fetching produk:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data produk" }, { status: 500, headers: getCorsHeaders() });
  }
}

// POST - Tambah produk baru
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, image, price, stock, categori_id, suplier_id } = body;

    if (!name || !price) {
      return Response.json(
        { success: false, error: "Nama dan harga produk harus diisi" }, { status: 400, headers: getCorsHeaders() });
    }

    const produk = await prisma.produk.create({
      data: {
        name,
        description: description || null,
        image: image || null,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        categori_id: categori_id ? parseInt(categori_id) : null,
        suplier_id: suplier_id ? parseInt(suplier_id) : null
      },
      include: {
        categori: true,
        suplier: true
      }
    });

    return Response.json(
      {
        success: true,
        message: "Produk berhasil ditambahkan",
        data: produk
      }, { status: 201, headers: getCorsHeaders() });
  } catch (error) {
    console.error("Error creating produk:", error);
    return Response.json(
      { success: false, error: "Gagal menambahkan produk" }, { status: 500, headers: getCorsHeaders() });
  }
}
