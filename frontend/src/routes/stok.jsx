// src/pages/StokPage.jsx
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import Button from "../components/ui/button";
import { useAppContext } from "../store";
import TambahBarangModal from "../components/modals/TambahBarangModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
import {
  Search,
  Edit2,
  Trash2,
  Plus,
  Calendar,
  Filter,
  Eye,
  Package,
  X,
} from "lucide-react";

export default function StokPage() {
  const {
    stokBarang,
    barangMasuk,
    barangKeluar,
    addStokBarang,
    addBarangMasuk,
    addBarangKeluar,
    editBarangMasuk,
    editBarangKeluar,
    deleteBarangMasuk,
    deleteBarangKeluar,
    deleteStokBarang,
    editStokBarang,
    refreshData,
    loading,
    error,
  } = useAppContext();

  // ======= UI State (filter, modal, pagination) tetap lokal =======
  const itemsPerPage = 5;
  const [search, setSearch] = useState("");
  const [pageStok, setPageStok] = useState(1);
  const [pageKeluar, setPageKeluar] = useState(1);
  const [pageMasuk, setPageMasuk] = useState(1);

  const [filterDate, setFilterDate] = useState("");
  const [filterDateMasuk, setFilterDateMasuk] = useState("");
  const [filterDateKeluar, setFilterDateKeluar] = useState("");
  const [filterKategori, setFilterKategori] = useState(new Set());
  const [filterSupplier, setFilterSupplier] = useState(new Set());

  const [modalType, setModalType] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [showTambahModal, setShowTambahModal] = useState(false);

  const [showGlobalDateDropdown, setShowGlobalDateDropdown] = useState(false);
  const [showMasukDateDropdown, setShowMasukDateDropdown] = useState(false);
  const [showKeluarDateDropdown, setShowKeluarDateDropdown] = useState(false);
  const [showGlobalFilterDropdown, setShowGlobalFilterDropdown] =
    useState(false);
  const [showMasukFilterDropdown, setShowMasukFilterDropdown] = useState(false);
  const [showKeluarFilterDropdown, setShowKeluarFilterDropdown] =
    useState(false);

  const emptyStokForm = {
    brand: "",
    kategori: "",
    supplier: "",
    nama: "",
    deskripsi: "",
    harga: "",
    stok: 1,
    tanggal: "",
    gambar: "/src/assets/produk.jpg",
  };
  const [stokForm, setStokForm] = useState(emptyStokForm);
  const [selectedFile, setSelectedFile] = useState(null);

  const emptyMasukForm = {
    nama: "",
    kategori: "",
    supplier: "",
    deskripsi: "",
    harga: "",
    qty: 1,
    total: "",
    tanggal: "",
    gambar: "/src/assets/produk.jpg",
  };
  const [masukForm, setMasukForm] = useState(emptyMasukForm);
  const emptyKeluarForm = {
    nama: "",
    kategori: "",
    supplier: "",
    deskripsi: "",
    harga: "",
    qty: 1,
    total: "",
    tanggal: "",
    gambar: "/src/assets/produk.jpg",
  };
  const [keluarForm, setKeluarForm] = useState(emptyKeluarForm);

  // ======= Helpers =======
  const paginate = (data, page) => {
    const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
    const startIndex = (page - 1) * itemsPerPage;
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);
    return { totalPages, startIndex, currentData };
  };

  const filteredStok = stokBarang.filter(
    (s) =>
      s.nama.toLowerCase().includes(search.toLowerCase()) &&
      (!filterDate || s.tanggal === filterDate) &&
      (!filterKategori.size || filterKategori.has(s.kategori)) &&
      (!filterSupplier.size || filterSupplier.has(s.supplier))
  );
  const filteredMasuk = barangMasuk.filter(
    (m) =>
      m.nama.toLowerCase().includes(search.toLowerCase()) &&
      (!filterDateMasuk || m.tanggal === filterDateMasuk) &&
      (!filterKategori.size || filterKategori.has(m.kategori)) &&
      (!filterSupplier.size || filterSupplier.has(m.supplier))
  );
  const filteredKeluar = barangKeluar.filter(
    (k) =>
      k.nama.toLowerCase().includes(search.toLowerCase()) &&
      (!filterDateKeluar || k.tanggal === filterDateKeluar) &&
      (!filterKategori.size || filterKategori.has(k.kategori)) &&
      (!filterSupplier.size || filterSupplier.has(k.supplier))
  );

  const {
    totalPages: totalStok,
    startIndex: startStok,
    currentData: currentStok,
  } = paginate(filteredStok, pageStok);
  const {
    totalPages: totalKeluar,
    startIndex: startKeluar,
    currentData: currentKeluar,
  } = paginate(filteredKeluar, pageKeluar);
  const {
    totalPages: totalMasuk,
    startIndex: startMasuk,
    currentData: currentMasuk,
  } = paginate(filteredMasuk, pageMasuk);

  // ======= Modal =======
  const openModal = (type, item = null) => {
    setModalType(type);
    setActiveItem(item);
    if (type === "addStok") {
      setStokForm(emptyStokForm);
      setSelectedFile(null);
    } else if (type === "editStok" && item) {
      setStokForm({
        brand: item.brand || "",
        kategori: item.kategori,
        supplier: item.supplier,
        nama: item.nama,
        deskripsi: item.deskripsi,
        harga: item.harga,
        stok: item.stok,
        tanggal: item.tanggal || "",
        gambar: item.gambar || "/src/assets/produk.jpg",
      });
      setSelectedFile(null);
    } else if (type === "addMasuk") {
      setMasukForm(emptyMasukForm);
    } else if (type === "addKeluar") {
      setKeluarForm(emptyKeluarForm);
    } else if (type === "editMasuk" && item) {
      setMasukForm({
        nama: item.nama,
        kategori: item.kategori,
        supplier: item.supplier,
        deskripsi: item.deskripsi,
        harga: item.harga,
        qty: item.qty,
        total: item.total,
        tanggal: item.tanggal || "",
        gambar: item.gambar || "/src/assets/produk.jpg",
      });
      setSelectedFile(null);
    } else if (type === "editKeluar" && item) {
      setKeluarForm({
        nama: item.nama,
        kategori: item.kategori,
        supplier: item.supplier,
        deskripsi: item.deskripsi,
        harga: item.harga,
        qty: item.qty,
        total: item.total,
        tanggal: item.tanggal || "",
        gambar: item.gambar || "/src/assets/produk.jpg",
      });
      setSelectedFile(null);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setActiveItem(null);
  };

  // ======= Handler untuk Modal Baru =======
  const handleTambahBarangSubmit = async (data) => {
    try {
      let gambarPath = data.gambar;
      
      // Upload file jika ada
      if (data.file) {
        const formData = new FormData();
        formData.append("file", data.file);
        
        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          gambarPath = uploadData.data.fileUrl;
        }
      }
      
      if (data.type === "baru") {
        // Tambah barang baru
        await addStokBarang({
          brand: data.brand,
          nama: data.nama,
          kategori: data.kategori,
          supplier: data.supplier,
          deskripsi: data.deskripsi,
          harga: data.harga,
          stok: data.stok,
          tanggal: data.tanggal,
          gambar: gambarPath,
        });
        
        // Juga catat sebagai barang masuk
        await addBarangMasuk({
          nama: data.nama,
          kategori: data.kategori,
          supplier: data.supplier,
          deskripsi: `Stok awal: ${data.deskripsi}`,
          harga: data.harga,
          qty: data.stok,
          tanggal: data.tanggal,
          gambar: gambarPath,
        });
        
        alert("Barang baru berhasil ditambahkan!");
      } else if (data.type === "masuk") {
        // Barang masuk (tambah stok)
        await addBarangMasuk({
          nama: data.nama,
          kategori: data.kategori,
          supplier: data.supplier,
          deskripsi: data.deskripsi,
          harga: data.harga,
          qty: data.qty,
          tanggal: data.tanggal,
          gambar: data.gambar,
        });
        
        alert("Barang masuk berhasil dicatat!");
      } else if (data.type === "keluar") {
        // Barang keluar (kurangi stok)
        await addBarangKeluar({
          nama: data.nama,
          kategori: data.kategori,
          supplier: data.supplier,
          deskripsi: data.deskripsi,
          harga: data.harga,
          qty: data.qty,
          tanggal: data.tanggal,
          gambar: data.gambar,
        });
        
        alert("Barang keluar berhasil dicatat!");
      }
      
      setShowTambahModal(false);
      refreshData();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // ======= CRUD Handlers lama (untuk edit/delete) =======
  const handleAddStok = async (e) => {
    e.preventDefault();
    try {
      const qty = Number(stokForm.stok) || 0;
      const harga = Number(stokForm.harga) || 0;
      let gambarPath = stokForm.gambar;
      if (selectedFile) {
        gambarPath = `/src/assets/uploads/${selectedFile.name}`;
      }

      await addStokBarang({
        ...stokForm,
        stok: qty,
        harga,
        tanggal: stokForm.tanggal || new Date().toISOString().split("T")[0],
        gambar: gambarPath,
      });

      await addBarangMasuk({
        nama: stokForm.nama,
        kategori: stokForm.kategori,
        supplier: stokForm.supplier,
        deskripsi: stokForm.deskripsi,
        qty,
        harga,
        total: qty * harga,
        tanggal: stokForm.tanggal || new Date().toISOString().split("T")[0],
        gambar: gambarPath,
      });

      closeModal();
    } catch (error) {
      alert("Gagal menambah stok: " + error.message);
    }
  };

  const handleAddMasuk = async (e) => {
    e.preventDefault();
    try {
      const qty = Number(masukForm.qty) || 0;
      const harga = Number(masukForm.harga) || 0;
      const total = qty * harga;
      await addBarangMasuk({
        ...masukForm,
        qty,
        harga,
        total,
        tanggal: masukForm.tanggal || new Date().toISOString().split("T")[0],
      });
      closeModal();
    } catch (error) {
      alert("Gagal menambah barang masuk: " + error.message);
    }
  };

  const handleAddKeluar = async (e) => {
    e.preventDefault();
    try {
      const qty = Number(keluarForm.qty) || 0;
      const harga = Number(keluarForm.harga) || 0;
      const total = qty * harga;
      await addBarangKeluar({
        ...keluarForm,
        qty,
        harga,
        total,
        tanggal: keluarForm.tanggal || new Date().toISOString().split("T")[0],
      });
      closeModal();
    } catch (error) {
      alert("Gagal menambah barang keluar: " + error.message);
    }
  };

  const handleSaveEditMasuk = async (e) => {
    e.preventDefault();
    if (!activeItem) return;
    try {
      const qty = Number(masukForm.qty) || 0;
      const harga = Number(masukForm.harga) || 0;
      const total = qty * harga;
      await editBarangMasuk(activeItem.id, {
        ...masukForm,
        qty,
        harga,
        total,
        tanggal: masukForm.tanggal || new Date().toISOString().split("T")[0],
      });
      closeModal();
    } catch (error) {
      alert("Gagal update barang masuk: " + error.message);
    }
  };

  const handleSaveEditKeluar = async (e) => {
    e.preventDefault();
    if (!activeItem) return;
    try {
      const qty = Number(keluarForm.qty) || 0;
      const harga = Number(keluarForm.harga) || 0;
      const total = qty * harga;
      await editBarangKeluar(activeItem.id, {
        ...keluarForm,
        qty,
        harga,
        total,
        tanggal: keluarForm.tanggal || new Date().toISOString().split("T")[0],
      });
      closeModal();
    } catch (error) {
      alert("Gagal update barang keluar: " + error.message);
    }
  };

  const handleDeleteMasuk = async (itemId) => {
    try {
      await deleteBarangMasuk(itemId);
      closeModal();
    } catch (error) {
      alert("Gagal hapus barang masuk: " + error.message);
    }
  };

  const handleDeleteKeluar = async (itemId) => {
    try {
      await deleteBarangKeluar(itemId);
      closeModal();
    } catch (error) {
      alert("Gagal hapus barang keluar: " + error.message);
    }
  };

  const handleEditStok = async (e) => {
    e.preventDefault();
    if (!activeItem) return;
    
    try {
      let gambarPath = stokForm.gambar;
      
      // Upload file baru jika ada
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        
        const uploadRes = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          gambarPath = uploadData.data.fileUrl;
        }
      }
      
      await editStokBarang(activeItem.id, {
        nama: stokForm.nama,
        kategori: stokForm.kategori,
        supplier: stokForm.supplier,
        deskripsi: stokForm.deskripsi,
        harga: parseFloat(stokForm.harga),
        stok: parseInt(stokForm.stok),
        gambar: gambarPath,
      });
      
      closeModal();
      alert("Stok berhasil diupdate!");
    } catch (error) {
      alert("Gagal update stok: " + error.message);
    }
  };

  const handleDeleteStok = async (itemId) => {
    try {
      await deleteStokBarang(itemId);
      closeModal();
    } catch (error) {
      alert("Gagal hapus stok: " + error.message);
    }
  };

  // ======= UI Components (sama seperti sebelumnya) =======
  const ModalWrapper = ({ children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={closeModal}
      />
      <div className="relative z-10 w-full max-w-lg mx-auto">{children}</div>
    </div>
  );

  const RenderPagination = ({
    page,
    setPage,
    totalPages,
    totalData,
    startIndex,
  }) => (
    <div className="flex justify-between items-center mt-4 text-gray-600 text-sm">
      <span>
        Showing {startIndex + 1}–
        {Math.min(startIndex + itemsPerPage, totalData)} of {totalData}
      </span>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          ‹
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <Button
            key={num}
            size="sm"
            variant={num === page ? "default" : "outline"}
            onClick={() => setPage(num)}
          >
            {num}
          </Button>
        ))}
        <Button
          size="icon"
          variant="outline"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          ›
        </Button>
      </div>
    </div>
  );

  const FilterDropdown = ({ onApply, onClose, type }) => {
    const [tempKategori, setTempKategori] = useState(new Set(filterKategori));
    const [tempSupplier, setTempSupplier] = useState(new Set(filterSupplier));
    const categories = [
      ...new Set(
        [...stokBarang, ...barangMasuk, ...barangKeluar].map(
          (item) => item.kategori
        )
      ),
    ];
    const suppliers = [
      ...new Set(
        [...stokBarang, ...barangMasuk, ...barangKeluar].map(
          (item) => item.supplier
        )
      ),
    ];

    const handleCategoryChange = (category) => {
      setTempKategori((prev) => {
        const next = new Set(prev);
        next.has(category) ? next.delete(category) : next.add(category);
        return next;
      });
    };
    const handleSupplierChange = (supplier) => {
      setTempSupplier((prev) => {
        const next = new Set(prev);
        next.has(supplier) ? next.delete(supplier) : next.add(supplier);
        return next;
      });
    };

    const applyFilters = () => {
      setFilterKategori(tempKategori);
      setFilterSupplier(tempSupplier);
      onApply();
      onClose();
    };
    const clearFilters = () => {
      setTempKategori(new Set());
      setTempSupplier(new Set());
      setFilterKategori(new Set());
      setFilterSupplier(new Set());
      onApply();
      onClose();
    };

    return (
      <div className="bg-white rounded-lg shadow-xl p-4 w-80">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-semibold">Filters</h4>
          <button onClick={onClose} className="text-gray-500">
            <X size={16} />
          </button>
        </div>
        <div className="mb-4">
          <h5 className="font-medium mb-2">Kategori</h5>
          {categories.map((cat) => (
            <div key={cat} className="flex items-center mb-1">
              <input
                type="checkbox"
                id={`cat-${cat}`}
                checked={tempKategori.has(cat)}
                onChange={() => handleCategoryChange(cat)}
                className="mr-2"
              />
              <label htmlFor={`cat-${cat}`} className="text-sm">
                {cat}
              </label>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <h5 className="font-medium mb-2">Supplier</h5>
          {suppliers.map((sup) => (
            <div key={sup} className="flex items-center mb-1">
              <input
                type="checkbox"
                id={`sup-${sup}`}
                checked={tempSupplier.has(sup)}
                onChange={() => handleSupplierChange(sup)}
                className="mr-2"
              />
              <label htmlFor={`sup-${sup}`} className="text-sm">
                {sup}
              </label>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={clearFilters}>
            Clear
          </Button>
          <Button
            size="sm"
            className="bg-[#1C45EF] text-white"
            onClick={applyFilters}
          >
            Apply
          </Button>
        </div>
      </div>
    );
  };

  const showAllData = (type) => {
    if (type === "stok") setPageStok(1);
    else if (type === "masuk") setPageMasuk(1);
    else if (type === "keluar") setPageKeluar(1);
  };

  // ======= JSX Render =======
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mt-10">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Stok Barang</h1>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="bg-[#1C45EF] flex gap-2 items-center text-white"
            onClick={() => setShowTambahModal(true)}
          >
            <Plus size={16} /> Tambah Stok Barang
          </Button>
          <div className="relative">
            <Button
              variant="outline"
              className="flex gap-2 items-center"
              onClick={() => setShowGlobalDateDropdown(!showGlobalDateDropdown)}
            >
              <Calendar size={16} /> Select Dates
            </Button>
            {showGlobalDateDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-4 min-w-max z-10">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full border rounded px-3 py-2 mb-2"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setFilterDate("")}
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#1C45EF] text-white"
                    onClick={() => setShowGlobalDateDropdown(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 gap-6 mb-5">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-300 text-white rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Barang Keluar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {barangKeluar.reduce((a, b) => a + (b.qty || 0), 0)}
            </p>
            <p className="text-sm opacity-80">Total keluar</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-600 to-yellow-400 text-white rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Barang Masuk</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {barangMasuk.reduce((a, b) => a + (b.qty || 0), 0)}
            </p>
            <p className="text-sm opacity-80">Total masuk</p>
          </CardContent>
        </Card>
      </div>

      {/* TABEL STOK BARANG */}
      <Card className="border-none shadow-md rounded-2xl mb-6">
        <CardHeader className="flex items-center justify-between bg-[#E5EDFF] rounded-t-2xl px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="bg-[#1C45EF] p-2 rounded-lg text-white">
              <Package size={18} />
            </div>
            <CardTitle className="text-base font-semibold text-[#1C2451]">
              Stok Barang
            </CardTitle>
          </div>
          <div className="relative w-80">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPageStok(1);
              }}
              className="w-full border border-[#BFD0FF] rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8D6FF]"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="py-3 px-4 text-left">Nama Produk</th>
                  <th className="py-3 px-4 text-left">Kategori</th>
                  <th className="py-3 px-4 text-left">Supplier</th>
                  <th className="py-3 px-4 text-left">Deskripsi</th>
                  <th className="py-3 px-4 text-right">Harga</th>
                  <th className="py-3 px-4 text-center">Stok</th>
                  <th className="py-3 px-4 text-center">Tanggal Update</th>
                  <th className="py-3 px-4 text-center">Action</th>
                  <th className="py-3 px-4 text-center">Detail</th>
                </tr>
              </thead>
              <tbody>
                {currentStok.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">{item.nama}</td>
                    <td className="py-3 px-4">{item.kategori}</td>
                    <td className="py-3 px-4">{item.supplier}</td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      {item.deskripsi}
                    </td>
                    <td className="py-3 px-4 text-right">
                      Rp. {item.harga.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">{item.stok}</td>
                    <td className="py-3 px-4 text-center">{item.tanggal}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => openModal("editStok", item)}>
                          <Edit2
                            className="text-blue-500 cursor-pointer"
                            size={16}
                          />
                        </button>
                        <button onClick={() => openModal("deleteStok", item)}>
                          <Trash2
                            className="text-red-500 cursor-pointer"
                            size={16}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => openModal("viewStok", item)}>
                        <Eye
                          className="text-yellow-500 cursor-pointer mx-auto"
                          size={18}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <RenderPagination
            page={pageStok}
            setPage={setPageStok}
            totalPages={totalStok}
            totalData={filteredStok.length}
            startIndex={startStok}
          />
        </CardContent>
      </Card>

      {/* TABEL BARANG KELUAR */}
      <Card className="border-none shadow-md rounded-2xl mb-6">
        <CardHeader className="flex justify-between items-center px-6 py-4 bg-[#E5EDFF] rounded-t-2xl">
          <CardTitle className="text-lg text-gray-800">Barang Keluar</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="flex gap-1 items-center"
                onClick={() =>
                  setShowKeluarDateDropdown(!showKeluarDateDropdown)
                }
              >
                <Calendar size={16} /> Select Date
              </Button>
              {showKeluarDateDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-4 min-w-max z-10">
                  <input
                    type="date"
                    value={filterDateKeluar}
                    onChange={(e) => setFilterDateKeluar(e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-2"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setFilterDateKeluar("")}
                    >
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#1C45EF] text-white"
                      onClick={() => setShowKeluarDateDropdown(false)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="flex gap-1 items-center"
                onClick={() =>
                  setShowKeluarFilterDropdown(!showKeluarFilterDropdown)
                }
              >
                <Filter size={16} /> Filters
              </Button>
              {showKeluarFilterDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-4 min-w-max z-10">
                  <FilterDropdown
                    onApply={() => {}}
                    onClose={() => setShowKeluarFilterDropdown(false)}
                    type="keluar"
                  />
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-indigo-500 text-white hover:bg-indigo-600 flex gap-1 items-center"
              onClick={() => showAllData("keluar")}
            >
              <Eye size={16} /> See All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="py-3 px-4 text-left">Nama Produk</th>
                  <th className="py-3 px-4 text-left">Kategori</th>
                  <th className="py-3 px-4 text-left">Supplier</th>
                  <th className="py-3 px-4 text-left">Deskripsi</th>
                  <th className="py-3 px-4 text-right">Harga</th>
                  <th className="py-3 px-4 text-center">Kuantitas</th>
                  <th className="py-3 px-4 text-center">Tanggal Update</th>
                  <th className="py-3 px-4 text-center">Action</th>
                  <th className="py-3 px-4 text-center">Detail</th>
                </tr>
              </thead>
              <tbody>
                {currentKeluar.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">{item.nama}</td>
                    <td className="py-3 px-4">{item.kategori}</td>
                    <td className="py-3 px-4">{item.supplier}</td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      {item.deskripsi}
                    </td>
                    <td className="py-3 px-4 text-right">
                      Rp. {item.harga.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">{item.qty}</td>
                    <td className="py-3 px-4 text-center">{item.tanggal}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => openModal("editKeluar", item)}>
                          <Edit2
                            className="text-blue-500 cursor-pointer"
                            size={16}
                          />
                        </button>
                        <button onClick={() => openModal("deleteKeluar", item)}>
                          <Trash2
                            className="text-red-500 cursor-pointer"
                            size={16}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => openModal("viewKeluar", item)}>
                        <Eye
                          className="text-yellow-500 cursor-pointer"
                          size={18}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <RenderPagination
            page={pageKeluar}
            setPage={setPageKeluar}
            totalPages={totalKeluar}
            totalData={filteredKeluar.length}
            startIndex={startKeluar}
          />
        </CardContent>
      </Card>

      {/* TABEL BARANG MASUK */}
      <Card className="border-none shadow-md rounded-2xl">
        <CardHeader className="flex justify-between items-center px-6 py-4 bg-[#E5EDFF] rounded-t-2xl">
          <CardTitle className="text-lg text-gray-800">Barang Masuk</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="flex gap-1 items-center"
                onClick={() => setShowMasukDateDropdown(!showMasukDateDropdown)}
              >
                <Calendar size={16} /> Select Date
              </Button>
              {showMasukDateDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-4 min-w-max z-10">
                  <input
                    type="date"
                    value={filterDateMasuk}
                    onChange={(e) => setFilterDateMasuk(e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-2"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setFilterDateMasuk("")}
                    >
                      Clear
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#1C45EF] text-white"
                      onClick={() => setShowMasukDateDropdown(false)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="flex gap-1 items-center"
                onClick={() =>
                  setShowMasukFilterDropdown(!showMasukFilterDropdown)
                }
              >
                <Filter size={16} /> Filters
              </Button>
              {showMasukFilterDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-4 min-w-max z-10">
                  <FilterDropdown
                    onApply={() => {}}
                    onClose={() => setShowMasukFilterDropdown(false)}
                    type="masuk"
                  />
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-indigo-500 text-white hover:bg-indigo-600 flex gap-1 items-center"
              onClick={() => showAllData("masuk")}
            >
              <Eye size={16} /> See All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="py-3 px-4 text-left">Nama Produk</th>
                  <th className="py-3 px-4 text-left">Kategori</th>
                  <th className="py-3 px-4 text-left">Supplier</th>
                  <th className="py-3 px-4 text-left">Deskripsi</th>
                  <th className="py-3 px-4 text-right">Harga</th>
                  <th className="py-3 px-4 text-center">Kuantitas</th>
                  <th className="py-3 px-4 text-center">Tanggal Update</th>
                  <th className="py-3 px-4 text-center">Action</th>
                  <th className="py-3 px-4 text-center">Detail</th>
                </tr>
              </thead>
              <tbody>
                {currentMasuk.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">{item.nama}</td>
                    <td className="py-3 px-4">{item.kategori}</td>
                    <td className="py-3 px-4">{item.supplier}</td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      {item.deskripsi}
                    </td>
                    <td className="py-3 px-4 text-right">
                      Rp. {item.harga.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">{item.qty}</td>
                    <td className="py-3 px-4 text-center">{item.tanggal}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => openModal("editMasuk", item)}>
                          <Edit2
                            className="text-blue-500 cursor-pointer"
                            size={16}
                          />
                        </button>
                        <button onClick={() => openModal("deleteMasuk", item)}>
                          <Trash2
                            className="text-red-500 cursor-pointer"
                            size={16}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => openModal("viewMasuk", item)}>
                        <Eye
                          className="text-yellow-500 cursor-pointer"
                          size={18}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <RenderPagination
            page={pageMasuk}
            setPage={setPageMasuk}
            totalPages={totalMasuk}
            totalData={filteredMasuk.length}
            startIndex={startMasuk}
          />
        </CardContent>
      </Card>

      {/* ========================= MODALS ========================= */}
      {/* Add Stok Modal */}
      {modalType === "addStok" && (
        <ModalWrapper>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Tambah Stok Barang</h3>
              <button onClick={closeModal} className="text-gray-500">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddStok} className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">File Upload</label>
                <div className="flex items-center border rounded px-3 py-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                    id="upload-file-stok"
                  />
                  <label
                    htmlFor="upload-file-stok"
                    className="bg-gray-100 px-3 py-1 rounded cursor-pointer text-sm"
                  >
                    Choose File
                  </label>
                  <span className="ml-2 text-sm text-gray-500">
                    {selectedFile ? selectedFile.name : "No file chosen"}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Nama Produk</label>
                <input
                  required
                  value={stokForm.nama}
                  onChange={(e) =>
                    setStokForm((s) => ({ ...s, nama: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Brand</label>
                  <input
                    value={stokForm.brand}
                    onChange={(e) =>
                      setStokForm((s) => ({ ...s, brand: e.target.value }))
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Kategori</label>
                  <input
                    required
                    value={stokForm.kategori}
                    onChange={(e) =>
                      setStokForm((s) => ({ ...s, kategori: e.target.value }))
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Supplier</label>
                <input
                  required
                  value={stokForm.supplier}
                  onChange={(e) =>
                    setStokForm((s) => ({ ...s, supplier: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Deskripsi</label>
                <textarea
                  value={stokForm.deskripsi}
                  onChange={(e) =>
                    setStokForm((s) => ({ ...s, deskripsi: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                  rows="2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">
                    Harga (per unit)
                  </label>
                  <input
                    type="number"
                    value={stokForm.harga}
                    onChange={(e) =>
                      setStokForm((s) => ({ ...s, harga: e.target.value }))
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Stok Awal</label>
                  <input
                    type="number"
                    min={1}
                    value={stokForm.stok}
                    onChange={(e) =>
                      setStokForm((s) => ({ ...s, stok: e.target.value }))
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Tanggal Update</label>
                <input
                  type="date"
                  value={stokForm.tanggal || ""}
                  onChange={(e) =>
                    setStokForm((s) => ({ ...s, tanggal: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-[#1C45EF] text-white">
                  Tambah & Simpan
                </Button>
                <Button variant="outline" onClick={closeModal}>
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </ModalWrapper>
      )}

      {/* Edit Stok Modal */}
      {modalType === "editStok" && activeItem && (
        <ModalWrapper>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Stok Barang</h3>
              <button onClick={closeModal} className="text-gray-500">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditStok} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama Produk</label>
                <input
                  type="text"
                  value={stokForm.nama}
                  onChange={(e) => setStokForm({ ...stokForm, nama: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kategori</label>
                  <input
                    type="text"
                    value={stokForm.kategori}
                    onChange={(e) => setStokForm({ ...stokForm, kategori: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Supplier</label>
                  <input
                    type="text"
                    value={stokForm.supplier}
                    onChange={(e) => setStokForm({ ...stokForm, supplier: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                  value={stokForm.deskripsi}
                  onChange={(e) => setStokForm({ ...stokForm, deskripsi: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows="2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Harga (per unit)</label>
                  <input
                    type="number"
                    min="0"
                    value={stokForm.harga}
                    onChange={(e) => setStokForm({ ...stokForm, harga: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stok</label>
                  <input
                    type="number"
                    min="0"
                    value={stokForm.stok}
                    onChange={(e) => setStokForm({ ...stokForm, stok: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Upload Gambar Baru (Opsional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full border rounded-lg px-3 py-2"
                />
                {activeItem.gambar && (
                  <img src={activeItem.gambar} alt="Current" className="mt-2 w-32 h-32 object-cover rounded" />
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                  Batal
                </Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        </ModalWrapper>
      )}

      {/* View Modals */}
      {modalType === "viewStok" && activeItem && (
        <ModalWrapper>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Detail Stok</h3>
              <button onClick={closeModal} className="text-gray-500">
                <X size={18} />
              </button>
            </div>
            <img
              src={activeItem.gambar}
              alt="Produk"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <div className="space-y-2 text-sm">
              <div>
                <strong>Nama Produk:</strong> {activeItem.nama}
              </div>
              <div>
                <strong>Brand:</strong> {activeItem.brand}
              </div>
              <div>
                <strong>Kategori:</strong> {activeItem.kategori}
              </div>
              <div>
                <strong>Supplier:</strong> {activeItem.supplier}
              </div>
              <div>
                <strong>Deskripsi:</strong> {activeItem.deskripsi}
              </div>
              <div>
                <strong>Harga:</strong> Rp. {activeItem.harga.toLocaleString()}
              </div>
              <div>
                <strong>Stok:</strong> {activeItem.stok}
              </div>
              <div>
                <strong>Tanggal Update:</strong> {activeItem.tanggal}
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}

      {modalType === "viewMasuk" && activeItem && (
        <ModalWrapper>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Detail Barang Masuk</h3>
              <button onClick={closeModal} className="text-gray-500">
                <X size={18} />
              </button>
            </div>
            <img
              src={activeItem.gambar}
              alt="Produk"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <div className="space-y-2 text-sm">
              <div>
                <strong>Nama Produk:</strong> {activeItem.nama}
              </div>
              <div>
                <strong>Kategori:</strong> {activeItem.kategori}
              </div>
              <div>
                <strong>Supplier:</strong> {activeItem.supplier}
              </div>
              <div>
                <strong>Deskripsi:</strong> {activeItem.deskripsi}
              </div>
              <div>
                <strong>Qty:</strong> {activeItem.qty}
              </div>
              <div>
                <strong>Harga/unit:</strong> Rp.{" "}
                {activeItem.harga.toLocaleString()}
              </div>
              <div>
                <strong>Total:</strong> Rp. {activeItem.total.toLocaleString()}
              </div>
              <div>
                <strong>Tanggal Update:</strong> {activeItem.tanggal}
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}

      {modalType === "viewKeluar" && activeItem && (
        <ModalWrapper>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Detail Barang Keluar</h3>
              <button onClick={closeModal} className="text-gray-500">
                <X size={18} />
              </button>
            </div>
            <img
              src={activeItem.gambar}
              alt="Produk"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <div className="space-y-2 text-sm">
              <div>
                <strong>Nama Produk:</strong> {activeItem.nama}
              </div>
              <div>
                <strong>Kategori:</strong> {activeItem.kategori}
              </div>
              <div>
                <strong>Supplier:</strong> {activeItem.supplier}
              </div>
              <div>
                <strong>Deskripsi:</strong> {activeItem.deskripsi}
              </div>
              <div>
                <strong>Qty:</strong> {activeItem.qty}
              </div>
              <div>
                <strong>Harga/unit:</strong> Rp.{" "}
                {activeItem.harga.toLocaleString()}
              </div>
              <div>
                <strong>Total:</strong> Rp. {activeItem.total.toLocaleString()}
              </div>
              <div>
                <strong>Tanggal Update:</strong> {activeItem.tanggal}
              </div>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* Edit Modals */}
      {modalType === "editMasuk" && activeItem && (
        <ModalWrapper>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Barang Masuk</h3>
              <button onClick={closeModal} className="text-gray-500">
                <X size={18} />
              </button>
            </div>
            <img
              src={activeItem.gambar}
              alt="Produk"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <form onSubmit={handleSaveEditMasuk} className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Nama Produk</label>
                <input
                  required
                  value={masukForm.nama}
                  onChange={(e) =>
                    setMasukForm((f) => ({ ...f, nama: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Kategori</label>
                <input
                  required
                  value={masukForm.kategori}
                  onChange={(e) =>
                    setMasukForm((f) => ({ ...f, kategori: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Supplier</label>
                <input
                  required
                  value={masukForm.supplier}
                  onChange={(e) =>
                    setMasukForm((f) => ({ ...f, supplier: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Deskripsi</label>
                <textarea
                  value={masukForm.deskripsi}
                  onChange={(e) =>
                    setMasukForm((f) => ({ ...f, deskripsi: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                  rows="2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Harga</label>
                  <input
                    type="number"
                    value={masukForm.harga}
                    onChange={(e) =>
                      setMasukForm((f) => ({ ...f, harga: e.target.value }))
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Qty</label>
                  <input
                    type="number"
                    min={0}
                    value={masukForm.qty}
                    onChange={(e) =>
                      setMasukForm((f) => ({ ...f, qty: e.target.value }))
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Tanggal Update</label>
                <input
                  type="date"
                  value={masukForm.tanggal || ""}
                  onChange={(e) =>
                    setMasukForm((f) => ({ ...f, tanggal: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Ganti Gambar Produk (Opsional)
                </label>
                <div className="flex items-center border rounded px-3 py-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                    id="upload-file-masuk"
                  />
                  <label
                    htmlFor="upload-file-masuk"
                    className="bg-gray-100 px-3 py-1 rounded cursor-pointer text-sm"
                  >
                    Choose File
                  </label>
                  <span className="ml-2 text-sm text-gray-500">
                    {selectedFile ? selectedFile.name : "No file chosen"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-[#1C45EF] text-white">
                  Simpan Perubahan
                </Button>
                <Button variant="outline" onClick={closeModal}>
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </ModalWrapper>
      )}

      {modalType === "editKeluar" && activeItem && (
        <ModalWrapper>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Barang Keluar</h3>
              <button onClick={closeModal} className="text-gray-500">
                <X size={18} />
              </button>
            </div>
            <img
              src={activeItem.gambar}
              alt="Produk"
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <form onSubmit={handleSaveEditKeluar} className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Nama Produk</label>
                <input
                  required
                  value={keluarForm.nama}
                  onChange={(e) =>
                    setKeluarForm((f) => ({ ...f, nama: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Kategori</label>
                <input
                  required
                  value={keluarForm.kategori}
                  onChange={(e) =>
                    setKeluarForm((f) => ({ ...f, kategori: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Supplier</label>
                <input
                  required
                  value={keluarForm.supplier}
                  onChange={(e) =>
                    setKeluarForm((f) => ({ ...f, supplier: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Deskripsi</label>
                <textarea
                  value={keluarForm.deskripsi}
                  onChange={(e) =>
                    setKeluarForm((f) => ({ ...f, deskripsi: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                  rows="2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Harga</label>
                  <input
                    type="number"
                    value={keluarForm.harga}
                    onChange={(e) =>
                      setKeluarForm((f) => ({ ...f, harga: e.target.value }))
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Qty</label>
                  <input
                    type="number"
                    min={0}
                    value={keluarForm.qty}
                    onChange={(e) =>
                      setKeluarForm((f) => ({ ...f, qty: e.target.value }))
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Tanggal Update</label>
                <input
                  type="date"
                  value={keluarForm.tanggal || ""}
                  onChange={(e) =>
                    setKeluarForm((f) => ({ ...f, tanggal: e.target.value }))
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Ganti Gambar Produk (Opsional)
                </label>
                <div className="flex items-center border rounded px-3 py-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                    id="upload-file-keluar"
                  />
                  <label
                    htmlFor="upload-file-keluar"
                    className="bg-gray-100 px-3 py-1 rounded cursor-pointer text-sm"
                  >
                    Choose File
                  </label>
                  <span className="ml-2 text-sm text-gray-500">
                    {selectedFile ? selectedFile.name : "No file chosen"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-[#1C45EF] text-white">
                  Simpan Perubahan
                </Button>
                <Button variant="outline" onClick={closeModal}>
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </ModalWrapper>
      )}

      {/* Delete Confirmations */}
      {modalType === "deleteMasuk" && activeItem && (
        <ModalWrapper>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Hapus Barang Masuk?</h3>
              <button onClick={closeModal} className="text-gray-500">
                <X size={18} />
              </button>
            </div>
            <img
              src={activeItem.gambar}
              alt="Produk"
              className="w-full h-32 object-cover rounded-md mb-4"
            />
            <p>
              Yakin ingin menghapus data <strong>{activeItem.nama}</strong>?
              (Qty: {activeItem.qty})
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                className="bg-red-500 text-white"
                onClick={() => handleDeleteMasuk(activeItem.id)}
              >
                Ya, Hapus
              </Button>
              <Button variant="outline" onClick={closeModal}>
                Batal
              </Button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {modalType === "deleteKeluar" && activeItem && (
        <ModalWrapper>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Hapus Barang Keluar?</h3>
              <button onClick={closeModal} className="text-gray-500">
                <X size={18} />
              </button>
            </div>
            <img
              src={activeItem.gambar}
              alt="Produk"
              className="w-full h-32 object-cover rounded-md mb-4"
            />
            <p>
              Yakin ingin menghapus data <strong>{activeItem.nama}</strong>?
              (Qty: {activeItem.qty})
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                className="bg-red-500 text-white"
                onClick={() => handleDeleteKeluar(activeItem.id)}
              >
                Ya, Hapus
              </Button>
              <Button variant="outline" onClick={closeModal}>
                Batal
              </Button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {modalType === "deleteStok" && activeItem && (
        <ModalWrapper>
          <div className="bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Hapus Stok?</h3>
              <button onClick={closeModal} className="text-gray-500">
                <X size={18} />
              </button>
            </div>
            <img
              src={activeItem.gambar}
              alt="Produk"
              className="w-full h-32 object-cover rounded-md mb-4"
            />
            <p>
              Hapus entry stok <strong>{activeItem.nama}</strong>? (menghapus
              entry stok tidak menghapus riwayat masuk/keluar)
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                className="bg-red-500 text-white"
                onClick={() => handleDeleteStok(activeItem.id)}
              >
                Ya, Hapus
              </Button>
              <Button variant="outline" onClick={closeModal}>
                Batal
              </Button>
            </div>
          </div>
        </ModalWrapper>
      )}

      {/* Modal Tambah Barang Baru */}
      {showTambahModal && (
        <TambahBarangModal
          onClose={() => setShowTambahModal(false)}
          onSubmit={handleTambahBarangSubmit}
          stokBarang={stokBarang}
        />
      )}
    </div>
  );
}
