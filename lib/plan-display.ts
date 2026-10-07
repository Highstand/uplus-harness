// 요금제 표시 형식 · 필터 쿼리 (확정 8 · 확정 14)
import type { Plan, PlanType } from "./plans";

export const PLAN_TYPES: PlanType[] = ["basic", "limited_unlimited", "full_unlimited"];

/** 유형 라벨 (PRD 4-1) */
export const TYPE_LABEL: Record<PlanType, string> = {
  basic: "기본형",
  limited_unlimited: "무제한 · 속도 제한 있음",
  full_unlimited: "완전 무제한",
};

/** 32000 → "32,000원" (로케일과 무관하게 같은 결과) */
export function formatWon(value: number): string {
  return `${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원`;
}

/** 기본 데이터: "7GB" / "제한 없음" */
export function formatData(plan: Plan): string {
  return plan.data_gb === null ? "제한 없음" : `${plan.data_gb}GB`;
}

/** 소진 후 속도: "400kbps" / "제한 없음" */
export function formatSpeed(plan: Plan): string {
  return plan.speed_after ?? "제한 없음";
}

/** 24개월 할인 금액 = 정가 − 매달 내는 돈 */
export function monthlyDiscount(plan: Plan): number {
  return plan.regular_price - plan.promo_price;
}

/** "24개월 후 월 39,000원" */
export function afterPromoCaption(plan: Plan): string {
  return `${plan.promo_months}개월 후 월 ${formatWon(plan.regular_price)}`;
}

/** "가입 후 24개월 동안" */
export function promoPeriodText(plan: Plan): string {
  return `가입 후 ${plan.promo_months}개월 동안`;
}

/** 상세 화면 데이터 조건 문구 (PRD 4-2 원문) */
export function dataConditionText(plan: Plan): string {
  const data = formatData(plan);
  const speed = formatSpeed(plan);
  switch (plan.type) {
    case "basic":
      return `기본 데이터 ${data}를 다 쓰면 이번 달 남은 기간 동안 최대 ${speed}로 느려져요.`;
    case "limited_unlimited":
      return `이름에 '무제한'이 있지만 기본 데이터 ${data}를 다 쓰면 이번 달 남은 기간 동안 최대 ${speed}로 느려져요.`;
    case "full_unlimited":
      return "기본 데이터 한도와 속도 제한이 없어요.";
  }
}

/** ?type= 값 읽기. 목록 밖 값 · 없음 → null(= 전체) */
export function parseTypeFilter(value: string | null | undefined): PlanType | null {
  return PLAN_TYPES.find((t) => t === value) ?? null;
}

/** 필터를 유지한 채 다음 화면 경로 만들기: withType("/plans/p03", "basic") → "/plans/p03?type=basic" */
export function withType(path: string, type: PlanType | null): string {
  return type ? `${path}?type=${type}` : path;
}

export const PLAN_LIST_PATH = "/plans";
export const planDetailPath = (id: string) => `/plans/${encodeURIComponent(id)}`;
export const planConfirmPath = (id: string) => `/plans/${encodeURIComponent(id)}/confirm`;
export const planApplyPath = (id: string) => `/plans/${encodeURIComponent(id)}/apply`;
export const COMPLETE_PATH = "/subscriptions/complete";
