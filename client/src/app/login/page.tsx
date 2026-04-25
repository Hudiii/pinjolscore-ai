"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("admin@pinjolscore.id");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://api.test/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token (in a real app, use HTTP-only cookies or a more secure storage)
        localStorage.setItem("auth_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      } else {
        setError(data.message || "Email atau password salah.");
      }
    } catch (err) {
      setError("Gagal terhubung ke server. Pastikan API berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F7F5] font-sans">
      <div className="bg-white p-10 rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-neutral-100 w-full max-w-md">
        
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#A6E14B] to-[#D5F79D] flex items-center justify-center text-neutral-900 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <span className="text-3xl font-bold tracking-tight">Pinjol<span className="text-[#8CC63F]">Score</span></span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-neutral-500 text-sm">Please sign in to access the Analyst Dashboard.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#c6f174]" 
              placeholder="analyst@pinjolscore.id"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#c6f174]" 
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-neutral-600 cursor-pointer">
              <input type="checkbox" className="rounded text-[#8CC63F] focus:ring-[#c6f174] w-4 h-4 border-neutral-300" />
              Remember me
            </label>
            <a href="#" className="text-[#8CC63F] hover:underline font-medium">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 mt-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl transition-all shadow-md disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-neutral-500">
          <p>Don't have an account? Contact IT Administrator.</p>
        </div>
      </div>
    </div>
  );
}
