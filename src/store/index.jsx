import React, { createContext, useContext, useState, useMemo } from "react";
import { countLowStockItems } from "../utils/stok";

// --- DATA AWAL (sesuai StokPage.jsx) ---
const initialStokBarang = [
  { id: 1, brand: "Samsung", nama: "Refrigerator FS1 A97", kategori: "Elektronik", supplier: "PT Jaya Kaya", deskripsi: "Kulkas 2 pintu, kapasitas 500L, hemat energi", harga: 9700000, stok: 4, tanggal: "2025-10-01", gambar: "/src/assets/produk.jpg" },
  { id: 2, brand: "Samsung", nama: "Refrigerator 681L", kategori: "Elektronik", supplier: "PT Makmur Korea", deskripsi: "Kulkas side-by-side premium, fitur ice maker", harga: 12500000, stok: 7, tanggal: "2025-10-02", gambar: "/src/assets/produk.jpg" },
  { id: 3, brand: "HP", nama: "Kipas Angin Mini", kategori: "Peralatan Rumah", supplier: "PT Jay Aul", deskripsi: "Kipas portabel USB, 3 kecepatan", harga: 350000, stok: 35, tanggal: "2025-10-03", gambar: "/src/assets/produk.jpg" },
  { id: 4, brand: "Phillips", nama: "Lampu LED", kategori: "Pencahayaan", supplier: "PT MPTI", deskripsi: "Lampu LED 18W, hangat, tahan 25.000 jam", harga: 150000, stok: 150, tanggal: "2025-10-04", gambar: "/src/assets/produk.jpg" },
  { id: 5, brand: "LG", nama: "TV OLED 55 Inch", kategori: "Elektronik", supplier: "PT Elektronik Baru", deskripsi: "TV OLED 4K HDR, AI ThinQ", harga: 30000000, stok: 42, tanggal: "2025-10-05", gambar: "/src/assets/produk.jpg" },
  { id: 6, brand: "Sony", nama: "Speaker XB100", kategori: "Audio", supplier: "PT Jaya Sound", deskripsi: "Speaker bluetooth waterproof, bass ekstra", harga: 600000, stok: 80, tanggal: "2025-10-06", gambar: "/src/assets/produk.jpg" },
  { id: 7, brand: "Panasonic", nama: "Microwave NN101", kategori: "Dapur", supplier: "PT Rumah Listrik", deskripsi: "Microwave 20L, grill & defrost", harga: 1200000, stok: 15, tanggal: "2025-10-07", gambar: "/src/assets/produk.jpg" },
];

const initialBarangMasuk = [
  { id: 1, brand: "Samsung", nama: "Kipas Angin FS1 A97", kategori: "Elektronik", supplier: "PT Jaya Kaya", deskripsi: "Kipas angin berdiri, remote control", qty: 40, harga: 200000, total: 8000000, tanggal: "2025-10-01", gambar: "/src/assets/produk.jpg" },
  { id: 2, brand: "Samsung", nama: "Refrigerator 681L SBS", kategori: "Elektronik", supplier: "PT SDFGHJKL", deskripsi: "Kulkas side-by-side warna hitam", qty: 10, harga: 9700000, total: 97000000, tanggal: "2025-10-02", gambar: "/src/assets/produk.jpg" },
  { id: 3, brand: "Sony", nama: "Speaker XB100", kategori: "Audio", supplier: "PT Jaya Sound", deskripsi: "Speaker portabel warna biru", qty: 25, harga: 360000, total: 9000000, tanggal: "2025-10-03", gambar: "/src/assets/produk.jpg" },
  { id: 4, brand: "Phillips", nama: "Lampu LED 160W", kategori: "Pencahayaan", supplier: "PT MPTI", deskripsi: "Lampu LED high-power untuk gudang", qty: 50, harga: 300000, total: 15000000, tanggal: "2025-10-04", gambar: "/src/assets/produk.jpg" },
];

