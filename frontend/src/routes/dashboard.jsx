// src/pages/Dashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter,
  MoreVertical,
  Eye,
  Trash2,
  X,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import Button from "../components/ui/button";
import { useAppContext } from "../store";
import { barangMasukAPI, authAPI } from "../services/api";

export default function Dashboard() {
  // ===== STATE dari Context (data real dari API) =====
  const { barangMasuk, barangKeluar, loading, error, deleteBarangMasuk } = useAppContext();
  
  // State untuk user profile
  const [userProfile, setUserProfile] = useState(null);

  // State untuk 3 barang masuk terbaru (fetch terpisah)
  const [latestBarangMasuk, setLatestBarangMasuk] = useState([]);
  const [loadingLatest, setLoadingLatest] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showGlobalDate, setShowGlobalDate] = useState(false);
  const [showTableDate, setShowTableDate] = useState(false);
  const [showTableFilter, setShowTableFilter] = useState(false);
  const [filterKategori, setFilterKategori] = useState(new Set());
  const [filterSupplier, setFilterSupplier] = useState(new Set());
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [modalType, setModalType] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  // Fetch 3 barang masuk terbaru dan profile
  useEffect(() => {
    fetchLatestBarangMasuk();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.success) {
        setUserProfile(response.data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchLatestBarangMasuk = async () => {
    try {
      setLoadingLatest(true);
      const response = await barangMasukAPI.getLatest();
      if (response.success) {
        setLatestBarangMasuk(response.data);
      }
    } catch (err) {
      console.error("Error fetching latest barang masuk:", err);
    } finally {
      setLoadingLatest(false);
    }
  };

  // ===== DERIVED DATA =====
  const filteredBarangMasuk = useMemo(() => {
    return latestBarangMasuk.filter(item => {
      const itemDate = new Date(item.tanggal);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && itemDate < start) return false;
      if (end && itemDate > end) return false;
      if (filterKategori.size && !filterKategori.has(item.kategori)) return false;
      if (filterSupplier.size && !filterSupplier.has(item.supplier)) return false;
      return true;
    });
  }, [latestBarangMasuk, startDate, endDate, filterKategori, filterSupplier]);

  // Top Product (by qty keluar)
  const topProductsData = useMemo(() => {
    const map = {};
    barangKeluar.forEach(i => {
      map[i.nama] = (map[i.nama] || 0) + i.qty;
    });
    return Object.entries(map)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 7)
      .map(item => {
        const prod = barangKeluar.find(p => p.nama === item.name);
        return {
          name: item.name,
          category: prod?.kategori || "-",
          price: `Rp. ${prod?.harga?.toLocaleString() || "0"}`
        };
      });
  }, [barangKeluar]);

  // Top Category (by qty keluar)
  const topCategoriesData = useMemo(() => {
    const map = {};
    barangKeluar.forEach(i => {
      map[i.kategori] = (map[i.kategori] || 0) + i.qty;
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [barangKeluar]);

  // Monthly Sales (dari data barang keluar real)
  const monthlySales = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const now = new Date();
    const currentYear = now.getFullYear();
    
    return months.map((month, i) => {
      // Hitung total qty barang keluar per bulan
      const monthSales = barangKeluar.filter(item => {
        const itemDate = new Date(item.tanggal);
        return itemDate.getMonth() === i && itemDate.getFullYear() === currentYear;
      }).reduce((sum, item) => sum + (item.qty || 0), 0);
      
      return {
        month,
        sales: monthSales
      };
    });
  }, [barangKeluar]);

  // Pagination
  const totalPages = Math.ceil(filteredBarangMasuk.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentData = filteredBarangMasuk.slice(startIndex, startIndex + itemsPerPage);

  // ===== MODAL HANDLERS =====
  const openModal = (type, item) => {
    setModalType(type);
    setActiveItem(item);
  };
  const closeModal = () => {
    setModalType(null);
    setActiveItem(null);
  };

  // ===== FILTER DROPDOWN =====
  const FilterDropdown = () => {
    const allKategori = [...new Set(latestBarangMasuk.map(i => i.kategori))];
    const allSupplier = [...new Set(latestBarangMasuk.map(i => i.supplier))];

    const toggleKategori = (cat) => {
      setFilterKategori(prev => {
        const next = new Set(prev);
        next.has(cat) ? next.delete(cat) : next.add(cat);
        return next;
      });
    };
    const toggleSupplier = (sup) => {
      setFilterSupplier(prev => {
        const next = new Set(prev);
        next.has(sup) ? next.delete(sup) : next.add(sup);
        return next;
      });
    };

    return (
      <div className="absolute top-full mt-2 right-0 bg-white border rounded-lg shadow-lg p-4 z-10 w-60">
        <h4 className="font-medium mb-2">Filter by:</h4>
        <div className="space-y-2 text-sm">
          <div><strong>Kategori</strong></div>
          {allKategori.map(cat => (
            <div key={cat} className="flex items-center">
              <input
                type="checkbox"
                id={`cat-${cat}`}
                checked={filterKategori.has(cat)}
                onChange={() => toggleKategori(cat)}
                className="mr-2"
              />
              <label htmlFor={`cat-${cat}`}>{cat}</label>
            </div>
          ))}
          <div><strong>Supplier</strong></div>
          {allSupplier.map(sup => (
            <div key={sup} className="flex items-center">
              <input
                type="checkbox"
                id={`sup-${sup}`}
                checked={filterSupplier.has(sup)}
                onChange={() => toggleSupplier(sup)}
                className="mr-2"
              />
              <label htmlFor={`sup-${sup}`}>{sup}</label>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" onClick={() => { setFilterKategori(new Set()); setFilterSupplier(new Set()); }}>Clear</Button>
          <Button size="sm" onClick={() => setShowTableFilter(false)}>Apply</Button>
        </div>
      </div>
    );
  };

  // ===== CUSTOM TOOLTIP BAR CHART =====
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">{payload[0].value} unit</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
    <div className="flex flex-col gap-5 mt-10">
      {/* === HEADER === */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Selamat Datang, {userProfile?.username || "Admin"}
        </h1>
        <div className="flex gap-2">
          <div className="relative">
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowGlobalDate(!showGlobalDate)}>
              <Calendar size={16} /> Select Dates
            </Button>
            {showGlobalDate && (
              <div className="absolute top-full mt-2 right-0 bg-white border rounded-lg shadow-lg p-4 z-10 w-80">
                <div className="space-y-3">
                  <div><label className="block text-sm text-gray-600 mb-1">Start Date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                  <div><label className="block text-sm text-gray-600 mb-1">End Date</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => { setStartDate(""); setEndDate(""); setShowGlobalDate(false); }}>Clear</Button>
                    <Button size="sm" onClick={() => setShowGlobalDate(false)}>Apply</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* === STAT CARDS === */}
      <div className="grid grid-cols-4 gap-6">
        {(() => {
          // Filter data berdasarkan tanggal jika ada
          const filterByDate = (items) => {
            if (!startDate && !endDate) return items;
            return items.filter(item => {
              const itemDate = new Date(item.tanggal);
              const start = startDate ? new Date(startDate) : null;
              const end = endDate ? new Date(endDate) : null;
              if (start && itemDate < start) return false;
              if (end && itemDate > end) return false;
              return true;
            });
          };
          
          const filteredMasuk = filterByDate(barangMasuk);
          const filteredKeluar = filterByDate(barangKeluar);
          
          return [
            { title: "Pengeluaran", value: `Rp ${filteredMasuk.reduce((a,b)=>a+(b.total||0),0).toLocaleString()}`, color: "bg-gradient-to-br from-blue-600 to-blue-400" },
            { title: "Pemasukan", value: `Rp ${filteredKeluar.reduce((a,b)=>a+(b.total||0),0).toLocaleString()}`, color: "bg-gradient-to-br from-blue-600 to-blue-400" },
            { title: "Barang Keluar", value: filteredKeluar.reduce((a,b)=>a+(b.qty||0),0), color: "bg-gradient-to-br from-blue-600 to-blue-400" },
            { title: "Barang Masuk", value: filteredMasuk.reduce((a,b)=>a+(b.qty||0),0), color: "bg-gradient-to-br from-blue-600 to-blue-400" },
          ].map((s,i)=>(
            <Card key={i} className={`rounded-2xl text-white shadow-lg bg-gradient-to-r ${s.color}`}>
              <CardContent className="p-6"><p className="text-sm opacity-90">{s.title}</p><p className="text-2xl font-bold mt-1">{s.value}</p></CardContent>
            </Card>
          ));
        })()}
      </div>

      {/* === CHARTS + TOP === */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow-md">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Barang Terjual / Bulan</CardTitle>
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlySales} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} width={40} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(106, 90, 224, 0.1)" }} />
                <Bar dataKey="sales" name="Jumlah Terjual" fill="#1C45EF" radius={[4, 4, 0, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader><CardTitle>Top Product</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              {topProductsData.map((p, i) => (
                <li key={i} className="flex justify-between border-b pb-2">
                  <div><p className="font-medium">{p.name}</p><p className="text-xs text-gray-400">{p.category}</p></div>
                  <span className="font-semibold">{p.price}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* ✅ TOP CATEGORY (muncul sekarang) */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader><CardTitle>Top Category</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              {topCategoriesData.map((c, i) => (
                <li key={i} className="flex justify-between border-b pb-1">
                  <span>{c.name}</span>
                  <span className="font-semibold">{c.count} unit</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* === TABEL BARANG MASUK (dengan filter kategori & supplier) === */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader className="flex items-center justify-between bg-[#E5EDFF] rounded-t-2xl px-5 py-3">
          <CardTitle>Barang Masuk</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setShowTableDate(!showTableDate)}>
                <Calendar size={14} /> Select Date
              </Button>
              {showTableDate && (
                <div className="absolute top-full mt-2 right-0 bg-white border rounded-lg shadow-lg p-4 z-10 w-80">
                  <div className="space-y-3">
                    <div><label className="block text-sm text-gray-600 mb-1">Start Date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                    <div><label className="block text-sm text-gray-600 mb-1">End Date</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border rounded px-3 py-2" /></div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => { setStartDate(""); setEndDate(""); setShowTableDate(false); }}>Clear</Button>
                      <Button size="sm" onClick={() => setShowTableDate(false)}>Apply</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setShowTableFilter(!showTableFilter)}>
                <Filter size={14} /> Filters
              </Button>
              {showTableFilter && <FilterDropdown />}
            </div>

            <Button variant="default" size="sm">See All</Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-t">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="py-3 px-4 text-left">Nama Produk</th>
                  <th className="py-3 px-4 text-left">Kategori</th>
                  <th className="py-3 px-4 text-left">Supplier</th>
                  <th className="py-3 px-4 text-left">Deskripsi</th>
                  <th className="py-3 px-4 text-right">Harga</th>
                  <th className="py-3 px-4 text-center">Kuantitas</th>
                  <th className="py-3 px-4 text-center">Tanggal Update</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, i) => {
                  const status = new Date(item.tanggal) >= new Date() ? "Processing" : "Arrived";
                  return (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{item.nama}</td>
                      <td className="py-3 px-4">{item.kategori}</td>
                      <td className="py-3 px-4">{item.supplier}</td>
                      <td className="py-3 px-4 max-w-xs truncate">{item.deskripsi}</td>
                      <td className="py-3 px-4 text-right">Rp {item.harga.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">{item.qty}</td>
                      <td className="py-3 px-4 text-center">{item.tanggal}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          status === "Processing" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => openModal("view", item)}><Eye className="text-blue-500" size={16} /></button>
                          <button onClick={() => openModal("delete", item)}><Trash2 className="text-red-500" size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
            <span>Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredBarangMasuk.length)} of {filteredBarangMasuk.length}</span>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={14} /></Button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = Math.max(1, page - 2) + i;
                if (pageNum > totalPages) return null;
                return <Button key={pageNum} size="sm" variant={pageNum === page ? "default" : "outline"} onClick={() => setPage(pageNum)}>{pageNum}</Button>;
              })}
              <Button size="icon" variant="outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><ChevronRight size={14} /></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== MODALS (with image) ===== */}
      {modalType === "view" && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Detail Barang Masuk</h3>
              <button onClick={closeModal} className="text-gray-500"><X size={18} /></button>
            </div>
            <img src="/src/assets/produk.jpg" alt="Produk" className="w-full h-48 object-cover rounded-md mb-4" />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><strong>Nama Produk:</strong></div><div>{activeItem.nama}</div>
              <div><strong>Kategori:</strong></div><div>{activeItem.kategori}</div>
              <div><strong>Supplier:</strong></div><div>{activeItem.supplier}</div>
              <div><strong>Deskripsi:</strong></div><div>{activeItem.deskripsi}</div>
              <div><strong>Harga/unit:</strong></div><div>Rp {activeItem.harga.toLocaleString()}</div>
              <div><strong>Kuantitas:</strong></div><div>{activeItem.qty}</div>
              <div><strong>Total:</strong></div><div>Rp {activeItem.total.toLocaleString()}</div>
              <div><strong>Tanggal Update:</strong></div><div>{activeItem.tanggal}</div>
              <div><strong>Status:</strong></div>
              <div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  new Date(activeItem.tanggal) >= new Date() ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"
                }`}>
                  {new Date(activeItem.tanggal) >= new Date() ? "Processing" : "Arrived"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalType === "delete" && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={closeModal} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Hapus Barang Masuk?</h3>
              <button onClick={closeModal} className="text-gray-500"><X size={18} /></button>
            </div>
            <img src="/src/assets/produk.jpg" alt="Produk" className="w-full h-32 object-cover rounded-md mb-4" />
            <p>Hapus <strong>{activeItem.nama}</strong>? (Qty: {activeItem.qty})</p>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={closeModal}>Batal</Button>
              <Button className="bg-red-500 text-white" onClick={async () => {
                try {
                  await deleteBarangMasuk(activeItem.id);
                  closeModal();
                } catch (err) {
                  alert("Gagal menghapus: " + err.message);
                }
              }}>Hapus</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}