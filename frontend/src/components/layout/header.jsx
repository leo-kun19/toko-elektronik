import { Bell } from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../store"; 

export default function Header() {
  const { lowStockCount, lowStockItems } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 left-64 right-0 bg-white shadow-sm flex items-center justify-between px-8 py-3 z-50">
      {/* Search Bar */}
      <div className="relative w-96">
      </div>

      {/* Right section */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="flex items-center gap-4 relative">
          <button
            className="relative text-gray-500 hover:text-gray-700"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {lowStockCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                {lowStockCount}
              </span>
            )}
          </button>

          {/* Dropdown Notifikasi */}
          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl p-4 z-50 max-h-96 overflow-y-auto">
              <h4 className="font-semibold mb-3">Stok Rendah ({lowStockCount})</h4>
              {lowStockItems.length > 0 ? (
                <ul className="space-y-2">
                  {lowStockItems.map((item) => (
                    <li key={item.id} className="p-2 border-b last:border-b-0">
                      <div className="font-medium">{item.nama}</div>
                      <div className="text-sm text-gray-600">
                        Kategori: {item.kategori} • Stok: {item.stok}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">Tidak ada stok rendah.</p>
              )}
              <div className="mt-3 pt-3 border-t">
                <button
                  className="w-full text-center text-xs text-blue-600 hover:text-blue-800"
                  onClick={() => {
                    setShowNotifications(false);
                    window.location.href = "/stok";
                  }}
                >
                  Lihat Semua Stok
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-medium text-gray-800">Annisa Cahyani</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}