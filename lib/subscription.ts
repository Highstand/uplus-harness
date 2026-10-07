// 구독 신청 저장 — Supabase `subscriptions` 테이블에 insert (M6).
// id · application_no · status · created_at은 DB가 만든다. 앱은 돌려받은 행을 쓴다.
import { isValidName, isValidPhone, phoneDigits } from "./apply-form";
import { PLANS } from "./plans";
import { SUBSCRIPTIONS_TABLE, getSupabase } from "./supabase";

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

/** GET /api/subscriptions?id= 응답 — 가린 값만 담는다 (원본 name · phone 없음) */
export type SubscriptionView = {
  id: string;
  application_no: string;
  plan_name: string;
  /** 매달 내는 돈 (원) */
  promo_price: number;
  /** 이름 가운데 가림 (예: 김*플) */
  name_masked: string;
  /** 휴대폰 가운데 4자리 가림 (예: 010-****-1234) */
  phone_masked: string;
  status: SubscriptionStatus;
  /** ISO 8601 — 화면 표시 형식(YYYY.MM.DD HH:mm)은 클라이언트가 사용자 기기 시간대로 만든다 */
  created_at: string;
};

export type SubscriptionInput = {
  name: string;
  /** 하이픈이 있어도 된다 — 숫자만 저장 */
  phone: string;
  plan_id: string;
  privacy_agreed: boolean;
};

/** 신청 번호가 우연히 겹칠 때(unique 위반) 다시 시도하는 최대 횟수 */
const MAX_ATTEMPTS = 3;
const UNIQUE_VIOLATION = "23505";

type InsertedRow = Pick<Subscription, "id" | "application_no" | "status" | "created_at">;

/**
 * 신청 1건 저장 (status = received). 입력이 규칙에 맞지 않거나 저장에 실패하면 예외를 던진다.
 */
export async function submitSubscription(input: SubscriptionInput): Promise<Subscription> {
  const name = input.name.trim();
  if (!isValidName(name)) throw new Error("invalid name");
  if (!isValidPhone(input.phone)) throw new Error("invalid phone");
  if (input.privacy_agreed !== true) throw new Error("privacy not agreed");
  if (!PLANS.some((p) => p.id === input.plan_id)) throw new Error("unknown plan");

  const phone = phoneDigits(input.phone);
  const supabase = getSupabase();

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const { data, error } = await supabase
      .from(SUBSCRIPTIONS_TABLE)
      .insert({ name, phone, plan_id: input.plan_id, privacy_agreed: true })
      .select("id, application_no, status, created_at")
      .single<InsertedRow>();

    if (error) {
      if (error.code === UNIQUE_VIOLATION && attempt < MAX_ATTEMPTS) continue;
      throw new Error("subscription insert failed");
    }

    return {
      id: data.id,
      application_no: data.application_no,
      name,
      phone,
      plan_id: input.plan_id,
      privacy_agreed: true,
      status: data.status,
      created_at: data.created_at,
    };
  }
  throw new Error("subscription insert failed");
}
