"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { BottomCTA, BottomCTASpacer } from "@/components/ui/BottomCTA";
import { Button } from "@/components/ui/Button";
import { CardPlan } from "@/components/ui/CardPlan";
import { CardPrice } from "@/components/ui/CardPrice";
import { EmptyState } from "@/components/ui/EmptyState";
import { Header } from "@/components/ui/Header";
import { InlineError } from "@/components/ui/InlineError";
import { Skeleton } from "@/components/ui/Skeleton";
import { loadPlan } from "@/lib/plan-data";
import {
  PLAN_LIST_PATH,
  TYPE_LABEL,
  afterPromoCaption,
  formatWon,
  monthlyDiscount,
  parseTypeFilter,
  planConfirmPath,
  promoPeriodText,
  withType,
} from "@/lib/plan-display";
import { DataConditionBox } from "./summary-box";

const CTA_LABEL = "이 요금제로 변경하기";
const AMOUNT_LABEL = "매달 내는 돈";

/** 로딩: Detail Skeleton + 변경 Button Disabled */
export function DetailLoading() {
  return (
    <>
      <Header type="default" backHref={PLAN_LIST_PATH} />
      <main className="flex flex-1 flex-col px-16 pt-16 pb-24">
        <Skeleton variant="detail" label="요금제 정보를 불러오는 중" />
      </main>
      <BottomCTASpacer layout="price" />
      {/* 금액 자리는 비워 둔다 */}
      <BottomCTA layout="price" amountLabel={AMOUNT_LABEL}>
        <Button label={CTA_LABEL} state="Disabled" />
      </BottomCTA>
    </>
  );
}

export function DetailView() {
  const params = useParams<{ planId: string }>();
  const searchParams = useSearchParams();
  const type = parseTypeFilter(searchParams.get("type"));
  const [, setAttempt] = useState(0);
  const result = loadPlan(params.planId);
  const listHref = withType(PLAN_LIST_PATH, type);

  if (result.status === "empty") {
    return (
      <>
        <Header type="default" backHref={listHref} />
        <main className="flex flex-1 flex-col px-16 pt-24 pb-32">
          <EmptyState
            message="요금제를 찾을 수 없어요."
            action={<Button type="Secondary" size="lg" label="처음으로" href={PLAN_LIST_PATH} replace />}
          />
        </main>
      </>
    );
  }

  if (result.status === "error") {
    return (
      <>
        <Header type="default" backHref={listHref} />
        <main className="flex flex-1 flex-col px-16 pt-24 pb-24">
          <InlineError
            message="요금제 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요."
            action={<Button type="Secondary" size="lg" label="다시 불러오기" onClick={() => setAttempt((n) => n + 1)} />}
          />
        </main>
        <BottomCTASpacer layout="price" />
        <BottomCTA layout="price" amountLabel={AMOUNT_LABEL}>
          <Button label={CTA_LABEL} state="Disabled" />
        </BottomCTA>
      </>
    );
  }

  const plan = result.data;

  return (
    <>
      {/* 뒤로 → 요금제 목록, 받은 ?type= 그대로 (필터 유지, 기록 교체) */}
      <Header type="default" title={plan.name} backHref={listHref} />
      <main className="flex flex-1 flex-col gap-24 px-16 pt-16 pb-24">
        <CardPlan
          name={plan.name}
          typeLabel={TYPE_LABEL[plan.type]}
          badge={plan.is_recommended}
          promoText={promoPeriodText(plan)}
          price={formatWon(plan.promo_price)}
          priceCaption={afterPromoCaption(plan)}
        />

        <CardPrice
          title="요금 구성"
          regular={formatWon(plan.regular_price)}
          discount={formatWon(monthlyDiscount(plan))}
          monthly={formatWon(plan.promo_price)}
        />

        <DataConditionBox plan={plan} />
      </main>
      <BottomCTASpacer layout="price" />
      <BottomCTA layout="price" amountLabel={AMOUNT_LABEL} amount={`월 ${formatWon(plan.promo_price)}`}>
        <Button label={CTA_LABEL} href={withType(planConfirmPath(plan.id), type)} />
      </BottomCTA>
    </>
  );
}
