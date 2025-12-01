import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Eye,
  Trash2,
  Pen,
  Package,
  X,
  PlusCircle,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import Button from "../components/ui/button";
import { supplierAPI } from "../services/api";

export default function Supplier() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // === MODAL STATES ===
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // === SUPPLIER STATE ===
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [newSupplier, setNewSupplier] = useState({
    nama: "",
    contact: "",
  });

  const itemsPerPage = 5;

  // Fetch suppliers dari API
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await supplierAPI.getAll();
      if (response.success) {
        setSuppliers(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter((s) =>
    s.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // === HANDLERS ===
  const handleAddSupplier = async (e) => {
    e.preventDefault();
    try {
      const response = await supplierAPI.create(newSupplier);
      if (response.success) {
        await fetchSuppliers();
        setNewSupplier({ nama: "", contact: "" });
        setIsAddOpen(false);
      }
    } catch (err) {
      alert("Gagal menambah supplier: " + err.message);
    }
  };

  const handleEditSupplier = async (e) => {
    e.preventDefault();
    try {
      const response = await supplierAPI.update(selectedSupplier.suplier_id, {
        nama: selectedSupplier.nama,
        contact: selectedSupplier.contact,
      });
      if (response.success) {
        await fetchSuppliers();
        setIsEditOpen(false);
      }
    } catch (err) {
      alert("Gagal update supplier: " + err.message);
    }
  };

  const handleDeleteSupplier = async () => {
    try {
      const response = await supplierAPI.delete(selectedSupplier.suplier_id);
      if (response.success) {
        await fetchSuppliers();
        setIsDeleteOpen(false);
      }
    } catch (err) {
      alert("Gagal hapus supplier: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading suppliers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={fetchSuppliers}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 mt-10">
      {/* === HEADER + BUTTON === */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Supplier Barang
        </h1>
        <Button
          className="flex items-center gap-2 bg-[#1C45EF] hover:bg-[#0f2c99] text-white"
          onClick={() => setIsAddOpen(true)}
        >
        <Plus size={16} />  Tambah Supplier Barang 
        </Button>
      </div>

      {/* === CARD TABLE === */}
      <Card className="rounded-2xl shadow-md border border-gray-100">
        <CardHeader className="flex items-center justify-between bg-[#E5EDFF] rounded-t-2xl px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="bg-[#1C45EF] p-2 rounded-lg text-white">
              <Package size={18} />
            </div>
            <CardTitle className="text-base font-semibold text-[#1C2451]">
              Supplier
            </CardTitle>
          </div>

          <div className="relative w-80">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-[#BFD0FF] rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8D6FF]"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <table className="w-full text-sm border-t border-gray-100">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Nama Supplier</th>
                <th className="px-6 py-3 text-left font-medium">Kontak</th>
                <th className="px-6 py-3 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {currentSuppliers.map((supplier) => (
                <tr key={supplier.suplier_id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3">{supplier.nama}</td>
                  <td className="px-6 py-3">{supplier.contact || "-"}</td>
                  <td className="py-3 px-1 text-center flex gap-5">
                    <button
                      className="text-yellow-500 hover:text-[#1C45EF]"
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setIsViewOpen(true);
                      }}
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      className="text-red-500 hover:text-[#1C45EF]"
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      className="text-blue-500 hover:text-[#1C45EF]"
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setIsEditOpen(true);
                      }}
                    >
                      <Pen size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 border-t text-gray-600 text-sm">
            <span>
              Showing {startIndex + 1}–
              {Math.min(startIndex + itemsPerPage, filteredSuppliers.length)} of{" "}
              {filteredSuppliers.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ‹
              </Button>
              {[1, 2, 3].map((num) => (
                <Button
                  key={num}
                  size="sm"
                  variant={num === currentPage ? "default" : "outline"}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                ›
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* === MODAL TAMBAH SUPPLIER === */}
      {isAddOpen && (
        <Modal title="Tambah Supplier" onClose={() => setIsAddOpen(false)}>
          <form onSubmit={handleAddSupplier} className="flex flex-col gap-4">
            <InputField label="Nama Supplier" value={newSupplier.nama}
              onChange={(e) => setNewSupplier({ ...newSupplier, nama: e.target.value })} />
            <InputField label="Kontak" value={newSupplier.contact}
              onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })} />
            <Button type="submit" className="w-full bg-[#C8D6FF] text-[#111827] py-3 rounded-xl hover:bg-[#B5C8FF] flex justify-center items-center gap-2">
              Tambah Supplier <PlusCircle size={18} />
            </Button>
          </form>
        </Modal>
      )}

      {/* === MODAL VIEW === */}
      {isViewOpen && selectedSupplier && (
        <Modal title="Detail Supplier" onClose={() => setIsViewOpen(false)}>
          <div className="flex flex-col gap-3 text-sm text-gray-700">
            <p><strong>Nama:</strong> {selectedSupplier.nama}</p>
            <p><strong>Kontak:</strong> {selectedSupplier.contact || "-"}</p>
            <p><strong>Jumlah Produk:</strong> {selectedSupplier.produk?.length || 0}</p>
          </div>
        </Modal>
      )}

      {/* === MODAL EDIT === */}
      {isEditOpen && selectedSupplier && (
        <Modal title="Edit Supplier" onClose={() => setIsEditOpen(false)}>
          <form onSubmit={handleEditSupplier} className="flex flex-col gap-4">
            <InputField label="Nama Supplier" value={selectedSupplier.nama}
              onChange={(e) =>
                setSelectedSupplier({ ...selectedSupplier, nama: e.target.value })
              } />
            <InputField label="Kontak" value={selectedSupplier.contact || ""}
              onChange={(e) =>
                setSelectedSupplier({ ...selectedSupplier, contact: e.target.value })
              } />
            <Button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600">
              Simpan Perubahan
            </Button>
          </form>
        </Modal>
      )}

      {/* === MODAL DELETE === */}
      {isDeleteOpen && selectedSupplier && (
        <Modal title="Hapus Supplier" onClose={() => setIsDeleteOpen(false)}>
          <p className="text-sm text-gray-700 mb-5">
            Apakah kamu yakin ingin menghapus{" "}
            <span className="font-semibold">{selectedSupplier.nama}</span>?
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
            >
              Batal
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteSupplier}
            >
              Hapus
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// === REUSABLE MODAL ===
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-lg p-8 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={22} />
        </button>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">{title}</h2>
        {children}
      </div>
    </div>
  );
}

// === REUSABLE INPUT FIELD ===
function InputField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        required
        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#C8D6FF] focus:outline-none"
      />
    </div>
  );
}
