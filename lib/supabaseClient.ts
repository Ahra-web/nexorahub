// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,          // 세션 브라우저에 저장
    detectSessionInUrl: true,      // magic link 로그인 처리
    autoRefreshToken: true,        // 토큰 자동 갱신
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});
