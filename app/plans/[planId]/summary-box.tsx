import { ListRow } from "@/components/ui/ListRow";
import { dataConditionText, formatData, formatSpeed } from "@/lib/plan-display";
import type { Plan } from "@/lib/plans";

/**
 * 상세 "데이터 조건" 흰 카드 (B6 — 화면 폴더 조합).
 * 흰 카드(bg/surface · radius/12 · p 20) 안: 제목 → List/Row 2줄 → 보조 박스(bg/default · radius/12) 안 유형별 안내 문장(PRD 4-2 원문).
 */
export function DataConditionBox({ plan }: { plan: Plan }) {
  return (
    <section aria-labelledby="data-condition-title" className="flex w-full flex-col gap-8 rounded-12 bg-bg-surface p-20">
      <h2 id="data-condition-title" className="text-body-strong text-text-primary">
        데이터 조건
      </h2>
      <div className="flex flex-col">
        <ListRow label="기본 데이터" value={formatData(plan)} />
        <ListRow label="소진 후 속도" value={formatSpeed(plan)} divider={false} />
      </div>
      <p className="rounded-12 bg-bg-default p-16 text-body-small-medium text-text-secondary">{dataConditionText(plan)}</p>
    </section>
  );
}
