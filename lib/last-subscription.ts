// 완료 화면으로 넘기는 신청 1건 — sessionStorage 키 `uplus:lastSubscription` (JSON)
import { isValidName } from "./apply-form";
import { formatDateTime } from "./mask";
import { PLANS } from "./plans";
import type { Subscription } from "./subscription";

export const LAST_SUBSCRIPTION_KEY = "uplus:lastSubscription";

/** 쓰기 실패(저장 공간 · 개인정보 보호 모드 등)는 예외로 던진다 → 신청 화면의 저장 실패 상태 */
export function saveLastSubscription(sub: Subscription): void {
  window.sessionStorage.setItem(LAST_SUBSCRIPTION_KEY, JSON.stringify(sub));
}

export function readLastSubscriptionRaw(): string | null {
  try {
    return window.sessionStorage.getItem(LAST_SUBSCRIPTION_KEY);
  } catch {
    return null;
  }
}

export function clearLastSubscription(): void {
  try {
    window.sessionStorage.removeItem(LAST_SUBSCRIPTION_KEY);
  } catch {
    // 지우지 못해도 화면 이동은 계속한다
  }
}

export type ParsedLastSubscription = { status: "empty" } | { status: "error" } | { status: "ok"; data: Subscription };

/** 값 없음 → empty / JSON 파싱 실패 · 필드 누락 · 알 수 없는 plan_id → error */
export function parseLastSubscription(raw: string | null): ParsedLastSubscription {
  if (raw === null || raw === "") return { status: "empty" };
  let v: unknown;
  try {
    v = JSON.parse(raw);
  } catch {
    return { status: "error" };
  }
  if (typeof v !== "object" || v === null) return { status: "error" };
  const s = v as Record<string, unknown>;
  const ok =
    typeof s.id === "string" &&
    typeof s.application_no === "string" &&
    /^SUB-\d{6}$/.test(s.application_no) &&
    typeof s.name === "string" &&
    isValidName(s.name) &&
    typeof s.phone === "string" &&
    /^010\d{8}$/.test(s.phone) &&
    typeof s.plan_id === "string" &&
    PLANS.some((p) => p.id === s.plan_id) &&
    s.privacy_agreed === true &&
    s.status === "received" &&
    typeof s.created_at === "string" &&
    formatDateTime(s.created_at) !== null;
  return ok ? { status: "ok", data: s as unknown as Subscription } : { status: "error" };
}
