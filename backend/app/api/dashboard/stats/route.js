import { PrismaClient } from "@prisma/client";

import { handleCorsOptions, getCorsHeaders } from "../../../lib/cors.js";

const prisma = new PrismaClient();

// GET - Ambil statistik dashboard

export async function OPTIONS() {
  return handleCorsOptions();
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const dateFilter = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    const whereDate = Object.keys(dateFilter).length > 0 ? { tanggal: dateFilter } : {};

    // Total barang masuk
    const barangMasukData = await prisma.barang_masuk.findMany({
      where: whereDate
    });
    const totalBarangMasuk = barangMasukData.reduce((sum, item) => sum + item.qty, 0);
    const totalPengeluaran = barangMasukData.reduce((sum, item) => sum + parseFloat(item.total), 0);

    // Total barang keluar
    const barangKeluarData = await prisma.barang_keluar.findMany({
      where: whereDate
    });
    const totalBarangKeluar = barangKeluarData.reduce((sum, item) => sum + item.qty, 0);
    const totalPemasukan = barangKeluarData.reduce((sum, item) => sum + parseFloat(item.total), 0);

    // Top products (by qty keluar)
    const topProductsMap = {};
    barangKeluarData.forEach(item => {
      if (!topProductsMap[item.nama]) {
        topProductsMap[item.nama] = {
          name: item.nama,
          category: item.kategori,
          price: parseFloat(item.harga),
          qty: 0
        };
      }
      topProductsMap[item.nama].qty += item.qty;
    });

    const topProducts = Object.values(topProductsMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 7);

    // Top categories (by qty keluar)
    const topCategoriesMap = {};
    barangKeluarData.forEach(item => {
      if (!topCategoriesMap[item.kategori]) {
        topCategoriesMap[item.kategori] = {
          name: item.kategori,
          count: 0
        };
      }
      topCategoriesMap[item.kategori].count += item.qty;
    });

    const topCategories = Object.values(topCategoriesMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);

    // Monthly sales (last 12 months)
    const monthlySales = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const sales = await prisma.barang_keluar.findMany({
        where: {
          tanggal: {
            gte: date,
            lt: nextDate
          }
        }
      });

      const totalSales = sales.reduce((sum, item) => sum + item.qty, 0);
      
      monthlySales.push({
        month: date.toLocaleString('id-ID', { month: 'short' }),
        sales: totalSales
      });
    }

    // Low stock items
    const lowStockItems = await prisma.produk.findMany({
      where: {
        stock: {
          lt: 5
        }
      },
      include: {
        categori: true,
        suplier: true
      }
    });

    return Response.json(
      {
        success: true,
        data: {
          totalBarangMasuk,
          totalBarangKeluar,
          totalPengeluaran,
          totalPemasukan,
          topProducts,
          topCategories,
          monthlySales,
          lowStockCount: lowStockItems.length,
          lowStockItems
        }
      }, { status: 200, headers: getCorsHeaders() });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return Response.json(
      { success: false, error: "Gagal mengambil statistik dashboard" }, { status: 500, headers: getCorsHeaders() });
  }
}
