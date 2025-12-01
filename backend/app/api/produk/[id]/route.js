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

// GET - Ambil produk by ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);

    const produk = await prisma.produk.findUnique({
      where: { produk_id: id },
      include: {
        categori: true,
        suplier: true,
      },
    });

    if (!produk) {
      return Response.json(
        { success: false, error: "Produk tidak ditemukan" },
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
        data: produk,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching produk:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data produk" },
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

// PUT - Update produk
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { name, description, image, price, stock, categori_id, suplier_id } = body;

    const produk = await prisma.produk.update({
      where: { produk_id: id },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        image: image !== undefined ? image : undefined,
        price: price ? parseFloat(price) : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        categori_id: categori_id !== undefined ? (categori_id ? parseInt(categori_id) : null) : undefined,
        suplier_id: suplier_id !== undefined ? (suplier_id ? parseInt(suplier_id) : null) : undefined,
        updated_at: new Date(),
      },
      include: {
        categori: true,
        suplier: true,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Produk berhasil diupdate",
        data: produk,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  } catch (error) {
    console.error("Error updating produk:", error);
    return Response.json(
      { success: false, error: "Gagal mengupdate produk" },
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

// DELETE - Hapus produk
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    await prisma.produk.delete({
      where: { produk_id: id },
    });

    return Response.json(
      {
        success: true,
        message: "Produk berhasil dihapus",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting produk:", error);
    return Response.json(
      { success: false, error: "Gagal menghapus produk" },
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
