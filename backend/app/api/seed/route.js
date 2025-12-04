import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // Security: Only allow with secret key
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    
    // Allow test123 for initial setup, or use SEED_SECRET if set
    const validSecret = process.env.SEED_SECRET || "test123";
    
    if (secret !== validSecret) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid secret" },
        { status: 401 }
      );
    }

    console.log("🌱 Starting database seed...");

    // Read seed data
    const seedDataPath = path.join(process.cwd(), "prisma", "FINAL_SEED.json");
    const seedData = JSON.parse(fs.readFileSync(seedDataPath, "utf-8"));

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await prisma.barang_keluar.deleteMany();
    await prisma.barang_masuk.deleteMany();
    await prisma.produk.deleteMany();
    await prisma.categori.deleteMany();
    await prisma.suplier.deleteMany();
    await prisma.admin.deleteMany();
    console.log("✅ Existing data cleared");

    // Seed Admin
    console.log("👤 Seeding admin...");
    const admin = await prisma.admin.create({
      data: seedData.admin[0],
    });
    console.log(`✅ Admin created: ${admin.username}`);

    // Seed Categories
    console.log("📁 Seeding categories...");
    for (const cat of seedData.categories) {
      await prisma.categori.create({
        data: {
          ...cat,
          admin_id: admin.admin_id,
        },
      });
    }
    console.log(`✅ ${seedData.categories.length} categories created`);

    // Seed Suppliers
    console.log("🏢 Seeding suppliers...");
    const supplierMap = new Map();
    for (const sup of seedData.suppliers) {
      const supplier = await prisma.suplier.create({
        data: sup,
      });
      supplierMap.set(sup.nama, supplier.suplier_id);
    }
    console.log(`✅ ${seedData.suppliers.length} suppliers created`);

    // Seed Products
    console.log("📦 Seeding products...");
    let productCount = 0;
    const errors = [];

    for (const prod of seedData.products) {
      try {
        const category = await prisma.categori.findFirst({
          where: { name: prod.categori },
        });

        if (!category) {
          errors.push(`Category not found for product: ${prod.name}`);
          continue;
        }

        const supplierId = supplierMap.get(prod.suplier);
        if (!supplierId) {
          errors.push(`Supplier not found for product: ${prod.name}`);
          continue;
        }

        await prisma.produk.create({
          data: {
            name: prod.name,
            description: prod.description,
            image: prod.image,
            price: prod.price,
            stock: prod.stock,
            categori_id: category.categori_id,
            suplier_id: supplierId,
          },
        });
        productCount++;
      } catch (error) {
        errors.push(`Error creating product ${prod.name}: ${error.message}`);
      }
    }
    console.log(`✅ ${productCount} products created`);

    const summary = {
      success: true,
      message: "Database seeded successfully!",
      summary: {
        admin: 1,
        categories: seedData.categories.length,
        suppliers: seedData.suppliers.length,
        products: productCount,
      },
      errors: errors.length > 0 ? errors : undefined,
    };

    console.log("🎉 Database seeded successfully!");
    console.log(JSON.stringify(summary, null, 2));

    return NextResponse.json(summary);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET endpoint to check if seed is needed
export async function GET(request) {
  try {
    const adminCount = await prisma.admin.count();
    const productCount = await prisma.produk.count();
    const categoryCount = await prisma.categori.count();
    const supplierCount = await prisma.suplier.count();

    return NextResponse.json({
      database: "connected",
      counts: {
        admin: adminCount,
        products: productCount,
        categories: categoryCount,
        suppliers: supplierCount,
      },
      needsSeed: adminCount === 0 || productCount === 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        database: "error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
