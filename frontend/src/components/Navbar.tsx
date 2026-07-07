"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const COLORS = { bg: "#111827", green: "#10b981", amber: "#f59e0b", indigo: "#6366f1", border: "#1f2937", text: "#e5e7eb", textDim: "#9ca3af" };

const SearchIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const BellIcon = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const HeartIcon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const ChevronIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>;
const MenuIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const XIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

const Logo = () => (
  <svg width="130" height="32" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="50" height="50" rx="12" fill="#1f2937"/>
    <rect x="13" y="10" width="5" height="28" rx="2" fill={COLORS.green}/>
    <rect x="13" y="10" width="20" height="5" rx="2" fill={COLORS.green}/>
    <rect x="13" y="22" width="15" height="5" rx="2" fill={COLORS.green}/>
    <text x="60" y="34" fontFamily="Inter, Arial, sans-serif" fontSize="22" fontWeight="700" fill="#f3f4f6" letterSpacing="-0.5">freel<tspan fill={COLORS.green}>amz</tspan></text>
  </svg>
);

interface NavUser {
  id: number;
  name: string;
  avatar?: string;
  role?: string;
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<NavUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/search/gigs?search=${encodeURIComponent(search.trim())}`);
  };

  const navLinks = [
    { href: "/search/gigs", label: "Servicos" },
    { href: "/categories", label: "Categorias" },
    { href: "/freelancers", label: "Freelancers" },
  ];

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 1000, background: COLORS.bg, borderBottom: `1px solid ${COLORS.border}` }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: "68px", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "28px", flex: 1, minWidth: 0 }}>
          <Link href="/" style={{ display: "flex", flexShrink: 0 }}>
            <Logo />
          </Link>

          <form onSubmit={handleSearch} style={{ display: "none", alignItems: "center", width: "320px", maxWidth: "100%", height: "40px", border: `1px solid ${COLORS.border}`, borderRadius: "8px", overflow: "hidden", background: "#1f2937" }} className="navbar-search">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Que servico procura?"
              style={{ flex: 1, height: "100%", border: "none", outline: "none", padding: "0 14px", fontSize: "14px", background: "transparent", color: COLORS.text }}
            />
            <button type="submit" style={{ width: "42px", height: "100%", background: "transparent", border: "none", cursor: "pointer", color: COLORS.textDim }}>
              <SearchIcon />
            </button>
          </form>

          <div style={{ display: "none", alignItems: "center", gap: "22px" }} className="navbar-links">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} style={{ color: COLORS.text, textDecoration: "none", fontSize: "14px", fontWeight: 500, whiteSpace: "nowrap" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ display: "none", alignItems: "center", gap: "18px" }} className="navbar-actions">
          {user ? (
            <>
              <Link href="/favorites" style={{ color: COLORS.textDim, display: "flex" }} title="Favoritos">
                <HeartIcon />
              </Link>
              <Link href="/messages" style={{ color: COLORS.textDim, display: "flex" }} title="Notificacoes">
                <BellIcon />
              </Link>
              <Link href="/dashboard" style={{ color: COLORS.text, textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>
                Painel
              </Link>
              {user.role === "freelancer" && (
                <Link href="/create-gig" style={{ background: COLORS.green, color: "#fff", padding: "8px 16px", borderRadius: "8px", fontWeight: 600, fontSize: "13.5px", textDecoration: "none" }}>
                  + Publicar Servico
                </Link>
              )}
              <div ref={dropdownRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  style={{ display: "flex", alignItems: "center", gap: "8px", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: COLORS.indigo, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "14px", overflow: "hidden" }}>
                    {user.avatar ? <img src={user.avatar} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (user.name?.[0]?.toUpperCase() || "U")}
                  </div>
                  <span style={{ color: COLORS.textDim }}><ChevronIcon /></span>
                </button>

                {dropdownOpen && (
                  <div style={{ position: "absolute", top: "48px", right: 0, width: "220px", background: "#1f2937", border: `1px solid ${COLORS.border}`, borderRadius: "10px", boxShadow: "0 12px 28px rgba(0,0,0,0.4)", overflow: "hidden" }}>
                    <div style={{ padding: "14px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
                      <div style={{ color: "#fff", fontWeight: 600, fontSize: "14px" }}>{user.name}</div>
                      <div style={{ color: COLORS.textDim, fontSize: "12px", marginTop: "2px" }}>{user.role === "freelancer" ? "Freelancer" : "Cliente"}</div>
                    </div>
                    {[
                      { href: "/dashboard", label: "Painel" },
                      { href: "/profile", label: "Meu perfil" },
                      { href: "/orders", label: "Encomendas" },
                      { href: "/favorites", label: "Favoritos" },
                      { href: "/affiliates", label: "Programa de afiliados" },
                      { href: "/analytics", label: "Analytics" },
                      { href: "/payments", label: "Pagamentos" },
                    ].map((l) => (
                      <Link key={l.href} href={l.href} onClick={() => setDropdownOpen(false)} style={{ display: "block", padding: "11px 16px", color: COLORS.text, textDecoration: "none", fontSize: "13.5px" }}>
                        {l.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 16px", color: "#f87171", background: "transparent", border: "none", borderTop: `1px solid ${COLORS.border}`, cursor: "pointer", fontSize: "13.5px" }}
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: COLORS.text, textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>Entrar</Link>
              <Link href="/register" style={{ background: COLORS.indigo, color: "#fff", padding: "9px 18px", borderRadius: "8px", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}>
                Registar
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(true)} style={{ display: "flex", background: "transparent", border: "none", color: COLORS.text, cursor: "pointer" }} className="navbar-burger">
          <MenuIcon />
        </button>
      </div>

      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.6)" }} onClick={() => setMobileOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", top: 0, right: 0, width: "280px", maxWidth: "85vw", height: "100%", background: COLORS.bg, padding: "20px", borderLeft: `1px solid ${COLORS.border}`, overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <Logo />
              <button onClick={() => setMobileOpen(false)} style={{ background: "transparent", border: "none", color: COLORS.text, cursor: "pointer" }}><XIcon /></button>
            </div>

            <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false); }} style={{ display: "flex", marginBottom: "20px", border: `1px solid ${COLORS.border}`, borderRadius: "8px", overflow: "hidden", background: "#1f2937" }}>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar servicos..." style={{ flex: 1, border: "none", outline: "none", padding: "10px 12px", background: "transparent", color: COLORS.text, fontSize: "14px" }} />
              <button type="submit" style={{ width: "42px", background: "transparent", border: "none", color: COLORS.textDim }}><SearchIcon /></button>
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} style={{ padding: "12px 8px", color: COLORS.text, textDecoration: "none", fontSize: "15px", fontWeight: 500, borderBottom: `1px solid ${COLORS.border}` }}>
                  {l.label}
                </Link>
              ))}
              {user ? (
                <>
                  {user.role === "freelancer" && (
                    <Link href="/create-gig" onClick={() => setMobileOpen(false)} style={{ marginTop: "6px", marginBottom: "6px", textAlign: "center", background: COLORS.green, color: "#fff", padding: "12px", borderRadius: "8px", fontWeight: 600, textDecoration: "none" }}>
                      + Publicar Servico
                    </Link>
                  )}
                  {[
                    { href: "/dashboard", label: "Painel" },
                    { href: "/profile", label: "Meu perfil" },
                    { href: "/orders", label: "Encomendas" },
                    { href: "/favorites", label: "Favoritos" },
                    { href: "/affiliates", label: "Programa de afiliados" },
                    { href: "/analytics", label: "Analytics" },
                    { href: "/payments", label: "Pagamentos" },
                  ].map((l) => (
                    <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} style={{ padding: "12px 8px", color: COLORS.text, textDecoration: "none", fontSize: "15px", borderBottom: `1px solid ${COLORS.border}` }}>
                      {l.label}
                    </Link>
                  ))}
                  <button onClick={handleLogout} style={{ textAlign: "left", padding: "12px 8px", color: "#f87171", background: "transparent", border: "none", fontSize: "15px", cursor: "pointer" }}>
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} style={{ padding: "12px 8px", color: COLORS.text, textDecoration: "none", fontSize: "15px", borderBottom: `1px solid ${COLORS.border}` }}>Entrar</Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} style={{ marginTop: "10px", textAlign: "center", background: COLORS.indigo, color: "#fff", padding: "12px", borderRadius: "8px", fontWeight: 600, textDecoration: "none" }}>Registar</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 1024px) {
          .navbar-search { display: flex !important; }
          .navbar-links { display: flex !important; }
          .navbar-actions { display: flex !important; }
          .navbar-burger { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
