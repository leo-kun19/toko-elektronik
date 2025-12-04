import { PrismaClient } from "@prisma/client";

import { handleCorsOptions } from "../lib/cors.js";

const prisma = new PrismaClient();

// GET - Ambil semua kategori

export async function OPTIONS() {
  return handleCorsOptions();
}

export async function GET() {
  try {
    const kategori = await prisma.categori.findMany({
      include: {
        produk: true,
        admin: {
          select: {
            admin_id: true,
            username: true
          }
        }
      },
      orderBy: {
        categori_id: "desc"
      }
    });

    return Response.json(
      {
        success: true,
        data: kategori
      },
      {
      }
    );
  } catch (error) {
    console.error("Error fetching kategori:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data kategori" },
      {
        status: 500
      }
    );
  }
}

// POST - Tambah kategori baru
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, admin_id } = body;

    if (!name) {
      return Response.json(
        { success: false, error: "Nama kategori harus diisi" },
        {
          status: 400
        }
      );
    }

    const kategori = await prisma.categori.create({
      data: {
        name,
        description: description || null,
        admin_id: admin_id ? parseInt(admin_id) : null
      },
      include: {
        admin: {
          select: {
            admin_id: true,
            username: true
          }
        }
      }
    });

    return Response.json(
      {
        success: true,
        message: "Kategori berhasil ditambahkan",
        data: kategori
      },
      {
        status: 201
      }
    );
  } catch (error) {
    console.error("Error creating kategori:", error);
    return Response.json(
      { success: false, error: "Gagal menambahkan kategori" },
      {
        status: 500
      }
    );
  }
}
