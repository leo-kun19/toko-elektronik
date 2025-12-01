import { Bell, ChevronDown, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppContext } from "../../store";
import { authAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { lowStockCount, lowStockItems } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      // Clear local storage
      localStorage.clear();
      // Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      // Tetap redirect meskipun error
      navigate("/login");
    }
  };

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
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
          >
            <div className="text-right">
              <p className="font-medium text-gray-800">
                {userProfile?.username || "Loading..."}
              </p>
              <p className="text-xs text-gray-400">{userProfile?.role || "Admin"}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
              {userProfile?.username?.charAt(0).toUpperCase() || "A"}
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-medium text-gray-800">{userProfile?.username}</p>
                <p className="text-xs text-gray-500">{userProfile?.role}</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}