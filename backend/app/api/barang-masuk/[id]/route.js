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

// GET - Ambil barang masuk by ID
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);

    const barangMasuk = await prisma.barang_masuk.findUnique({
      where: { id },
    });

    if (!barangMasuk) {
      return Response.json(
        { success: false, error: "Barang masuk tidak ditemukan" },
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
        data: barangMasuk,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching barang masuk:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data barang masuk" },
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

// PUT - Update barang masuk
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { nama, kategori, supplier, deskripsi, harga, qty, tanggal, gambar } = body;

    // Ambil data lama untuk menghitung selisih qty
    const oldData = await prisma.barang_masuk.findUnique({
      where: { id },
    });

    if (!oldData) {
      return Response.json(
        { success: false, error: "Barang masuk tidak ditemukan" },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }

    const qtyNum = qty !== undefined ? parseInt(qty) : oldData.qty;
    const hargaNum = harga !== undefined ? parseFloat(harga) : parseFloat(oldData.harga);
    const total = qtyNum * hargaNum;

    const barangMasuk = await prisma.barang_masuk.update({
      where: { id },
      data: {
        nama: nama || undefined,
        kategori: kategori !== undefined ? kategori : undefined,
        supplier: supplier !== undefined ? supplier : undefined,
        deskripsi: deskripsi !== undefined ? deskripsi : undefined,
        harga: harga !== undefined ? hargaNum : undefined,
        qty: qty !== undefined ? qtyNum : undefined,
        total,
        tanggal: tanggal ? new Date(tanggal) : undefined,
        gambar: gambar !== undefined ? gambar : undefined,
      },
    });

    // Update stok produk jika qty berubah
    if (qty !== undefined && qty !== oldData.qty) {
      const diffQty = qtyNum - oldData.qty;
      const produk = await prisma.produk.findFirst({
        where: {
          name: {
            equals: nama || oldData.nama,
            mode: "insensitive",
          },
        },
      });

      if (produk) {
        await prisma.produk.update({
          where: { produk_id: produk.produk_id },
          data: {
            stock: Math.max(0, produk.stock + diffQty),
            updated_at: new Date(),
          },
        });
      }
    }

    return Response.json(
      {
        success: true,
        message: "Barang masuk berhasil diupdate",
        data: barangMasuk,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  } catch (error) {
    console.error("Error updating barang masuk:", error);
    return Response.json(
      { success: false, error: "Gagal mengupdate barang masuk" },
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

// DELETE - Hapus barang masuk
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    const barangMasuk = await prisma.barang_masuk.findUnique({
      where: { id },
    });

    if (!barangMasuk) {
      return Response.json(
        { success: false, error: "Barang masuk tidak ditemukan" },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }

    await prisma.barang_masuk.delete({
      where: { id },
    });

    // Kurangi stok produk
    const produk = await prisma.produk.findFirst({
      where: {
        name: {
          equals: barangMasuk.nama,
          mode: "insensitive",
        },
      },
    });

    if (produk) {
      await prisma.produk.update({
        where: { produk_id: produk.produk_id },
        data: {
          stock: Math.max(0, produk.stock - barangMasuk.qty),
          updated_at: new Date(),
        },
      });
    }

    return Response.json(
      {
        success: true,
        message: "Barang masuk berhasil dihapus",
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting barang masuk:", error);
    return Response.json(
      { success: false, error: "Gagal menghapus barang masuk" },
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
