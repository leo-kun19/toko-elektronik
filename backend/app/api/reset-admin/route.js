import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// GET - Reset admin password to admin123
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    
    // Security check
    if (secret !== "reset123") {
      return Response.json({ error: "Add ?secret=reset123 to reset password" }, { status: 401 });
    }

    // Hash new password
    const newPassword = "admin123";
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update admin password
    const admin = await prisma.admin.updateMany({
      where: { username: "admin" },
      data: { password: hashedPassword }
    });

    if (admin.count === 0) {
      // Create admin if not exists
      await prisma.admin.create({
        data: {
          username: "admin",
          password: hashedPassword
        }
      });
      return Response.json({ 
        success: true, 
        message: "Admin created with password: admin123" 
      });
    }

    return Response.json({ 
      success: true, 
      message: "Admin password reset to: admin123" 
    });
  } catch (error) {
    console.error("Reset error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
