import { useState } from "react";
import { Search, Calendar, Filter, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

export default function Transaksi() {
  const [page, setPage] = useState(1);
  const perPage = 5;

  const transaksiData = [
    { id: 1, nama: "Kulkas Samsung", jumlah: 115, total: "$121.00", status: "Pengeluaran" },
    { id: 2, nama: "Kipas Angin Kematian", jumlah: 35, total: "$590.00", status: "Pengeluaran" },
    { id: 3, nama: "Lampu Phillips", jumlah: 150, total: "$607.00", status: "Pemasukan" },
  ];

  const totalPages = Math.ceil(transaksiData.length / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, transaksiData.length);
  const transaksi = transaksiData.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col gap-5 mt-10">
      {/* 🔍 Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Transaksi</h1>
        <Button variant="outline" className="flex gap-2">
          <Calendar size={16} /> Select Dates
        </Button>
      </div>

      {/* 🔹 Section Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Card 1 */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-white">Manajemen Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="mt-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white flex gap-2">
              Tambah Transaksi <span className="font-bold text-lg">+</span>
            </Button>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-300 text-white rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-white">Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-0.5">Rp 124.000.000</h2>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md">0%</span>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="bg-gradient-to-br from-yellow-600 to-yellow-400 text-white rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-white">Pemasukan</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-0.5">Rp 225.000.000</h2>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md">-25%</span>
          </CardContent>
        </Card>
      </div>

      {/* 📋 Tabel Transaksi */}
      <Card className="rounded-2xl shadow-md bg-white mt-5">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-lg font-semibold">Transaksi</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" className="flex gap-2">
              <Calendar size={18} /> Select Date
            </Button>
            <Button variant="outline" className="flex gap-2">
              <Filter size={18} /> Filters
            </Button>
            <Button className="bg-indigo-500 text-white hover:bg-indigo-600">See All</Button>
          </div>
        </CardHeader>

        <CardContent>
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-gray-500 text-sm">
                <th className="text-left px-6">Nama Barang</th>
                <th className="text-left px-6">Kuantitas</th>
                <th className="text-left px-6">Total</th>
                <th className="text-left px-6">Status</th>
                <th className="text-center px-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {transaksi.map((item) => (
                <tr
                  key={item.id}
                  className="bg-[#f8f9ff] hover:bg-[#eef0ff] transition-all text-gray-800 rounded-xl"
                >
                  <td className="px-6 py-4 rounded-l-xl">{item.nama}</td>
                  <td className="px-6 py-4">{item.jumlah}</td>
                  <td className="px-6 py-4 font-medium">{item.total}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === "Pengeluaran"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 rounded-r-xl text-center flex justify-center gap-3">
                    <Eye size={18} className="text-blue-500 hover:text-gray-700 cursor-pointer" />
                    <Trash2 size={18} className="text-red-500 hover:text-red-500 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 📄 Pagination Section */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-gray-500 text-sm">
              Showing {startIndex + 1}–{endIndex} from {transaksiData.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <Button
                  key={num}
                  size="sm"
                  variant={page === num ? "default" : "outline"}
                  onClick={() => setPage(num)}
                >
                  {num}
                </Button>
              ))}
              <Button
                size="icon"
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
