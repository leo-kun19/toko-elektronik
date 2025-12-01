import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:5173",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

// GET - Get current user profile
export async function GET(request) {
  try {
    // Untuk sementara, ambil admin pertama (karena belum ada session management)
    // Nanti bisa ditambahkan JWT/session untuk multi-user
    const admin = await prisma.admin.findFirst({
      select: {
        admin_id: true,
        username: true,
        created_at: true,
      },
    });

    if (!admin) {
      return Response.json(
        { success: false, error: "Admin tidak ditemukan" },
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
        data: {
          id: admin.admin_id,
          username: admin.username,
          name: admin.username, // Bisa ditambahkan field 'name' di schema jika perlu
          role: "Admin",
          created_at: admin.created_at,
        },
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching profile:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data profile" },
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
