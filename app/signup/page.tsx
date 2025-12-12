// app/signup/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // 1️⃣ 회원가입
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { username },
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // 2️⃣ 이메일 확인이 필요한 경우 처리
    if (signUpData.user && !signUpData.session) {
      // 이메일 확인이 필요한 경우
      setError("Please check your email to confirm your account before logging in.");
      setLoading(false);
      return;
    }

    // 3️⃣ 세션이 있는 경우 (이메일 확인이 필요 없는 경우) 바로 로그인
    if (signUpData.session) {
      // 세션이 이미 있으면 성공적으로 로그인된 상태
      setLoading(false);
      window.location.href = "/";
      return;
    }

    // 4️⃣ 세션이 없는 경우 로그인 시도
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message || "Please check your email to confirm your account.");
      return;
    }

    // 5️⃣ 로그인 성공 → 세션 확인 후 홈 이동
    if (signInData.session) {
      // 세션을 명시적으로 확인하고 페이지 이동
      await supabase.auth.getSession();
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <div className="w-full max-w-md bg-gray-900/80 rounded-2xl p-8 shadow-lg border border-white/10">
        <h1 className="text-2xl font-semibold text-blue-300 mb-6 text-center">Create Account</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSignUp}>
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? "Signing Up..." : "Sign Up"}</button>
        </form>
        <div className="flex justify-between mt-4 text-xs text-blue-300">
          <Link href="/login">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}
