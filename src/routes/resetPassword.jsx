import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function ResetPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset password link sent to:", email);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#C8D6FF]">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-8 h-8" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">
          Password Reset
        </h2>
        <p className="text-center text-gray-500 mb-6">
          We will help you reset your password
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email Address"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1C2451] text-white py-2 rounded-md hover:bg-[#121939] transition"
          >
            Reset Password
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Remembered your password?
        </div>

        <div className="mt-3">
          <Link
            to="/login"
            className="block text-center w-full border border-gray-200 py-2 rounded-md text-blue-600 hover:bg-blue-50 transition"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
