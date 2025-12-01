import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:5173",
      "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

// GET - Ambil kategori by ID
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
            username: true,
          },
        },
      },
    });

    if (!kategori) {
      return Response.json(
        { success: false, error: "Kategori tidak ditemukan" },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }

    return Response.json(
      {
        success: true,
        data: kategori,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching kategori:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data kategori" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
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
        admin_id: admin_id !== undefined ? (admin_id ? parseInt(admin_id) : null) : undefined,
      },
      include: {
        admin: {
          select: {
            admin_id: true,
            username: true,
          },
        },
      },
    });

    return Response.json(
      {
        success: true,
        message: "Kategori berhasil diupdate",
        data: kategori,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  } catch (error) {
    console.error("Error updating kategori:", error);
    return Response.json(
      { success: false, error: "Gagal mengupdate kategori" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  }
}

// DELETE - Hapus kategori
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    // Cek apakah ada produk yang menggunakan kategori ini
    const produkCount = await prisma.produk.count({
      where: { categori_id: id },
    });

    if (produkCount > 0) {
      return Response.json(
        { 
          success: false, 
          error: `Tidak dapat menghapus kategori. Masih ada ${produkCount} produk yang menggunakan kategori ini.` 
        },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }

    await prisma.categori.delete({
      where: { categori_id: id },
    });

    return Response.json(
      {
        success: true,
        message: "Kategori berhasil dihapus",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting kategori:", error);
    return Response.json(
      { success: false, error: "Gagal menghapus kategori" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  }
}
