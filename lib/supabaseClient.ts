// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.error("Missing Supabase environment variables");
  }
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,          // 세션 브라우저에 저장
    detectSessionInUrl: true,      // magic link 로그인 처리
    autoRefreshToken: true,        // 토큰 자동 갱신
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    flowType: 'pkce',              // PKCE 플로우 사용 (보안 강화)
  },
  global: {
    headers: {
      'x-client-info': 'nexorahub',
    },
  },
});
