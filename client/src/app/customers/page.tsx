"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LoanAnalysis {
  id: number;
  user_id: string;
  nama: string;
  pendapatan_bulanan: number;
  jumlah_pinjaman: number;
  dti_ratio: number;
  kategori_risiko: string;
  skor_ai: number;
  status_rekomendasi: string;
}

export default function Customers() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<LoanAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) { router.push("/login"); return; }
    fetch("http://api.test/api/analyses", {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
    }).then(res => {
      if (res.status === 401) { router.push("/login"); return null; }
      return res.json();
    }).then(data => { if (data) setAnalyses(data); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = analyses.filter(a =>
    a.nama.toLowerCase().includes(search.toLowerCase()) || a.user_id.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

  const getScoreColor = (score: number) => {
    if (score >= 700) return 'text-emerald-600';
    if (score >= 580) return 'text-amber-600';
    return 'text-red-600';
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/" },
    { id: "evaluations", label: "Evaluations", href: "/evaluations" },
    { id: "customers", label: "Customers", href: "/customers" },
    { id: "settings", label: "Settings", href: "/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F6F7F5] text-neutral-900 font-sans">
      <aside className="w-72 bg-white flex flex-col p-8 sticky top-0 h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 hidden md:flex">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#A6E14B] to-[#D5F79D] flex items-center justify-center text-neutral-900 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <span className="text-2xl font-bold tracking-tight">Pinjol<span className="text-[#8CC63F]">Score</span></span>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link key={item.id} href={item.href} className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl font-medium transition-all duration-300 ${item.id === "customers" ? "bg-neutral-900 text-white shadow-lg" : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-8 border-t border-neutral-100">
          <button onClick={() => { localStorage.removeItem("auth_token"); router.push("/login"); }} className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Customers</h1>
            <p className="text-neutral-500">Overview of all loan applicants and their credit profiles.</p>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[
              { label: "Total Applicants", value: analyses.length, color: "text-neutral-900" },
              { label: "Avg. AI Score", value: analyses.length > 0 ? Math.round(analyses.reduce((a, c) => a + c.skor_ai, 0) / analyses.length) : 0, color: "text-blue-600" },
              { label: "High Risk Count", value: analyses.filter(a => a.kategori_risiko === 'High Risk').length, color: "text-red-500" },
            ].map(card => (
              <div key={card.label} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                <div className="text-neutral-500 text-sm mb-1">{card.label}</div>
                <div className={`text-3xl font-bold ${card.color}`}>{card.value}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <input type="text" placeholder="Search by name or customer ID..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#c6f174]" />
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-3.5 text-neutral-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>

          {/* Customer Cards Grid */}
          {loading ? (
            <div className="p-16 text-center text-neutral-400">Loading customers...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(item => (
                <div key={item.id} className="bg-white rounded-3xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#A6E14B]/30 to-[#D5F79D]/30 flex items-center justify-center text-neutral-800 font-bold text-sm">
                        {item.nama.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{item.nama}</div>
                        <div className="text-xs text-neutral-400">{item.user_id}</div>
                      </div>
                    </div>
                    <span className={`text-2xl font-bold ${getScoreColor(item.skor_ai)}`}>{item.skor_ai}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-neutral-500">
                      <span>Monthly Income</span>
                      <span className="font-medium text-neutral-800">{formatCurrency(item.pendapatan_bulanan)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-500">
                      <span>Loan Requested</span>
                      <span className="font-medium text-neutral-800">{formatCurrency(item.jumlah_pinjaman)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-500">
                      <span>DTI Ratio</span>
                      <span className="font-medium text-neutral-800">{Number(item.dti_ratio).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-neutral-100">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                      item.status_rekomendasi === 'Sangat Layak' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      item.status_rekomendasi === 'Layak dengan Catatan' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                      'bg-rose-100 text-rose-700 border-rose-200'
                    }`}>{item.status_rekomendasi}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
