// 완료 화면으로 넘기는 신청 1건의 id — sessionStorage 키 `uplus:lastSubscription`
// 이름 · 휴대폰 원본은 브라우저 저장소에 남기지 않는다. 완료 화면이 id로 /api/subscriptions를 불러 가린 값만 받는다.
import type { Subscription } from "./subscription";

export const LAST_SUBSCRIPTION_KEY = "uplus:lastSubscription";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

/** id만 저장. 쓰기 실패(저장 공간 · 개인정보 보호 모드 등)는 예외로 던진다 → 신청 화면의 저장 실패 상태 */
export function saveLastSubscription(sub: Pick<Subscription, "id">): void {
  window.sessionStorage.setItem(LAST_SUBSCRIPTION_KEY, sub.id);
}

/** 저장된 id (없거나 읽지 못하면 null) */
export function readLastSubscriptionId(): string | null {
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
