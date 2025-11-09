import React, { useState } from "react";
import { Search, Plus, Eye, Trash2, Pen, LayoutGrid, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import Button from "../components/ui/button";

export default function Kategori() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  // dummy data
  const categories = [
    { id: 1, name: "Kulkas", description: "Kulkas adalah lorem ipsum dolor sit amet" },
    { id: 2, name: "TV", description: "TV adalah amet sit et al lorem dolor" },
    { id: 3, name: "Kipas Angin", description: "Kipas Angin adalah merupakan lorem ipsum il" },
    { id: 4, name: "Mesin Cuci", description: "Mesin Cuci lorem ipsum dolor sit amet" },
    { id: 5, name: "Dispenser", description: "Dispenser amet lorem dolor sit" },
    { id: 6, name: "Oven", description: "Oven lorem ipsum amet dolor sit" },
  ];

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  // handlers
  const handleAddCategory = (e) => {
    e.preventDefault();
    console.log("Kategori baru:", newCategory);
    setNewCategory({ name: "", description: "" });
    setIsAddOpen(false);
  };

  const handleEditCategory = (e) => {
    e.preventDefault();
    console.log("Kategori diedit:", selectedCategory);
    setIsEditOpen(false);
  };

  const handleDeleteCategory = () => {
    console.log("Hapus kategori:", selectedCategory);
    setIsDeleteOpen(false);
  };

  return (
    <div className="flex flex-col gap-5 mt-10">
      {/* === HEADER + BUTTON === */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Kategori Barang</h1>
        <Button
          className="flex items-center gap-2 bg-[#1C45EF] hover:bg-[#0f2c99] text-white"
          onClick={() => setIsAddOpen(true)}
        >
         <Plus size={16} />  Tambah Kategori
        </Button>
      </div>

      {/* === CARD === */}
      <Card className="rounded-2xl shadow-md border border-gray-100">
        <CardHeader className="flex items-center justify-between bg-[#E5EDFF] rounded-t-2xl px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="bg-[#1C45EF] p-2 rounded-lg text-white">
              <LayoutGrid size={18} />
            </div>
            <CardTitle className="text-base font-semibold text-[#1C2451]">Kategori</CardTitle>
          </div>

          {/* search bar */}
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
                <th className="px-6 py-3 text-left font-medium">Nama Kategori</th>
                <th className="px-6 py-3 text-left font-medium">Deskripsi</th>
                <th className="px-6 py-3 text-left font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {currentCategories.map((category) => (
                <tr key={category.id} className="border-b hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-3">{category.name}</td>
                  <td className="px-6 py-3">{category.description}</td>
                  <td className="py-3 px-1 text-center flex gap-5">
                    <button
                      className="text-yellow-500 hover:text-[#1C45EF]"
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsViewOpen(true);
                      }}
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      className="text-red-500 hover:text-[#1C45EF]"
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                    <button
                      className="text-blue-500 hover:text-[#1C45EF]"
                      onClick={() => {
                        setSelectedCategory(category);
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

          {/* pagination */}
          <div className="flex justify-between items-center px-6 py-4 border-t text-gray-600 text-sm">
            <span>
              Showing {startIndex + 1}–
              {Math.min(startIndex + itemsPerPage, filteredCategories.length)} from{" "}
              {filteredCategories.length}
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
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant={i + 1 === currentPage ? "default" : "outline"}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                ›
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* === MODAL TAMBAH === */}
      {isAddOpen && (
        <Modal title="Tambah Kategori" onClose={() => setIsAddOpen(false)}>
          <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
            <Input label="Nama Kategori" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} />
            <Textarea label="Deskripsi" value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} />
            <Button type="submit" className="w-full bg-[#C8D6FF] text-[#111827] text-sm font-semibold py-3 rounded-xl hover:bg-[#B5C8FF] transition flex justify-center items-center gap-2">
              Tambah Kategori <Plus size={18} />
            </Button>
          </form>
        </Modal>
      )}

      {/* === MODAL VIEW === */}
      {isViewOpen && selectedCategory && (
        <Modal title="Detail Kategori" onClose={() => setIsViewOpen(false)}>
          <p className="text-sm mb-2 text-gray-700">Nama Kategori:</p>
          <p className="font-semibold mb-4">{selectedCategory.name}</p>
          <p className="text-sm mb-2 text-gray-700">Deskripsi:</p>
          <p>{selectedCategory.description}</p>
        </Modal>
      )}

      {/* === MODAL EDIT === */}
      {isEditOpen && selectedCategory && (
        <Modal title="Edit Kategori" onClose={() => setIsEditOpen(false)}>
          <form onSubmit={handleEditCategory} className="flex flex-col gap-4">
            <Input label="Nama Kategori" value={selectedCategory.name} onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })} />
            <Textarea label="Deskripsi" value={selectedCategory.description} onChange={(e) => setSelectedCategory({ ...selectedCategory, description: e.target.value })} />
            <Button type="submit" className="w-full bg-[#C8D6FF] text-[#111827] text-sm font-semibold py-3 rounded-xl hover:bg-[#B5C8FF] transition flex justify-center items-center gap-2">
              Simpan
            </Button>
          </form>
        </Modal>
      )}

      {/* === MODAL DELETE === */}
      {isDeleteOpen && selectedCategory && (
        <Modal title="Konfirmasi Hapus" onClose={() => setIsDeleteOpen(false)}>
          <p className="mb-4 text-gray-800">
            Apakah Anda yakin ingin menghapus kategori{" "}
            <span className="font-semibold">{selectedCategory.name}</span>?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Batal
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteCategory}
            >
              Hapus
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* === REUSABLE MODAL === */
const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-[2px]" onClick={onClose}></div>
    <div className="relative bg-white w-full max-w-md mx-4 rounded-2xl shadow-xl p-8 z-10 animate-fadeIn">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
      >
        <X size={22} />
      </button>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">{title}</h2>
      {children}
    </div>
  </div>
);

/* === SMALL INPUT & TEXTAREA COMPONENTS === */
const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      {...props}
      className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#C8D6FF] focus:outline-none"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      {...props}
      rows={3}
      className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm resize-none focus:ring-2 focus:ring-[#C8D6FF] focus:outline-none"
    />
  </div>
);
