// 구독 신청 저장 — 이번 범위에서는 저장소 없이 앱 안에서 신청 1건을 만들어 돌려준다.
// 나중에 이 파일의 submitSubscription()만 Supabase insert로 바꾼다 (화면 코드는 그대로).
import { isValidName, isValidPhone, phoneDigits } from "./apply-form";
import { PLANS } from "./plans";

export type SubscriptionStatus = "received" | "processing" | "completed" | "canceled";

/** PRD 5장 Subscription */
export type Subscription = {
  id: string;
  /** SUB-000000 형식 */
  application_no: string;
  name: string;
  /** 숫자 11자리, 하이픈 없음 */
  phone: string;
  plan_id: string;
  privacy_agreed: true;
  status: SubscriptionStatus;
  /** ISO 8601 */
  created_at: string;
};

export type SubscriptionInput = {
  name: string;
  /** 하이픈이 있어도 된다 — 숫자만 저장 */
  phone: string;
  plan_id: string;
  privacy_agreed: boolean;
};

function randomInt(max: number): number {
  const c = globalThis.crypto;
  if (c?.getRandomValues) {
    const buf = new Uint32Array(1);
    c.getRandomValues(buf);
    return buf[0] % max;
  }
  return Math.floor(Math.random() * max);
}

/** SUB- + 무작위 6자리 숫자 (확정 12: 중복 검사 없음) */
export function createApplicationNo(): string {
  return `SUB-${String(randomInt(1_000_000)).padStart(6, "0")}`;
}

function createId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  const hex = (n: number) => Array.from({ length: n }, () => randomInt(16).toString(16)).join("");
  return `${hex(8)}-${hex(4)}-4${hex(3)}-${(8 + randomInt(4)).toString(16)}${hex(3)}-${hex(12)}`;
}

/**
 * 신청 1건 생성 (status = received). 입력이 규칙에 맞지 않으면 예외를 던진다(저장 불가).
 */
export async function submitSubscription(input: SubscriptionInput): Promise<Subscription> {
  const name = input.name.trim();
  if (!isValidName(name)) throw new Error("invalid name");
  if (!isValidPhone(input.phone)) throw new Error("invalid phone");
  if (input.privacy_agreed !== true) throw new Error("privacy not agreed");
  if (!PLANS.some((p) => p.id === input.plan_id)) throw new Error("unknown plan");

  return {
    id: createId(),
    application_no: createApplicationNo(),
    name,
    phone: phoneDigits(input.phone),
    plan_id: input.plan_id,
    privacy_agreed: true,
    status: "received",
    created_at: new Date().toISOString(),
  };
}
