"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

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

export default function Home() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [analyses, setAnalyses] = useState<LoanAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("analyst@pinjolscore.id");
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    usia: "",
    status_pekerjaan: "Tetap",
    pendapatan_bulanan: "",
    pengeluaran_bulanan: "",
    jumlah_pinjaman: "",
    tenor: "",
    skor_ai: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.email) setUserEmail(user.email);
    } catch(e) {}

    fetchAnalyses(token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const fetchAnalyses = async (token: string) => {
    try {
      const res = await fetch("http://api.test/api/analyses", {
          headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json"
          }
      });
      if (res.status === 401) {
          handleLogout();
          return;
      }
      const data = await res.json();
      setAnalyses(data);
    } catch (error) {
      console.error("Failed to fetch analyses", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const token = localStorage.getItem("auth_token");

    try {
      const res = await fetch("http://api.test/api/analyses", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          usia: Number(formData.usia),
          pendapatan_bulanan: Number(formData.pendapatan_bulanan),
          pengeluaran_bulanan: Number(formData.pengeluaran_bulanan) || 0,
          jumlah_pinjaman: Number(formData.jumlah_pinjaman),
          tenor: Number(formData.tenor),
          skor_ai: Number(formData.skor_ai),
        }),
      });

      const responseData = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          nama: "", usia: "", status_pekerjaan: "Tetap", pendapatan_bulanan: "", 
          pengeluaran_bulanan: "", jumlah_pinjaman: "", tenor: "", skor_ai: ""
        });
        fetchAnalyses(token as string); // Refresh table
      } else {
        if (res.status === 401) return handleLogout();
        alert("Gagal menyimpan: " + (responseData.message || "Unknown error"));
        console.error("Backend error:", responseData);
      }
    } catch (error) {
      console.error("Submission error", error);
      alert("Error jaringan atau server mati. Cek console untuk detailnya.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low Risk': return 'bg-emerald-100 text-emerald-700';
      case 'Medium Risk': return 'bg-yellow-100 text-yellow-700';
      case 'High Risk': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getChartColor = (risk: string) => {
    switch (risk) {
      case 'Low Risk': return '#10B981'; // Emerald 500
      case 'Medium Risk': return '#F59E0B'; // Amber 500
      case 'High Risk': return '#EF4444'; // Red 500
      default: return '#9CA3AF'; // Gray 400
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

  const chartData = analyses.slice(0, 15).reverse().map(item => ({
    name: item.nama.split(' ')[0],
    dti: Number(item.dti_ratio),
    risk: item.kategori_risiko
  }));

  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/" },
    { id: "evaluations", label: "Evaluations", href: "/evaluations" },
    { id: "customers", label: "Customers", href: "/customers" },
    { id: "settings", label: "Settings", href: "/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F6F7F5] text-neutral-900 font-sans selection:bg-[#c6f174]/50">
      
      {/* Sidebar */}
      <aside className="w-72 bg-white flex flex-col p-8 sticky top-0 h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 hidden md:flex">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#A6E14B] to-[#D5F79D] flex items-center justify-center text-neutral-900 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <span className="text-2xl font-bold tracking-tight">Pinjol<span className="text-[#8CC63F]">Score</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl font-medium transition-all duration-300 ${
                item.id === "dashboard"
                  ? "bg-neutral-900 text-white shadow-lg"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-neutral-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-neutral-200 overflow-hidden">
              <img src="https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=e5e5e5" alt="User avatar" />
            </div>
            <div className="text-left overflow-hidden">
              <p className="font-semibold text-sm truncate">Analyst Team</p>
              <p className="text-xs text-neutral-500 truncate">{userEmail}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">Loan Evaluations</h1>
              <p className="text-neutral-500">Review creditworthiness and Debt-to-Income ratios in real-time.</p>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3.5 bg-[#c6f174] hover:bg-[#bcf285] text-neutral-900 rounded-full font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Analysis
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-neutral-100">
              <div className="text-neutral-500 text-sm font-medium mb-1">Total Evaluations</div>
              <div className="text-3xl font-bold">{analyses.length}</div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-neutral-100">
              <div className="text-neutral-500 text-sm font-medium mb-1">High Risk Profiles</div>
              <div className="text-3xl font-bold text-red-500">
                {analyses.filter(a => a.kategori_risiko === 'High Risk').length}
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-neutral-100">
              <div className="text-neutral-500 text-sm font-medium mb-1">Average DTI</div>
              <div className="text-3xl font-bold">
                {analyses.length > 0 ? (analyses.reduce((acc, curr) => acc + Number(curr.dti_ratio), 0) / analyses.length).toFixed(1) : 0}%
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-neutral-100">
              <div className="text-neutral-500 text-sm font-medium mb-1">Highly Recommended</div>
              <div className="text-3xl font-bold text-emerald-500">
                 {analyses.filter(a => a.status_rekomendasi === 'Sangat Layak').length}
              </div>
            </div>
          </div>

          {/* DTI Chart Section */}
          <div className="bg-white p-8 rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-neutral-100 mb-10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">DTI Trend Analysis</h2>
                <p className="text-neutral-500 text-sm mt-1">Debt-to-Income ratio of the last 15 applicants</p>
              </div>
              <div className="flex gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>Low Risk</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>Medium Risk</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>High Risk</div>
              </div>
            </div>
            <div className="h-72 w-full">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">Loading chart data...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                    <Tooltip 
                      cursor={{ fill: '#F9FAFB' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value) => [`${Number(value).toFixed(1)}%`, 'DTI Ratio']}
                    />
                    <Bar dataKey="dti" radius={[6, 6, 0, 0]} maxBarSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getChartColor(entry.risk)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* History Table */}
          <div className="bg-white rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-neutral-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
              <h2 className="text-xl font-bold">Recent Evaluations</h2>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search applicants..." 
                  className="pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#c6f174] focus:border-transparent transition-all w-64"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-2.5 text-neutral-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-neutral-500">Loading data from Laravel API...</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-neutral-500 text-sm border-b border-neutral-100">
                      <th className="font-medium py-4 px-8">Applicant</th>
                      <th className="font-medium py-4 px-4">Income & Loan</th>
                      <th className="font-medium py-4 px-4">DTI Ratio</th>
                      <th className="font-medium py-4 px-4">AI Score</th>
                      <th className="font-medium py-4 px-8 text-right">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {analyses.map((item) => (
                      <tr key={item.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                        <td className="py-4 px-8">
                          <div className="font-semibold text-neutral-900">{item.nama}</div>
                          <div className="text-neutral-400 text-xs mt-0.5">{item.user_id}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-neutral-900">{formatCurrency(item.pendapatan_bulanan)}/mo</div>
                          <div className="text-neutral-500 text-xs mt-0.5">Req: {formatCurrency(item.jumlah_pinjaman)}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{Number(item.dti_ratio).toFixed(1)}%</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(item.kategori_risiko)}`}>
                              {item.kategori_risiko}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold">{item.skor_ai}</div>
                        </td>
                        <td className="py-4 px-8 text-right">
                           <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRecommendationColor(item.status_rekomendasi)}`}>
                              {item.status_rekomendasi}
                            </span>
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

      {/* New Analysis Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-neutral-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">New Loan Analysis</h2>
                <p className="text-neutral-500 text-sm mt-1">Enter applicant details to calculate DTI and Risk Category.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-500 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="px-8 py-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Personal Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-neutral-900 border-b pb-2">Personal Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                    <input required type="text" name="nama" value={formData.nama} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c6f174]" placeholder="e.g. Budi Santoso" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Age</label>
                      <input required type="number" name="usia" value={formData.usia} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c6f174]" placeholder="25" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Job Status</label>
                      <select name="status_pekerjaan" value={formData.status_pekerjaan} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c6f174]">
                        <option value="Tetap">Tetap</option>
                        <option value="Kontrak">Kontrak</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Tidak Bekerja">Tidak Bekerja</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Manual AI Score (300-850)</label>
                    <input required type="number" min="300" max="850" name="skor_ai" value={formData.skor_ai} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c6f174]" placeholder="e.g. 720" />
                  </div>
                </div>

                {/* Financial Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-neutral-900 border-b pb-2">Financial Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Monthly Income (Rp)</label>
                    <input required type="number" name="pendapatan_bulanan" value={formData.pendapatan_bulanan} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c6f174]" placeholder="10000000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Monthly Expenses (Rp)</label>
                    <input type="number" name="pengeluaran_bulanan" value={formData.pengeluaran_bulanan} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c6f174]" placeholder="4000000 (Optional)" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Loan Amount (Rp)</label>
                      <input required type="number" name="jumlah_pinjaman" value={formData.jumlah_pinjaman} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c6f174]" placeholder="50000000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">Tenor (Months)</label>
                      <input required type="number" name="tenor" value={formData.tenor} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c6f174]" placeholder="12" />
                    </div>
                  </div>
                </div>

              </div>

              <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-[#c6f174] hover:bg-[#bcf285] text-neutral-900 font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2">
                  {isSubmitting ? "Processing..." : "Calculate & Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