const initialBarangKeluar = [
  { id: 1, brand: "Samsung", nama: "Refrigerator 681L SBS 2 Pintu", kategori: "Elektronik", supplier: "PT Jaya Kaya", deskripsi: "Kulkas premium dikirim ke pelanggan", qty: 2, harga: 6050000, total: 12100000, tanggal: "2025-10-10", gambar: "/src/assets/produk.jpg" },
  { id: 2, brand: "Samsung", nama: "Kipas Angin FS1 A97", kategori: "Elektronik", supplier: "PT MPTI", deskripsi: "Dijual ke toko retail cabang utama", qty: 35, harga: 168600, total: 5901000, tanggal: "2025-10-11", gambar: "/src/assets/produk.jpg" },
  { id: 3, brand: "Phillips", nama: "Lampu 160W A80", kategori: "Pencahayaan", supplier: "PT Madam Ribet", deskripsi: "Proyek penerangan jalan", qty: 150, harga: 4047, total: 607050, tanggal: "2025-10-12", gambar: "/src/assets/produk.jpg" },
  { id: 4, brand: "LG", nama: "TV OLED 55 Inch", kategori: "Elektronik", supplier: "PT Elektronik Baru", deskripsi: "Dijual ke customer premium", qty: 10, harga: 1200000, total: 12000000, tanggal: "2025-10-13", gambar: "/src/assets/produk.jpg" },
  { id: 5, brand: "Panasonic", nama: "Microwave NN101", kategori: "Dapur", supplier: "PT Rumah Listrik", deskripsi: "Bonus pembelian paket dapur", qty: 5, harga: 1200000, total: 6000000, tanggal: "2025-10-14", gambar: "/src/assets/produk.jpg" },
];

// --- CONTEXT ---
const AppContext = createContext(null);

