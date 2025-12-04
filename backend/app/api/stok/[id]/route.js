import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Get stok by ID
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

    const result = {
      id: produk.produk_id,
      brand: produk.name.split(" ")[0] || "",
      nama: produk.name,
      kategori: produk.categori?.name || "",
      supplier: produk.suplier?.nama || "",
      deskripsi: produk.description || "",
      harga: parseFloat(produk.price),
      stok: produk.stock,
      tanggal: produk.updated_at ? produk.updated_at.toISOString().split('T')[0] : "",
      gambar: produk.image ? `http://localhost:3001/api${produk.image}` : "http://localhost:3001/api/images/default.jpg"
    };

    return Response.json(
      { success: true, data: result },
      {
      }
    );
  } catch (error) {
    console.error("Error fetching stok:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data stok" },
      {
        status: 500
      }
    );
  }
}

// PUT - Update stok
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { nama, kategori, supplier, deskripsi, harga, stok, gambar } = body;

    // Cari atau buat kategori
    let kategoriId = null;
    if (kategori) {
      let kat = await prisma.categori.findFirst({
        where: { name: kategori }
      });
      if (!kat) {
        kat = await prisma.categori.create({
          data: { name: kategori, description: null }
        });
      }
      kategoriId = kat.categori_id;
    }

    // Cari atau buat supplier
    let supplierId = null;
    if (supplier) {
      let sup = await prisma.suplier.findFirst({
        where: { nama: supplier }
      });
      if (!sup) {
        sup = await prisma.suplier.create({
          data: { nama: supplier, contact: null }
        });
      }
      supplierId = sup.suplier_id;
    }

    // Update produk
    const produk = await prisma.produk.update({
      where: { produk_id: id },
      data: {
        name: nama,
        description: deskripsi || null,
        image: gambar || null,
        price: parseFloat(harga),
        stock: parseInt(stok),
        categori_id: kategoriId,
        suplier_id: supplierId,
        updated_at: new Date()
      },
      include: {
        categori: true,
        suplier: true
      }
    });

    const result = {
      id: produk.produk_id,
      brand: produk.name.split(" ")[0] || "",
      nama: produk.name,
      kategori: produk.categori?.name || "",
      supplier: produk.suplier?.nama || "",
      deskripsi: produk.description || "",
      harga: parseFloat(produk.price),
      stok: produk.stock,
      tanggal: produk.updated_at ? produk.updated_at.toISOString().split('T')[0] : "",
      gambar: produk.image ? `http://localhost:3001/api${produk.image}` : "http://localhost:3001/api/images/default.jpg"
    };

    return Response.json(
      {
        success: true,
        message: "Stok berhasil diupdate",
        data: result
      },
      {
      }
    );
  } catch (error) {
    console.error("Error updating stok:", error);
    return Response.json(
      { success: false, error: "Gagal mengupdate stok" },
      {
        status: 500
      }
    );
  }
}

// DELETE - Delete stok
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    await prisma.produk.delete({
      where: { produk_id: id }
    });

    return Response.json(
      {
        success: true,
        message: "Stok berhasil dihapus"
      },
      {
      }
    );
  } catch (error) {
    console.error("Error deleting stok:", error);
    return Response.json(
      { success: false, error: "Gagal menghapus stok" },
      {
        status: 500
      }
    );
  }
}
