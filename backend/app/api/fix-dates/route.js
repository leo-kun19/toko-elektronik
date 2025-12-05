import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Update tanggal produk ke range Oktober - Desember 2025
export async function GET(request) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    // Get all products
    const products = await prisma.produk.findMany();
    
    const results = [];
    
    for (let i = 0; i < products.length; i++) {
      // Random date between Oct 1, 2025 and Dec 5, 2025
      const month = Math.floor(Math.random() * 3) + 10; // 10, 11, or 12
      const maxDay = month === 12 ? 5 : (month === 11 ? 30 : 31);
      const day = Math.floor(Math.random() * maxDay) + 1;
      
      const newDate = new Date(2025, month - 1, day);
      
      await prisma.produk.update({
        where: { produk_id: products[i].produk_id },
        data: { updated_at: newDate }
      });
      
      results.push({
        id: products[i].produk_id,
        name: products[i].name,
        newDate: newDate.toISOString().split('T')[0]
      });
    }

    return Response.json({
      success: true,
      message: `Updated ${results.length} products with dates between Oct-Dec 2025`,
      results: results.slice(0, 10) // Show first 10 only
    }, { status: 200, headers });

  } catch (error) {
    console.error("Fix dates error:", error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500, headers });
  }
}
