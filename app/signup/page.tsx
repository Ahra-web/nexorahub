// app/signup/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1️⃣ URL hash에 붙은 access_token 처리 (magic link 등)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.replace("#", "?"));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        // 주소창에서 hash 제거
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // 2️⃣ 회원가입
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: window.location.origin,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // 3️⃣ 자동 로그인 (이메일 확인 필요 없는 경우)
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      // 이메일 확인 필요 모드라면 안내
      alert("Sign up successful! Please check your email to confirm login.");
      return;
    }

    // 4️⃣ 로그인 성공 → 홈 페이지 이동
    alert("Sign up and login successful!");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-md bg-gray-900/80 rounded-2xl p-8 shadow-lg border border-white/10">
        <h1 className="text-2xl font-semibold text-blue-300 mb-6 text-center">Create Account</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded border border-white/20 bg-black/60 text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-blue-400"
            required
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 rounded border border-white/20 bg-black/60 text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-blue-400"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-blue-500 hover:bg-blue-400 text-black font-medium transition-colors"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="flex justify-between mt-4 text-xs text-blue-300">
          <Link href="/login" className="hover:text-blue-200">Already have an account? Login</Link>
        </div>
      </div>

      <div className="mt-6 h-0.5 w-32 bg-linear-to-r from-blue-500 to-blue-300" />
    </div>
  );
}
