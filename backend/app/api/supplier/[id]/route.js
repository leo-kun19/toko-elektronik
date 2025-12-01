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

// GET - Ambil supplier by ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);

    const supplier = await prisma.suplier.findUnique({
      where: { suplier_id: id },
      include: {
        produk: true,
      },
    });

    if (!supplier) {
      return Response.json(
        { success: false, error: "Supplier tidak ditemukan" },
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
        data: supplier,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching supplier:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data supplier" },
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

// PUT - Update supplier
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { nama, contact } = body;

    const supplier = await prisma.suplier.update({
      where: { suplier_id: id },
      data: {
        nama: nama || undefined,
        contact: contact !== undefined ? contact : undefined,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Supplier berhasil diupdate",
        data: supplier,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  } catch (error) {
    console.error("Error updating supplier:", error);
    return Response.json(
      { success: false, error: "Gagal mengupdate supplier" },
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

// DELETE - Hapus supplier
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    // Cek apakah ada produk yang menggunakan supplier ini
    const produkCount = await prisma.produk.count({
      where: { suplier_id: id },
    });

    if (produkCount > 0) {
      return Response.json(
        { 
          success: false, 
          error: `Tidak dapat menghapus supplier. Masih ada ${produkCount} produk yang menggunakan supplier ini.` 
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

    await prisma.suplier.delete({
      where: { suplier_id: id },
    });

    return Response.json(
      {
        success: true,
        message: "Supplier berhasil dihapus",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return Response.json(
      { success: false, error: "Gagal menghapus supplier" },
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
