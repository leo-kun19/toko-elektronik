import { PrismaClient } from "@prisma/client";

import { handleCorsOptions, getCorsHeaders } from "../../lib/cors.js";

const prisma = new PrismaClient();

// GET - Ambil semua supplier

export async function OPTIONS() {
  return handleCorsOptions();
}

export async function GET() {
  try {
    const supplier = await prisma.suplier.findMany({
      include: {
        produk: true
      },
      orderBy: {
        suplier_id: "desc"
      }
    });

    return Response.json(
      {
        success: true,
        data: supplier
      }, { status: 200, headers: getCorsHeaders() });
  } catch (error) {
    console.error("Error fetching supplier:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data supplier" }, { status: 500, headers: getCorsHeaders() });
  }
}

// POST - Tambah supplier baru
export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, contact } = body;

    if (!nama) {
      return Response.json(
        { success: false, error: "Nama supplier harus diisi" }, { status: 400, headers: getCorsHeaders() });
    }

    const supplier = await prisma.suplier.create({
      data: {
        nama,
        contact: contact || null
      }
    });

    return Response.json(
      {
        success: true,
        message: "Supplier berhasil ditambahkan",
        data: supplier
      }, { status: 201, headers: getCorsHeaders() });
  } catch (error) {
    console.error("Error creating supplier:", error);
    return Response.json(
      { success: false, error: "Gagal menambahkan supplier" }, { status: 500, headers: getCorsHeaders() });
  }
}
