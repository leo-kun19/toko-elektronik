import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🟢 penting supaya cocok dgn CORS backend
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Login sukses
        localStorage.setItem("token", data.token);
        alert("Login berhasil!");
        navigate("/dashboard");
      } else {
        // ❌ Login gagal
        alert(data.error || "Username atau password salah");
      }
    } catch (err) {
      console.error("Error saat login:", err);
      alert("Tidak dapat terhubung ke server. Pastikan backend berjalan di port 3001.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#C8D6FF] px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-10 h-10" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">
          Sign In
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Masukkan kredensial akun admin beserta password yang tervalidasi
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan Username"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan Password"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1C2451] text-white py-2 rounded-md hover:bg-[#141b3b] transition"
          >
            Sign In
          </button>
        </form>


      </div>
    </div>
  );
}
