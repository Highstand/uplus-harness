// Supabase 클라이언트 — 공개 키(publishable key)만 쓴다. 서버 전용 키는 쓰지 않는다.
// 모듈을 불러올 때 env를 읽지 않고 호출할 때 만든다 → 키 없이도 `npm run build`가 통과한다.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** env가 없으면 호출 시점에 예외 → 신청 화면은 저장 실패 상태, API는 500 */
export function getSupabase(): SupabaseClient {
  if (client) return client;
  // NEXT_PUBLIC_ 값은 빌드 때 번들에 그대로 들어가므로 정적 이름으로 읽는다
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("supabase env missing");
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}

export const SUBSCRIPTIONS_TABLE = "subscriptions";
