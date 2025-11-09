import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
    navigate("/dashboard"); // Redirect ke dashboard setelah login
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
          Masukkan akun kredensial yang tervalidasi sebagai admin
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email Address"
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
              placeholder="Enter Password"
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

        {/* Footer */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-center text-sm">
            <Link
              to="/reset-password"
              className="text-blue-600 hover:underline font-medium"
            >
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
