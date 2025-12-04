import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    // Get all suppliers
    const suppliers = await prisma.suplier.findMany({
      orderBy: { suplier_id: "asc" }
    });

    // Get all categories
    const categories = await prisma.categori.findMany({
      orderBy: { categori_id: "asc" }
    });

    // Get all products count
    const produkCount = await prisma.produk.count();

    // Get recent products
    const recentProduk = await prisma.produk.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
      include: {
        categori: true,
        suplier: true
      }
    });

    return Response.json({
      success: true,
      data: {
        suppliers: suppliers,
        supplierCount: suppliers.length,
        categories: categories,
        categoryCount: categories.length,
        produkCount: produkCount,
        recentProduk: recentProduk.map(p => ({
          id: p.produk_id,
          name: p.name,
          kategori: p.categori?.name,
          supplier: p.suplier?.nama,
          price: p.price,
          stock: p.stock
        }))
      }
    }, { status: 200, headers });
  } catch (error) {
    console.error("Debug DB error:", error);
    return Response.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500, headers });
  }
}
