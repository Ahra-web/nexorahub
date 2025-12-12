// app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    // 세션 확인 및 저장
    if (data.session) {
      // 세션을 명시적으로 확인
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session) {
        // 세션이 제대로 설정되었는지 확인 후 페이지 이동
        setLoading(false);
        router.push("/");
        router.refresh(); // 페이지 새로고침으로 세션 반영
      } else {
        setLoading(false);
        setError("Session could not be established. Please try again.");
      }
    } else {
      setLoading(false);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-md bg-gray-900/80 rounded-2xl p-8 shadow-lg border border-white/10">
        <h1 className="text-2xl font-semibold text-blue-300 mb-6 text-center">Welcome Back</h1>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded border border-white/20 bg-black/60 text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded border border-white/20 bg-black/60 text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-blue-400"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-blue-500 hover:bg-blue-400 text-black font-medium transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex justify-between mt-4 text-xs text-blue-300">
          <Link href="/signup" className="hover:text-blue-200">Sign Up</Link>
          <Link href="/forgot" className="hover:text-blue-200">Forgot Password?</Link>
        </div>
      </div>

      <div className="mt-6 h-0.5 w-32 bg-linear-to-r from-blue-500 to-blue-300" />
    </div>
  );
}
