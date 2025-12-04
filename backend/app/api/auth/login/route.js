import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { handleCorsOptions, corsResponse } from "../../../lib/cors.js";

const prisma = new PrismaClient();

export async function OPTIONS() {
  return handleCorsOptions();
}

export async function GET() {
  return Response.json({
    message: "Login endpoint tersedia",
    method: "POST",
    endpoint: "/api/auth/login",
    body: {
      username: "string",
      password: "string",
    },
  });
}

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return corsResponse(
        { error: "Username dan password harus diisi" },
        400
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return corsResponse(
        { error: "Username atau password salah" },
        401
      );
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return corsResponse(
        { error: "Username atau password salah" },
        401
      );
    }

    const token = jwt.sign(
      {
        admin_id: admin.admin_id,
        username: admin.username,
      },
      process.env.JWT_SECRET || "your-jwt-secret-key",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return corsResponse({
      message: "Login berhasil",
      token,
      admin: {
        admin_id: admin.admin_id,
        username: admin.username,
        created_at: admin.created_at,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return corsResponse(
      { error: "Terjadi kesalahan pada server" },
      500
    );
  }
}
