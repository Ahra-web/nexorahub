"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 먼저 세션 확인
        const { data: sessionData } = await supabase.auth.getSession();
        
        // 세션이 있을 때만 사용자 정보 가져오기
        if (sessionData.session) {
          const { data, error } = await supabase.auth.getUser();
          if (error) {
            // 403 에러 등은 무시 (세션이 만료되었거나 유효하지 않은 경우)
            console.warn("Failed to fetch user:", error.message);
            setUser(null);
            return;
          }
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        // 에러 발생 시 사용자 상태를 null로 설정
        console.warn("Error fetching user:", error);
        setUser(null);
      }
    };
    
    fetchUser();

    // ✅ 로그인 상태 실시간 반영
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        fetchUser();
      } else {
        setUser(null);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

    const handleLogout = async () => {
        setUser(null); // ✅ UI 즉시 업데이트
        await supabase.auth.signOut();
        router.push("/login"); // ✅ 로그인 화면으로 이동
        router.refresh(); // ✅ UI 강제 새로고침
    };

  const username = user?.user_metadata?.username || user?.email?.split("@")[0];

  return (
    <header className="w-full z-50 bg-black text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">

          {/* Brand */}
          <Link href="/" className="text-lg font-semibold tracking-tight text-blue-300">
            NexoraHub
          </Link>

          {/* Desktop Nav */}
          <nav className="flex items-center gap-4">
            <Link href="/new" className="text-sm hover:text-blue-200">new</Link>
            <Link href="/past" className="text-sm hover:text-blue-200">past</Link>
            <Link href="/comments" className="text-sm hover:text-blue-200">comments</Link>
            <Link href="/ask" className="text-sm hover:text-blue-200">ask</Link>
          </nav>

          {/* ✅ Auth UI - 너비 고정으로 밀림 해결 */}
          <div className="flex items-center justify-end gap-3 min-w-[160px]">
            {!user ? (
              <>
                <Link href="/login" className="text-xs hover:text-blue-200">
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="text-xs px-3 py-1 rounded bg-blue-500 hover:bg-blue-400 text-black font-medium"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {/* ✅ 고정 폭 + 말줄임 */}
                <span
                  className="text-xs text-blue-300 max-w-[90px] truncate text-right"
                  title={username}
                >
                  {username}
                </span>

                <button
                  onClick={handleLogout}
                  className="text-xs hover:text-red-400 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Accent Bar */}
      <div className="h-0.5 bg-gradient-to-r from-blue-500 to-blue-300" />
    </header>
  );
}