// --- PROVIDER ---
export function AppProvider({ children }) {
  const [stokBarang, setStokBarang] = useState(initialStokBarang);
  const [barangMasuk, setBarangMasuk] = useState(initialBarangMasuk);
  const [barangKeluar, setBarangKeluar] = useState(initialBarangKeluar);

  // 🔹 Hitung jumlah stok rendah
  const lowStockCount = useMemo(() => countLowStockItems(stokBarang), [stokBarang]);

  // 🔹 Dapatkan daftar item stok rendah
  const lowStockItems = useMemo(() => {
    return stokBarang.filter(item => (item.stok || 0) < 5);
  }, [stokBarang]);

  // --- UTILITY: cari index stok berdasarkan nama (case-insensitive) ---
  const findStokIndexByName = (nama) => {
    return stokBarang.findIndex((item) =>
      item.nama.toLowerCase() === nama.toLowerCase()
    );
  };

  // --- TAMBAH STOK BARU ---
  const addStokBarang = (newItem) => {
    const newId = Date.now();
    setStokBarang((prev) => [{ ...newItem, id: newId }, ...prev]);
  };

  // --- TAMBAH BARANG MASUK ---
  const addBarangMasuk = (newItem) => {
    const newId = Date.now();
    const newItemWithId = { ...newItem, id: newId };
    setBarangMasuk((prev) => [newItemWithId, ...prev]);

    setStokBarang((prev) => {
      const idx = findStokIndexByName(newItem.nama);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          stok: updated[idx].stok + newItem.qty,
          tanggal: newItem.tanggal || new Date().toISOString().split("T")[0],
          gambar: newItem.gambar,
        };
        return updated;
      } else {
        return [
          {
            id: newId + 1,
            brand: "",
            nama: newItem.nama,
            kategori: newItem.kategori,
            supplier: newItem.supplier,
            deskripsi: newItem.deskripsi,
            harga: newItem.harga,
            stok: newItem.qty,
            tanggal: newItem.tanggal || new Date().toISOString().split("T")[0],
            gambar: newItem.gambar,
          },
          ...prev,
        ];
      }
    });
  };

  // --- TAMBAH BARANG KELUAR ---
  const addBarangKeluar = (newItem) => {
    const newId = Date.now();
    const newItemWithId = { ...newItem, id: newId };
    setBarangKeluar((prev) => [newItemWithId, ...prev]);

    setStokBarang((prev) => {
      const idx = findStokIndexByName(newItem.nama);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          stok: Math.max(0, updated[idx].stok - newItem.qty),
          tanggal: newItem.tanggal || new Date().toISOString().split("T")[0],
          gambar: newItem.gambar,
        };
        return updated;
      }
      return prev;
    });
  };

  // --- EDIT BARANG MASUK ---
  const editBarangMasuk = (itemId, updatedItem) => {
    const oldItem = barangMasuk.find((item) => item.id === itemId);
    if (!oldItem) return;

    const diffQty = updatedItem.qty - oldItem.qty;

    setBarangMasuk((prev) =>
      prev.map((item) => (item.id === itemId ? { ...updatedItem, id: itemId } : item))
    );

    setStokBarang((prev) => {
      const idx = findStokIndexByName(updatedItem.nama);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          stok: Math.max(0, updated[idx].stok + diffQty),
          tanggal: updatedItem.tanggal,
          gambar: updatedItem.gambar,
        };
        return updated;
      } else if (diffQty > 0) {
        return [
          {
            id: Date.now(),
            brand: "",
            nama: updatedItem.nama,
            kategori: updatedItem.kategori,
            supplier: updatedItem.supplier,
            deskripsi: updatedItem.deskripsi,
            harga: updatedItem.harga,
            stok: diffQty,
            tanggal: updatedItem.tanggal,
            gambar: updatedItem.gambar,
          },
          ...prev,
        ];
      }
      return prev;
    });
  };

  // --- EDIT BARANG KELUAR ---
  const editBarangKeluar = (itemId, updatedItem) => {
    const oldItem = barangKeluar.find((item) => item.id === itemId);
    if (!oldItem) return;

    const diffQty = oldItem.qty - updatedItem.qty;

    setBarangKeluar((prev) =>
      prev.map((item) => (item.id === itemId ? { ...updatedItem, id: itemId } : item))
    );

    setStokBarang((prev) => {
      const idx = findStokIndexByName(updatedItem.nama);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          stok: Math.max(0, updated[idx].stok + diffQty),
          tanggal: updatedItem.tanggal,
          gambar: updatedItem.gambar,
        };
        return updated;
      }
      return prev;
    });
  };

  // --- HAPUS BARANG MASUK ---
  const deleteBarangMasuk = (itemId) => {
    const item = barangMasuk.find((i) => i.id === itemId);
    if (!item) return;

    setBarangMasuk((prev) => prev.filter((i) => i.id !== itemId));
    setStokBarang((prev) => {
      const idx = findStokIndexByName(item.nama);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          stok: Math.max(0, updated[idx].stok - item.qty),
          tanggal: new Date().toISOString().split("T")[0],
        };
        return updated;
      }
      return prev;
    });
  };

  // --- HAPUS BARANG KELUAR ---
  const deleteBarangKeluar = (itemId) => {
    const item = barangKeluar.find((i) => i.id === itemId);
    if (!item) return;

    setBarangKeluar((prev) => prev.filter((i) => i.id !== itemId));
    setStokBarang((prev) => {
      const idx = findStokIndexByName(item.nama);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          stok: updated[idx].stok + item.qty,
          tanggal: new Date().toISOString().split("T")[0],
        };
        return updated;
      } else {
        return [
          {
            id: Date.now(),
            brand: "",
            nama: item.nama,
            kategori: item.kategori,
            supplier: item.supplier,
            deskripsi: item.deskripsi,
            harga: item.harga,
            stok: item.qty,
            tanggal: new Date().toISOString().split("T")[0],
            gambar: item.gambar,
          },
          ...prev,
        ];
      }
    });
  };

  // --- HAPUS STOK LANGSUNG ---
  const deleteStokBarang = (itemId) => {
    setStokBarang((prev) => prev.filter((item) => item.id !== itemId));
  };

  return (
    <AppContext.Provider
      value={{
        // State
        stokBarang,
        barangMasuk,
        barangKeluar,
        lowStockCount,
        lowStockItems,

        // Actions
        addStokBarang,
        addBarangMasuk,
        addBarangKeluar,
        editBarangMasuk,
        editBarangKeluar,
        deleteBarangMasuk,
        deleteBarangKeluar,
        deleteStokBarang,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// --- CUSTOM HOOK ---
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};