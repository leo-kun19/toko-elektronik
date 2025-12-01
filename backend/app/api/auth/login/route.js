import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      return Response.json(
        { error: "Username dan password harus diisi" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return Response.json(
        { error: "Username atau password salah" },
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return Response.json(
        { error: "Username atau password salah" },
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Credentials": "true",
          },
        }
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

    return Response.json(
      {
        message: "Login berhasil",
        token,
        admin: {
          admin_id: admin.admin_id,
          username: admin.username,
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
    console.error("Login error:", error);
    return Response.json(
      { error: "Terjadi kesalahan pada server" },
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
