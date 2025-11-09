import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Box,
  Layers,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Sidebar() {
  const [isBarangOpen, setIsBarangOpen] = useState(true);

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      {/* Logo dan Nama Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <img src={logo} alt="Logo" className="w-8 h-8" />
        <h1 className="text-base font-semibold text-[#1C2451] leading-tight">
          Ginbers Jaya <br /> Elektronik
        </h1>
      </div>

      {/* Navigasi */}
      <nav className="flex-1 overflow-y-auto mt-3">
        <ul className="px-2 space-y-1">
          {/* Dashboard */}
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                  isActive
                    ? "bg-[#E5EDFF] text-[#1C2451] font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#1C2451]"
                }`
              }
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Manajemen Barang - Submenu */}
          <li>
            <button
              onClick={() => setIsBarangOpen(!isBarangOpen)}
              className="flex items-center justify-between w-full px-4 py-2.5 text-gray-600 hover:text-[#1C2451] hover:bg-gray-50 rounded-lg transition"
            >
              <div className="flex items-center gap-3">
                <Box size={18} />
                <span>Manajemen Barang</span>
              </div>
              {isBarangOpen ? (
                <ChevronDown size={16} className="text-gray-500" />
              ) : (
                <ChevronRight size={16} className="text-gray-500" />
              )}
            </button>

            {isBarangOpen && (
              <ul className="ml-8 mt-1 space-y-1">
                <li>
                  <NavLink
                    to="/stok"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                        isActive
                          ? "bg-[#E5EDFF] text-[#1C2451] font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-[#1C2451]"
                      }`
                    }
                  >
                    <Package size={16} />
                    <span>Kelola Barang</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/supplier"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                        isActive
                          ? "bg-[#E5EDFF] text-[#1C2451] font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-[#1C2451]"
                      }`
                    }
                  >
                    <Layers size={16} />
                    <span>Supplier Barang</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/kategori"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                        isActive
                          ? "bg-[#E5EDFF] text-[#1C2451] font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-[#1C2451]"
                      }`
                    }
                  >
                    <Layers size={16} />
                    <span>Kategori</span>
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
}
