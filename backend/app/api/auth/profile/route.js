import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Get current user profile
export async function GET(request) {
  try {
    // Untuk sementara, ambil admin pertama (karena belum ada session management)
    // Nanti bisa ditambahkan JWT/session untuk multi-user
    const admin = await prisma.admin.findFirst({
      select: {
        admin_id: true,
        username: true,
        created_at: true
      }
    });

    if (!admin) {
      return Response.json(
        { success: false, error: "Admin tidak ditemukan" },
        {
          status: 404
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
          created_at: admin.created_at
        }
      },
      {
      }
    );
  } catch (error) {
    console.error("Error fetching profile:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil data profile" },
      {
        status: 500
      }
    );
  }
}
