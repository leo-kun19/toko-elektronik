import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fix missing suppliers in database
export async function GET(request) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    // Supplier lengkap sesuai dengan yang dibutuhkan produk
    const suppliersToAdd = [
      { suplier_id: 1, nama: "PT Sumber Elektronik Jaya", contact: "081234567890" },
      { suplier_id: 2, nama: "CV Makmur Abadi", contact: "082233445566" },
      { suplier_id: 3, nama: "PT Digital Niaga Indonesia", contact: "081998877665" },
      { suplier_id: 4, nama: "PT Panasonic Gobel Indonesia", contact: "081234567894" },
      { suplier_id: 5, nama: "CV Mitra Elektronik Sejahtera", contact: "081234567895" },
      { suplier_id: 6, nama: "PT Broco Electrical Indonesia", contact: "081234567896" },
      { suplier_id: 7, nama: "PT Schneider Electric Indonesia", contact: "081234567897" },
      { suplier_id: 8, nama: "PT Philips Indonesia", contact: "081234567898" },
      { suplier_id: 9, nama: "CV Uticon Elektrik", contact: "081234567899" },
      { suplier_id: 10, nama: "PT Krisbow Indonesia", contact: "081234567900" },
    ];

    const results = [];

    for (const supplier of suppliersToAdd) {
      // Check if supplier exists
      const existing = await prisma.suplier.findUnique({
        where: { suplier_id: supplier.suplier_id }
      });

      if (!existing) {
        // Create supplier with specific ID using raw query
        await prisma.$executeRaw`
          INSERT INTO suplier (suplier_id, nama, contact) 
          VALUES (${supplier.suplier_id}, ${supplier.nama}, ${supplier.contact})
          ON CONFLICT (suplier_id) DO NOTHING
        `;
        results.push({ ...supplier, status: "created" });
      } else {
        results.push({ ...supplier, status: "exists", current: existing });
      }
    }

    // Get all suppliers after fix
    const allSuppliers = await prisma.suplier.findMany({
      orderBy: { suplier_id: "asc" }
    });

    return Response.json({
      success: true,
      message: "Suppliers fixed successfully",
      results: results,
      allSuppliers: allSuppliers
    }, { status: 200, headers });

  } catch (error) {
    console.error("Fix suppliers error:", error);
    return Response.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500, headers });
  }
}
