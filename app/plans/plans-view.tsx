"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CardPlan } from "@/components/ui/CardPlan";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChip, FilterChipGroup } from "@/components/ui/FilterChip";
import { Header } from "@/components/ui/Header";
import { InlineError } from "@/components/ui/InlineError";
import { Skeleton } from "@/components/ui/Skeleton";
import { loadPlans } from "@/lib/plan-data";
import {
  PLAN_LIST_PATH,
  PLAN_TYPES,
  TYPE_LABEL,
  afterPromoCaption,
  formatData,
  formatSpeed,
  formatWon,
  parseTypeFilter,
  planDetailPath,
  withType,
} from "@/lib/plan-display";
import type { PlanType } from "@/lib/plans";

const CHIPS: { type: PlanType | null; label: string }[] = [
  { type: null, label: "전체" },
  ...PLAN_TYPES.map((t) => ({ type: t, label: TYPE_LABEL[t] })),
];

function ListHeader() {
  return <Header type="root" title="나에게 맞는 요금제 찾기" subtitle="무제한 유형과 매달 내는 돈을 비교해 보세요." />;
}

function Chips({ selected, onSelect, disabled }: { selected: PlanType | null; onSelect?: (t: PlanType | null) => void; disabled?: boolean }) {
  return (
    <FilterChipGroup label="요금제 유형">
      {CHIPS.map((c) => (
        <FilterChip
          key={c.label}
          label={c.label}
          state={c.type === selected ? "selected" : "default"}
          disabled={disabled}
          onClick={onSelect ? () => onSelect(c.type) : undefined}
        />
      ))}
    </FilterChipGroup>
  );
}

/** 로딩: FilterChip 조작 막기 + Plan Card Skeleton 4개 */
export function PlansLoading() {
  return (
    <>
      <ListHeader />
      <main className="flex flex-1 flex-col gap-16 px-16 pt-8 pb-32">
        <Chips selected={null} disabled />
        <Skeleton variant="planCard" count={4} label="요금제를 불러오는 중" />
      </main>
    </>
  );
}

export function PlansView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = parseTypeFilter(searchParams.get("type"));
  // 다시 불러오기: 값을 바꿔 다시 그리면서 읽기를 다시 시도한다
  const [, setAttempt] = useState(0);
  const result = loadPlans(selected);

  function onSelect(type: PlanType | null) {
    // 기록 교체 · 스크롤 유지 — 뒤로 가기가 칩 선택을 하나씩 되감지 않게
    router.replace(withType(PLAN_LIST_PATH, type), { scroll: false });
  }

  return (
    <>
      <ListHeader />
      <main className="flex flex-1 flex-col gap-16 px-16 pt-8 pb-32">
        <Chips selected={selected} onSelect={onSelect} />

        {result.status === "error" && (
          <InlineError
            message="요금제를 불러오지 못했어요. 잠시 후 다시 시도해 주세요."
            action={<Button type="Secondary" size="lg" label="다시 불러오기" onClick={() => setAttempt((n) => n + 1)} />}
          />
        )}

        {result.status === "empty" && <EmptyState message="이 유형의 요금제가 없어요." />}

        {result.status === "ok" && (
          <ul className="flex flex-col gap-16" aria-label="요금제 목록">
            {result.data.map((plan) => (
              <li key={plan.id}>
                <CardPlan
                  href={withType(planDetailPath(plan.id), selected)}
                  name={plan.name}
                  typeLabel={TYPE_LABEL[plan.type]}
                  badge={plan.is_recommended}
                  specs={[
                    { label: "기본 데이터", value: formatData(plan) },
                    { label: "소진 후 속도", value: formatSpeed(plan) },
                  ]}
                  price={formatWon(plan.promo_price)}
                  priceCaption={afterPromoCaption(plan)}
                  desc={plan.description}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
