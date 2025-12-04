import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fix/Update suppliers in database
export async function GET(request) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    // Supplier lengkap sesuai dengan yang dibutuhkan produk
    const suppliersData = [
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

    for (const supplier of suppliersData) {
      // Update or create supplier (upsert)
      const updated = await prisma.suplier.upsert({
        where: { suplier_id: supplier.suplier_id },
        update: {
          nama: supplier.nama,
          contact: supplier.contact
        },
        create: {
          suplier_id: supplier.suplier_id,
          nama: supplier.nama,
          contact: supplier.contact
        }
      });
      results.push({ ...supplier, status: "updated", result: updated });
    }

    // Get all suppliers after fix
    const allSuppliers = await prisma.suplier.findMany({
      orderBy: { suplier_id: "asc" }
    });

    return Response.json({
      success: true,
      message: "Suppliers updated successfully",
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
