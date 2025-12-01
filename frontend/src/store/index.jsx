import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { countLowStockItems } from "../utils/stok";
import { stokAPI, barangMasukAPI, barangKeluarAPI } from "../services/api";

// --- CONTEXT ---
const AppContext = createContext(null);

// --- PROVIDER ---
export function AppProvider({ children }) {
  const [stokBarang, setStokBarang] = useState([]);
  const [barangMasuk, setBarangMasuk] = useState([]);
  const [barangKeluar, setBarangKeluar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data dari API saat component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [stokRes, masukRes, keluarRes] = await Promise.all([
        stokAPI.getAll(),
        barangMasukAPI.getAll(),
        barangKeluarAPI.getAll(),
      ]);

      setStokBarang(stokRes.data || []);
      setBarangMasuk(masukRes.data || []);
      setBarangKeluar(keluarRes.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Hitung jumlah stok rendah
  const lowStockCount = useMemo(() => countLowStockItems(stokBarang), [stokBarang]);

  // 🔹 Dapatkan daftar item stok rendah
  const lowStockItems = useMemo(() => {
    return stokBarang.filter(item => (item.stok || 0) < 5);
  }, [stokBarang]);

  // Refresh data
  const refreshData = () => {
    fetchAllData();
  };

  // --- UTILITY: cari index stok berdasarkan nama (case-insensitive) ---
  const findStokIndexByName = (nama) => {
    return stokBarang.findIndex((item) =>
      item.nama.toLowerCase() === nama.toLowerCase()
    );
  };

  // --- TAMBAH STOK BARU ---
  const addStokBarang = async (newItem) => {
    try {
      const response = await stokAPI.create(newItem);
      if (response.success) {
        await fetchAllData(); // Refresh semua data
        return response.data;
      }
    } catch (err) {
      console.error("Error adding stok:", err);
      throw err;
    }
  };

  // --- TAMBAH BARANG MASUK ---
  const addBarangMasuk = async (newItem) => {
    try {
      const response = await barangMasukAPI.create(newItem);
      if (response.success) {
        await fetchAllData(); // Refresh semua data (stok otomatis update di backend)
        return response.data;
      }
    } catch (err) {
      console.error("Error adding barang masuk:", err);
      throw err;
    }
  };

  // --- TAMBAH BARANG KELUAR ---
  const addBarangKeluar = async (newItem) => {
    try {
      const response = await barangKeluarAPI.create(newItem);
      if (response.success) {
        await fetchAllData(); // Refresh semua data (stok otomatis update di backend)
        return response.data;
      }
    } catch (err) {
      console.error("Error adding barang keluar:", err);
      throw err;
    }
  };

  // --- EDIT BARANG MASUK ---
  const editBarangMasuk = async (itemId, updatedItem) => {
    try {
      const response = await barangMasukAPI.update(itemId, updatedItem);
      if (response.success) {
        await fetchAllData(); // Refresh semua data
        return response.data;
      }
    } catch (err) {
      console.error("Error editing barang masuk:", err);
      throw err;
    }
  };

  // --- EDIT BARANG KELUAR ---
  const editBarangKeluar = async (itemId, updatedItem) => {
    try {
      const response = await barangKeluarAPI.update(itemId, updatedItem);
      if (response.success) {
        await fetchAllData(); // Refresh semua data
        return response.data;
      }
    } catch (err) {
      console.error("Error editing barang keluar:", err);
      throw err;
    }
  };

  // --- HAPUS BARANG MASUK ---
  const deleteBarangMasuk = async (itemId) => {
    try {
      const response = await barangMasukAPI.delete(itemId);
      if (response.success) {
        await fetchAllData(); // Refresh semua data
        return response;
      }
    } catch (err) {
      console.error("Error deleting barang masuk:", err);
      throw err;
    }
  };

  // --- HAPUS BARANG KELUAR ---
  const deleteBarangKeluar = async (itemId) => {
    try {
      const response = await barangKeluarAPI.delete(itemId);
      if (response.success) {
        await fetchAllData(); // Refresh semua data
        return response;
      }
    } catch (err) {
      console.error("Error deleting barang keluar:", err);
      throw err;
    }
  };

  // --- EDIT STOK BARANG ---
  const editStokBarang = async (itemId, updatedItem) => {
    try {
      const response = await stokAPI.update(itemId, updatedItem);
      if (response.success) {
        await fetchAllData(); // Refresh semua data
        return response.data;
      }
    } catch (err) {
      console.error("Error editing stok:", err);
      throw err;
    }
  };

  // --- HAPUS STOK LANGSUNG ---
  const deleteStokBarang = async (itemId) => {
    try {
      const response = await stokAPI.delete(itemId);
      if (response.success) {
        await fetchAllData(); // Refresh semua data
        return response;
      }
    } catch (err) {
      console.error("Error deleting stok:", err);
      throw err;
    }
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
        loading,
        error,

        // Actions
        addStokBarang,
        addBarangMasuk,
        addBarangKeluar,
        editBarangMasuk,
        editBarangKeluar,
        deleteBarangMasuk,
        deleteBarangKeluar,
        editStokBarang,
        deleteStokBarang,
        refreshData,
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