import React, { useRef } from 'react';
import { useState } from "react";
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import produkNavbar from '../assets/produknavbar.png';
import produkKatalog from '../assets/produkkatalog.png';

export default function LandingPage() {
  const heroRef = useRef(null);
  const produkRef = useRef(null);
  const reviewRef = useRef(null);
  const aduanRef = useRef(null);
  const footerRef = useRef(null);

  const [aduanMessage, setAduanMessage] = useState('');

  const handleKirimAduan = () => {
    if (!aduanMessage.trim()) {
      alert('Silakan masukkan pesan pengaduan terlebih dahulu.');
      return;
    }

    // Format tanggal real-time
    const now = new Date();
    const tanggal = now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Format pesan
    const pesan = `[Pengaduan Barang Toko Ginbers Jaya Elektronik]\n${tanggal}\n\n${aduanMessage}`;

    const nomorWhatsApp = '6282164556442'; 

    // Encode pesan agar aman di URL
    const encodedPesan = encodeURIComponent(pesan);

    // Buka WhatsApp Web
    window.open(
      `https://wa.me/${nomorWhatsApp}?text=${encodedPesan}`,
      '_blank'
    );
  };

  const scrollToSection = ref => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ===== CUSTOM NAVBAR ===== */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo Ginbers Jaya Elektronik"
            className="w-10 h-10"
          />
          <span className="text-lg font-bold text-gray-800">
            Ginbers Jaya Elektronik
          </span>
        </div>
        <nav className="flex gap-6 text-sm font-medium text-gray-700">
          <button
            onClick={() => scrollToSection(heroRef)}
            className="hover:text-blue-600"
          >
            Beranda
          </button>
          <button
            onClick={() => scrollToSection(produkRef)}
            className="hover:text-blue-600"
          >
            Kategori
          </button>
          <button
            onClick={() => scrollToSection(aduanRef)}
            className="hover:text-blue-600"
          >
            Aduan
          </button>
        </nav>
      </header>
      {/* ===== HERO SECTION ===== */}
      <section
        ref={heroRef}
        className="pt-20 pb-16 relative h-[70vh] w-full overflow-hidden mt-18"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-400"></div>
        <img
          src={produkNavbar}
          alt="Produk Ginbers Jaya Elektronik"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="relative z-10 max-w-2xl px-6 py-20 ml-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            GINBERS JAYA ELEKTRONIK
          </h1>
          <p className="text-lg text-gray-700 max-w-lg">
            Toko elektronik yang dipercaya masyarakat untuk membeli barang
            dengan harga terbaik.
          </p>
        </div>
      </section>
      <section ref={produkRef} className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-10">
            Produk Ginbers Jaya Elektronik
          </h2>
          <div className="inline-block bg-white">
            <img
              src={produkKatalog}
              alt="Katalog Produk"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </section>
      <section ref={aduanRef} className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-2">
            Pengaduan Barang dan Layanan
          </h2>
          <p className="text-sm mb-6 max-w-xl mx-auto">
            Jika terdapat keluhan atau aduan mengenai produk yang telah dibeli, silahkan 
            masukkan pesan melalui form di bawah ini.
          </p>
          <div className="max-w-lg mx-auto flex gap-2 bg-white rounded-xl">
            <input
              type="text"
              placeholder="Aduan"
              className="flex-1 px-4 py-2 rounded-lg text-gray-800 focus:outline-none"
              value={aduanMessage}
              onChange={e => setAduanMessage(e.target.value)}
            />
            <button
              onClick={handleKirimAduan}
              className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg font-medium text-white"
            >
              Kirim
            </button>
          </div>
        </div>
      </section>
      <footer className="bg-black text-white py-10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Informasi Perusahaan */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={logo}
                  alt="Logo Ginbers Jaya Elektronik"
                  className="w-10 h-10"
                />
                <h3 className="text-xl font-bold">Ginbers Jaya Elektronik</h3>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                Jln. Utama No 19-A, Batang Kuis.
              </p>
              <p className="text-sm text-gray-400 mb-2">
                dikiginting55@gmail.com
              </p>
              <p className="text-sm text-gray-400">0812-654-0800</p>
            </div>

            {/* Kategori Teratas */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Kategori Teratas</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white">
                    Kulkas
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Kipas Angin
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Lampu
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    TV
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Jelajahi Semua Produk →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Tautan Cepat */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Tautan Cepat</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs text-gray-500">
            © Copyright Ginbers Jaya Elektronik 2025. All right reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
