// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAppContext } from "./store"; 

import Sidebar from "./components/layout/sidebar.jsx";
import Header from "./components/layout/header.jsx";
import Container from "./components/layout/container.jsx";

import Dashboard from "./routes/dashboard.jsx";
import Stok from "./routes/stok.jsx";
import Supplier from "./routes/supplier.jsx";
import Kategori from "./routes/kategori.jsx";
import Login from "./routes/login.jsx";


function AppContent() {
  const location = useLocation();
  const { lowStockCount } = useAppContext();

  const isAuthPage =
    location.pathname === "/" || 
    location.pathname === "/login";

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#cdd9ff] flex items-center justify-center p-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="flex bg-[#f6f8ff] min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <Header lowStockCount={lowStockCount} />
        <Container>
          <main className="mt-4 p-6 overflow-y-auto flex-1">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/stok" element={<Stok />} />
              <Route path="/supplier" element={<Supplier />} />
              <Route path="/kategori" element={<Kategori />} />
            </Routes>
          </main>
        </Container>
      </div>
    </div>
  );
}

// Pastikan AppProvider juga diimpor
import { AppProvider } from "./store";

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}