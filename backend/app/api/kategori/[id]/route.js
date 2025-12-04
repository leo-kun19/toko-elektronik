import { PrismaClient } from "@prisma/client";

import { handleCorsOptions, getCorsHeaders } from "../../../lib/cors.js";

const prisma = new PrismaClient();

// GET - Ambil kategori by ID

export async function OPTIONS() {
  return handleCorsOptions();
}

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);

    const kategori = await prisma.categori.findUnique({
      where: { categori_id: id },
      include: {
        produk: true,
        admin: {
          select: {
            admin_id: true,
            username: true
          }
        }
      }
    });

    if (!kategori) {
      return Response.json(
        { success: false, error: "Kategori tidak ditemukan" }, { status: 404, headers: getCorsHeaders() });
    }

    return Response.json(
      {
        success: true,
        data: kategori
      }, { status: 200, headers: getCorsHeaders() });
  } catch (error) {
    console.error("Error fetching kategori:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data kategori" }, { status: 500, headers: getCorsHeaders() });
  }
}

// PUT - Update kategori
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name, description, admin_id } = body;

    const kategori = await prisma.categori.update({
      where: { categori_id: id },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        admin_id: admin_id !== undefined ? (admin_id ? parseInt(admin_id) : null) : undefined
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
        message: "Kategori berhasil diupdate",
        data: kategori
      }, { status: 200, headers: getCorsHeaders() });
  } catch (error) {
    console.error("Error updating kategori:", error);
    return Response.json(
      { success: false, error: "Gagal mengupdate kategori" }, { status: 500, headers: getCorsHeaders() });
  }
}

// DELETE - Hapus kategori
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    // Cek apakah ada produk yang menggunakan kategori ini
    const produkCount = await prisma.produk.count({
      where: { categori_id: id }
    });

    if (produkCount > 0) {
      return Response.json(
        { 
          success: false, 
          error: `Tidak dapat menghapus kategori. Masih ada ${produkCount} produk yang menggunakan kategori ini.` 
        }, { status: 400, headers: getCorsHeaders() });
    }

    await prisma.categori.delete({
      where: { categori_id: id }
    });

    return Response.json(
      {
        success: true,
        message: "Kategori berhasil dihapus"
      }, { status: 200, headers: getCorsHeaders() });
  } catch (error) {
    console.error("Error deleting kategori:", error);
    return Response.json(
      { success: false, error: "Gagal menghapus kategori" }, { status: 500, headers: getCorsHeaders() });
  }
}
