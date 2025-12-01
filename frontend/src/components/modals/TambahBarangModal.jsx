import { useState, useEffect } from "react";
import { X, Plus, Minus } from "lucide-react";
import Button from "../ui/button";
import { kategoriAPI, supplierAPI } from "../../services/api";

export default function TambahBarangModal({ onClose, onSubmit, stokBarang }) {
  const [mode, setMode] = useState("pilih"); // "pilih" atau "baru"
  const [selectedBarang, setSelectedBarang] = useState("");
  const [transaksiType, setTransaksiType] = useState("masuk"); // "masuk" atau "keluar"
  
  // Form untuk barang existing
  const [qtyTransaksi, setQtyTransaksi] = useState(1);
  const [hargaTransaksi, setHargaTransaksi] = useState("");
  const [deskripsiTransaksi, setDeskripsiTransaksi] = useState("");
  const [tanggalTransaksi, setTanggalTransaksi] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Form untuk barang baru
  const [formBaru, setFormBaru] = useState({
    nama: "",
    kategori: "",
    supplier: "",
    deskripsi: "",
    harga: "",
    stok: 1,
    tanggal: new Date().toISOString().split("T")[0],
    gambar: "/src/assets/produk.jpg",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  
  // Data kategori dan supplier dari API
  const [kategoriList, setKategoriList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);

  // Fetch kategori dan supplier saat modal dibuka
  useEffect(() => {
    fetchKategoriSupplier();
  }, []);

  const fetchKategoriSupplier = async () => {
    try {
      const [kategoriRes, supplierRes] = await Promise.all([
        kategoriAPI.getAll(),
        supplierAPI.getAll()
      ]);
      
      if (kategoriRes.success) {
        setKategoriList(kategoriRes.data);
      }
      
      if (supplierRes.success) {
        setSupplierList(supplierRes.data);
      }
    } catch (error) {
      console.error("Error fetching kategori/supplier:", error);
    }
  };

  // Get selected barang details
  const barangDetail = stokBarang.find((b) => b.id === parseInt(selectedBarang));

  // Auto-set harga dari barang yang dipilih
  useEffect(() => {
    if (barangDetail) {
      setHargaTransaksi(barangDetail.harga);
    }
  }, [barangDetail]);

  const handleSubmitTransaksi = (e) => {
    e.preventDefault();
    
    if (!selectedBarang) {
      alert("Pilih barang terlebih dahulu");
      return;
    }

    const data = {
      type: transaksiType,
      barang_id: parseInt(selectedBarang),
      nama: barangDetail.nama,
      kategori: barangDetail.kategori,
      supplier: barangDetail.supplier,
      deskripsi: deskripsiTransaksi || `Transaksi ${transaksiType}`,
      harga: parseFloat(hargaTransaksi),
      qty: parseInt(qtyTransaksi),
      tanggal: tanggalTransaksi,
      gambar: barangDetail.gambar,
    };

    onSubmit(data);
  };

  const handleSubmitBarangBaru = (e) => {
    e.preventDefault();
    
    const data = {
      type: "baru",
      nama: formBaru.nama,
      brand: formBaru.nama.split(" ")[0] || "", // Auto-generate brand dari kata pertama
      kategori: formBaru.kategori,
      supplier: formBaru.supplier,
      deskripsi: formBaru.deskripsi,
      harga: parseFloat(formBaru.harga),
      stok: parseInt(formBaru.stok),
      tanggal: formBaru.tanggal,
      gambar: formBaru.gambar,
      file: selectedFile,
    };

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Tambah Stok Barang</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMode("pilih")}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
              mode === "pilih"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="font-semibold">Pilih Barang Existing</div>
            <div className="text-xs mt-1 opacity-75">Tambah/Kurangi stok barang yang sudah ada</div>
          </button>
          
          <button
            onClick={() => setMode("baru")}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
              mode === "baru"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="font-semibold">Tambah Barang Baru</div>
            <div className="text-xs mt-1 opacity-75">Input produk baru ke inventory</div>
          </button>
        </div>

        {/* Form Pilih Barang Existing */}
        {mode === "pilih" && (
          <form onSubmit={handleSubmitTransaksi} className="space-y-4">
            {/* Pilih Barang */}
            <div>
              <label className="block text-sm font-medium mb-1">Pilih Barang</label>
              <select
                value={selectedBarang}
                onChange={(e) => setSelectedBarang(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">-- Pilih Barang --</option>
                {stokBarang.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama} (Stok: {item.stok})
                  </option>
                ))}
              </select>
            </div>

            {/* Tipe Transaksi */}
            {selectedBarang && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Tipe Transaksi</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTransaksiType("masuk")}
                      className={`py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                        transaksiType === "masuk"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Plus size={18} />
                      <span className="font-medium">Barang Masuk</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setTransaksiType("keluar")}
                      className={`py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                        transaksiType === "keluar"
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Minus size={18} />
                      <span className="font-medium">Barang Keluar</span>
                    </button>
                  </div>
                </div>

                {/* Detail Barang */}
                {barangDetail && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm space-y-1">
                      <div><strong>Kategori:</strong> {barangDetail.kategori}</div>
                      <div><strong>Supplier:</strong> {barangDetail.supplier}</div>
                      <div><strong>Stok Saat Ini:</strong> {barangDetail.stok} unit</div>
                      <div><strong>Harga:</strong> Rp {barangDetail.harga.toLocaleString()}</div>
                    </div>
                  </div>
                )}

                {/* Qty & Harga */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Jumlah (Qty)</label>
                    <input
                      type="number"
                      min="1"
                      value={qtyTransaksi}
                      onChange={(e) => setQtyTransaksi(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Harga {transaksiType === "keluar" ? "Jual" : "Beli"} (per unit)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={hargaTransaksi}
                      onChange={(e) => setHargaTransaksi(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                </div>

                {/* Total */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total:</span>
                    <span className="text-lg font-bold text-blue-600">
                      Rp {(qtyTransaksi * hargaTransaksi).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-sm font-medium mb-1">Deskripsi (Opsional)</label>
                  <textarea
                    value={deskripsiTransaksi}
                    onChange={(e) => setDeskripsiTransaksi(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                    rows="2"
                    placeholder={`Catatan untuk transaksi ${transaksiType}...`}
                  />
                </div>

                {/* Tanggal */}
                <div>
                  <label className="block text-sm font-medium mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={tanggalTransaksi}
                    onChange={(e) => setTanggalTransaksi(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className={`flex-1 ${
                      transaksiType === "masuk"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    } text-white`}
                  >
                    Simpan {transaksiType === "masuk" ? "Barang Masuk" : "Barang Keluar"}
                  </Button>
                </div>
              </>
            )}
          </form>
        )}

        {/* Form Barang Baru */}
        {mode === "baru" && (
          <form onSubmit={handleSubmitBarangBaru} className="space-y-4">
            {/* Upload Gambar */}
            <div>
              <label className="block text-sm font-medium mb-1">Gambar Produk</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* Nama Produk */}
            <div>
              <label className="block text-sm font-medium mb-1">Nama Produk</label>
              <input
                type="text"
                value={formBaru.nama}
                onChange={(e) => setFormBaru({ ...formBaru, nama: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            {/* Kategori & Supplier */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <select
                  value={formBaru.kategori}
                  onChange={(e) => setFormBaru({ ...formBaru, kategori: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">-- Pilih Kategori --</option>
                  {kategoriList.map((kat) => (
                    <option key={kat.categori_id} value={kat.name}>
                      {kat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Supplier</label>
                <select
                  value={formBaru.supplier}
                  onChange={(e) => setFormBaru({ ...formBaru, supplier: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="">-- Pilih Supplier --</option>
                  {supplierList.map((sup) => (
                    <option key={sup.suplier_id} value={sup.nama}>
                      {sup.nama}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-medium mb-1">Deskripsi</label>
              <textarea
                value={formBaru.deskripsi}
                onChange={(e) => setFormBaru({ ...formBaru, deskripsi: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                rows="2"
              />
            </div>

            {/* Harga & Stok Awal */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Harga (per unit)</label>
                <input
                  type="number"
                  min="0"
                  value={formBaru.harga}
                  onChange={(e) => setFormBaru({ ...formBaru, harga: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Stok Awal</label>
                <input
                  type="number"
                  min="1"
                  value={formBaru.stok}
                  onChange={(e) => setFormBaru({ ...formBaru, stok: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
            </div>

            {/* Tanggal */}
            <div>
              <label className="block text-sm font-medium mb-1">Tanggal Update</label>
              <input
                type="date"
                value={formBaru.tanggal}
                onChange={(e) => setFormBaru({ ...formBaru, tanggal: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Batal
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                Tambah Barang Baru
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
