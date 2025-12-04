// Temporary script to seed Railway database
// Run this with: node seed-railway.js

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Read seed data
    const seedDataPath = path.join(__dirname, 'prisma', 'FINAL_SEED.json');
    const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.barang_keluar.deleteMany();
    await prisma.barang_masuk.deleteMany();
    await prisma.produk.deleteMany();
    await prisma.categori.deleteMany();
    await prisma.suplier.deleteMany();
    await prisma.admin.deleteMany();
    console.log('✅ Existing data cleared\n');

    // Seed Admin
    console.log('👤 Seeding admin...');
    const admin = await prisma.admin.create({
      data: seedData.admin[0]
    });
    console.log(`✅ Admin created: ${admin.username}\n`);

    // Seed Categories
    console.log('📁 Seeding categories...');
    for (const cat of seedData.categories) {
      await prisma.categori.create({
        data: {
          ...cat,
          admin_id: admin.admin_id
        }
      });
    }
    console.log(`✅ ${seedData.categories.length} categories created\n`);

    // Seed Suppliers
    console.log('🏢 Seeding suppliers...');
    const supplierMap = new Map();
    for (const sup of seedData.suppliers) {
      const supplier = await prisma.suplier.create({
        data: sup
      });
      supplierMap.set(sup.nama, supplier.suplier_id);
    }
    console.log(`✅ ${seedData.suppliers.length} suppliers created\n`);

    // Seed Products
    console.log('📦 Seeding products...');
    let productCount = 0;
    for (const prod of seedData.products) {
      const category = await prisma.categori.findFirst({
        where: { name: prod.categori }
      });

      if (!category) {
        console.log(`⚠️  Category not found for product: ${prod.name}`);
        continue;
      }

      const supplierId = supplierMap.get(prod.suplier);
      if (!supplierId) {
        console.log(`⚠️  Supplier not found for product: ${prod.name}`);
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
          suplier_id: supplierId
        }
      });
      productCount++;
    }
    console.log(`✅ ${productCount} products created\n`);

    console.log('🎉 Database seeded successfully!\n');
    console.log('Summary:');
    console.log(`- Admin: 1`);
    console.log(`- Categories: ${seedData.categories.length}`);
    console.log(`- Suppliers: ${seedData.suppliers.length}`);
    console.log(`- Products: ${productCount}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
