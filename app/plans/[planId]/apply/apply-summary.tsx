import { ListRow } from "@/components/ui/ListRow";
import { formatWon } from "@/lib/plan-display";
import type { Plan } from "@/lib/plans";

/** 변경 신청 요약 흰 카드 (A9 — 화면 폴더 조합). bg/surface · radius/12 · p 20 안에 List/Row 2줄 */
export function ApplySummary({ plan }: { plan: Plan }) {
  return (
    <section aria-label="선택한 요금제 요약" className="flex w-full flex-col rounded-12 bg-bg-surface px-20 py-8">
      <ListRow label="선택한 요금제" value={plan.name} />
      <ListRow label="매달 내는 돈" value={formatWon(plan.promo_price)} divider={false} />
    </section>
  );
}
