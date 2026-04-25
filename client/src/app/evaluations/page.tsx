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
  tenor: number;
  dti_ratio: number;
  kategori_risiko: string;
  skor_ai: number;
  status_rekomendasi: string;
  created_at: string;
}

export default function Evaluations() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState<LoanAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) { router.push("/login"); return; }
    fetchAnalyses(token);
  }, []);

  const fetchAnalyses = async (token: string) => {
    try {
      const res = await fetch("http://api.test/api/analyses", {
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
      });
      if (res.status === 401) { router.push("/login"); return; }
      const data = await res.json();
      setAnalyses(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filtered = analyses.filter(a => {
    const matchSearch = a.nama.toLowerCase().includes(search.toLowerCase()) || a.user_id.toLowerCase().includes(search.toLowerCase());
    const matchRisk = filterRisk === "all" || a.kategori_risiko === filterRisk;
    return matchSearch && matchRisk;
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low Risk': return 'bg-emerald-100 text-emerald-700';
      case 'Medium Risk': return 'bg-yellow-100 text-yellow-700';
      case 'High Risk': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRecommendationColor = (status: string) => {
    switch (status) {
      case 'Sangat Layak': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Layak dengan Catatan': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Beresiko Tinggi': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
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
            <Link key={item.id} href={item.href} className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl font-medium transition-all duration-300 ${item.id === "evaluations" ? "bg-neutral-900 text-white shadow-lg" : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"}`}>
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
            <h1 className="text-4xl font-bold tracking-tight mb-2">All Evaluations</h1>
            <p className="text-neutral-500">Complete list of all loan evaluation records with search and filter.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <input type="text" placeholder="Search by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#c6f174]" />
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-3.5 text-neutral-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}
              className="px-5 py-3 bg-white border border-neutral-200 rounded-2xl text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#c6f174] min-w-[160px]">
              <option value="all">All Risk Levels</option>
              <option value="Low Risk">Low Risk</option>
              <option value="Medium Risk">Medium Risk</option>
              <option value="High Risk">High Risk</option>
            </select>
            <div className="bg-white border border-neutral-200 rounded-2xl px-5 py-3 text-sm text-neutral-500 flex items-center gap-2">
              <span className="font-semibold text-neutral-900">{filtered.length}</span> results
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-neutral-100 overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-16 text-center text-neutral-400">Loading evaluations...</div>
              ) : filtered.length === 0 ? (
                <div className="p-16 text-center text-neutral-400">No records found for current filter.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-neutral-500 text-xs uppercase tracking-wide border-b border-neutral-100 bg-neutral-50/50">
                      <th className="font-semibold py-4 px-8">Applicant</th>
                      <th className="font-semibold py-4 px-4">Income</th>
                      <th className="font-semibold py-4 px-4">Loan Requested</th>
                      <th className="font-semibold py-4 px-4">Tenor</th>
                      <th className="font-semibold py-4 px-4">DTI %</th>
                      <th className="font-semibold py-4 px-4">AI Score</th>
                      <th className="font-semibold py-4 px-4">Risk</th>
                      <th className="font-semibold py-4 px-8 text-right">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filtered.map((item) => (
                      <tr key={item.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                        <td className="py-4 px-8">
                          <div className="font-semibold">{item.nama}</div>
                          <div className="text-neutral-400 text-xs mt-0.5">{item.user_id}</div>
                        </td>
                        <td className="py-4 px-4 text-neutral-700">{formatCurrency(item.pendapatan_bulanan)}</td>
                        <td className="py-4 px-4 text-neutral-700">{formatCurrency(item.jumlah_pinjaman)}</td>
                        <td className="py-4 px-4 text-neutral-700">{item.tenor} mo</td>
                        <td className="py-4 px-4 font-semibold">{Number(item.dti_ratio).toFixed(1)}%</td>
                        <td className="py-4 px-4 font-bold">{item.skor_ai}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRiskColor(item.kategori_risiko)}`}>{item.kategori_risiko}</span>
                        </td>
                        <td className="py-4 px-8 text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRecommendationColor(item.status_rekomendasi)}`}>{item.status_rekomendasi}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
