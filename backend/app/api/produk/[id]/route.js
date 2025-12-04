import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Ambil produk by ID
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
        { success: false, error: "Produk tidak ditemukan" },
        {
          status: 404
        }
      );
    }

    return Response.json(
      {
        success: true,
        data: produk
      },
      {
      }
    );
  } catch (error) {
    console.error("Error fetching produk:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data produk" },
      {
        status: 500
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
        updated_at: new Date()
      },
      include: {
        categori: true,
        suplier: true
      }
    });

    return Response.json(
      {
        success: true,
        message: "Produk berhasil diupdate",
        data: produk
      },
      {
      }
    );
  } catch (error) {
    console.error("Error updating produk:", error);
    return Response.json(
      { success: false, error: "Gagal mengupdate produk" },
      {
        status: 500
      }
    );
  }
}

// DELETE - Hapus produk
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    await prisma.produk.delete({
      where: { produk_id: id }
    });

    return Response.json(
      {
        success: true,
        message: "Produk berhasil dihapus"
      },
      {
      }
    );
  } catch (error) {
    console.error("Error deleting produk:", error);
    return Response.json(
      { success: false, error: "Gagal menghapus produk" },
      {
        status: 500
      }
    );
  }
}
