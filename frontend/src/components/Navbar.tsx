"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-3xl font-bold text-green-600 tracking-tight">
              freelamz<span className="text-green-500">.</span>
            </Link>
            
            {/* Search Bar */}
            <div className="hidden md:flex items-center">
              <input
                type="text"
                placeholder="Que tipo de servico procuras?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-80 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none"
              />
              <button className="bg-black text-white px-4 py-2 rounded-r-lg hover:bg-gray-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            <Link href="/projects" className="text-gray-600 hover:text-green-600 font-medium">Explorar</Link>
            {token ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-green-600 font-medium">Dashboard</Link>
                <button 
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/";
                  }}
                  className="text-gray-600 hover:text-red-600 font-medium"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-green-600 font-medium">Entrar</Link>
                <Link href="/register" className="border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-50 font-medium">
                  Junta-te
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
