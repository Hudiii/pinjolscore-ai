"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Settings() {
  const router = useRouter();
  const [userName, setUserName] = useState("Analyst Admin");
  const [userEmail, setUserEmail] = useState("admin@pinjolscore.id");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) { router.push("/login"); return; }
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.name) setUserName(user.name);
      if (user.email) setUserEmail(user.email);
    } catch (e) {}
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
            <Link key={item.id} href={item.href} className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl font-medium transition-all duration-300 ${item.id === "settings" ? "bg-neutral-900 text-white shadow-lg" : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-8 border-t border-neutral-100">
          <button onClick={() => { localStorage.removeItem("auth_token"); router.push("/login"); }} className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">Sign Out</button>
        </div>
      </aside>

      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Settings</h1>
            <p className="text-neutral-500">Manage your account profile and application preferences.</p>
          </div>

          {saved && (
            <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-5 py-3.5 rounded-2xl text-sm font-medium mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Settings saved successfully!
            </div>
          )}

          {/* Profile Section */}
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-8 mb-6">
            <h2 className="font-bold text-lg mb-6">Profile Information</h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-20 h-20 rounded-full bg-neutral-100 overflow-hidden">
                  <img src="https://api.dicebear.com/9.x/notionists/svg?seed=Felix&backgroundColor=e5e5e5" alt="Avatar" />
                </div>
                <div>
                  <p className="font-semibold">{userName}</p>
                  <p className="text-sm text-neutral-500">{userEmail}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full Name</label>
                <input type="text" value={userName} onChange={e => setUserName(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#c6f174]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email Address</label>
                <input type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#c6f174]" />
              </div>
              <button type="submit" className="px-8 py-3 bg-[#c6f174] hover:bg-[#bcf285] text-neutral-900 font-semibold rounded-xl transition-colors">
                Save Changes
              </button>
            </form>
          </div>

          {/* App Info */}
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-8 mb-6">
            <h2 className="font-bold text-lg mb-6">Application Info</h2>
            <div className="space-y-4 text-sm">
              {[
                { label: "App Name", value: "PinjolScore-AI" },
                { label: "Version", value: "1.0.0 MVP" },
                { label: "Backend", value: "Laravel 11 (SQLite)" },
                { label: "Frontend", value: "Next.js 15 (App Router)" },
                { label: "API URL", value: "http://api.test" },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-3 border-b border-neutral-50 last:border-0">
                  <span className="text-neutral-500">{item.label}</span>
                  <span className="font-medium text-neutral-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-3xl border border-red-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-8">
            <h2 className="font-bold text-lg text-red-600 mb-2">Danger Zone</h2>
            <p className="text-sm text-neutral-500 mb-6">Irreversible actions that affect all data in this application.</p>
            <button onClick={() => { localStorage.removeItem("auth_token"); router.push("/login"); }}
              className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl text-sm transition-colors">
              Log Out of All Devices
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
