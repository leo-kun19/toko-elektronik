import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:5173",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

// GET - Ambil semua stok barang (produk) dengan format frontend
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const kategori = searchParams.get("kategori");
    const supplier = searchParams.get("supplier");
    const tanggal = searchParams.get("tanggal");

    const where = {};
    
    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }
    
    if (kategori) {
      where.categori = {
        name: kategori,
      };
    }
    
    if (supplier) {
      where.suplier = {
        nama: supplier,
      };
    }

    const produk = await prisma.produk.findMany({
      where,
      include: {
        categori: true,
        suplier: true,
      },
      orderBy: {
        updated_at: "desc",
      },
    });

    // Transform ke format frontend
    const stokBarang = produk.map(p => ({
      id: p.produk_id,
      brand: p.name.split(" ")[0] || "", // Ambil kata pertama sebagai brand
      nama: p.name,
      kategori: p.categori?.name || "",
      supplier: p.suplier?.nama || "",
      deskripsi: p.description || "",
      harga: parseFloat(p.price),
      stok: p.stock,
      tanggal: p.updated_at ? p.updated_at.toISOString().split('T')[0] : "",
      gambar: p.image ? `http://localhost:3001/api${p.image}` : "http://localhost:3001/api/images/default.jpg",
    }));

    // Filter by tanggal jika ada
    let filtered = stokBarang;
    if (tanggal) {
      filtered = stokBarang.filter(item => item.tanggal === tanggal);
    }

    return Response.json(
      {
        success: true,
        data: filtered,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching stok:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data stok" },
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

// POST - Tambah stok barang baru
export async function POST(request) {
  try {
    const body = await request.json();
    const { brand, nama, kategori, supplier, deskripsi, harga, stok, tanggal, gambar } = body;

    if (!nama || !harga) {
      return Response.json(
        { success: false, error: "Nama dan harga harus diisi" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }

    // Cari atau buat kategori
    let kategoriId = null;
    if (kategori) {
      let kat = await prisma.categori.findFirst({
        where: { name: kategori },
      });
      if (!kat) {
        kat = await prisma.categori.create({
          data: { name: kategori, description: null },
        });
      }
      kategoriId = kat.categori_id;
    }

    // Cari atau buat supplier
    let supplierId = null;
    if (supplier) {
      let sup = await prisma.suplier.findFirst({
        where: { nama: supplier },
      });
      if (!sup) {
        sup = await prisma.suplier.create({
          data: { nama: supplier, contact: null },
        });
      }
      supplierId = sup.suplier_id;
    }

    // Buat produk
    const produk = await prisma.produk.create({
      data: {
        name: nama,
        description: deskripsi || null,
        image: gambar || null,
        price: parseFloat(harga),
        stock: parseInt(stok) || 0,
        categori_id: kategoriId,
        suplier_id: supplierId,
      },
      include: {
        categori: true,
        suplier: true,
      },
    });

    // Transform ke format frontend
    const result = {
      id: produk.produk_id,
      brand: brand || nama.split(" ")[0] || "",
      nama: produk.name,
      kategori: produk.categori?.name || "",
      supplier: produk.suplier?.nama || "",
      deskripsi: produk.description || "",
      harga: parseFloat(produk.price),
      stok: produk.stock,
      tanggal: tanggal || new Date().toISOString().split('T')[0],
      gambar: produk.image ? `http://localhost:3001/api${produk.image}` : "http://localhost:3001/api/images/default.jpg",
    };

    return Response.json(
      {
        success: true,
        message: "Stok barang berhasil ditambahkan",
        data: result,
      },
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  } catch (error) {
    console.error("Error creating stok:", error);
    return Response.json(
      { success: false, error: "Gagal menambahkan stok barang" },
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
