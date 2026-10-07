// 요금제 읽기 — 고정 데이터라 실패하지 않지만, 화면이 기본 · 빈 · 에러 상태를 한 형태로 다루도록 결과를 감싼다.
import { PLANS, type Plan, type PlanType } from "./plans";

export type LoadResult<T> = { status: "ok"; data: T } | { status: "empty" } | { status: "error" };

/** 매달 내는 돈 낮은 순 (p01 → p02 → p03 → p04). type이 있으면 해당 유형만, 순서 유지 */
export function loadPlans(type: PlanType | null): LoadResult<Plan[]> {
  try {
    const sorted = [...PLANS].sort((a, b) => a.promo_price - b.promo_price);
    const list = type ? sorted.filter((p) => p.type === type) : sorted;
    return list.length > 0 ? { status: "ok", data: list } : { status: "empty" };
  } catch {
    return { status: "error" };
  }
}

/** planId로 1개 찾기. 없으면 empty */
export function loadPlan(planId: string | undefined): LoadResult<Plan> {
  try {
    const plan = planId ? PLANS.find((p) => p.id === planId) : undefined;
    return plan ? { status: "ok", data: plan } : { status: "empty" };
  } catch {
    return { status: "error" };
  }
}

export function findPlan(planId: string): Plan | undefined {
  return PLANS.find((p) => p.id === planId);
}
