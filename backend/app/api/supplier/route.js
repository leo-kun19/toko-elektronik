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

// GET - Ambil semua supplier
export async function GET() {
  try {
    const supplier = await prisma.suplier.findMany({
      include: {
        produk: true,
      },
      orderBy: {
        suplier_id: "desc",
      },
    });

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

// POST - Tambah supplier baru
export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, contact } = body;

    if (!nama) {
      return Response.json(
        { success: false, error: "Nama supplier harus diisi" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }

    const supplier = await prisma.suplier.create({
      data: {
        nama,
        contact: contact || null,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Supplier berhasil ditambahkan",
        data: supplier,
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
    console.error("Error creating supplier:", error);
    return Response.json(
      { success: false, error: "Gagal menambahkan supplier" },
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
