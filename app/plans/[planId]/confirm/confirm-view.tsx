"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Header } from "@/components/ui/Header";
import { InlineError } from "@/components/ui/InlineError";
import { ListRow } from "@/components/ui/ListRow";
import { Skeleton } from "@/components/ui/Skeleton";
import { loadPlan } from "@/lib/plan-data";
import { PLAN_LIST_PATH, parseTypeFilter, planApplyPath, planDetailPath, withType } from "@/lib/plan-display";
import { ConfirmActions, ConfirmActionsSpacer } from "./confirm-actions";
import { ConfirmSummary } from "./confirm-summary";

const TITLE = "변경 전 확인";
const PRIMARY_LABEL = "신청하기";
const SECONDARY_LABEL = "다른 요금제 보기";

// PRD 4-3 초안 문구 그대로 (확정 3). 숫자 금액을 넣지 않는다 (PRD 5).
const NOTICES = [
  {
    label: "이번 달 요금",
    text: "이번 달 요금은 변경이 처리되는 날짜에 따라 달라질 수 있어요. 정확한 금액은 다음 달 청구서에서 확인할 수 있어요.",
  },
  {
    label: "위약금",
    text: "약정 기간 중에 요금제를 바꾸면 위약금이 생길 수 있어요. 약정이 끝났다면 위약금 없이 바꿀 수 있어요.",
  },
  {
    label: "유심 교체",
    text: "요금제만 바꾸는 경우 지금 쓰는 유심을 그대로 쓸 수 있어요.",
  },
];

function DisabledCTA() {
  return (
    <>
      <ConfirmActionsSpacer />
      <ConfirmActions>
        <Button label={PRIMARY_LABEL} state="Disabled" />
        <Button type="Secondary" label={SECONDARY_LABEL} state="Disabled" />
      </ConfirmActions>
    </>
  );
}

/** 로딩: Confirm Skeleton + 하단 두 Button Disabled */
export function ConfirmLoading() {
  return (
    <>
      <Header type="default" title={TITLE} backHref={PLAN_LIST_PATH} />
      <main className="flex flex-1 flex-col px-16 pt-16 pb-24">
        <Skeleton variant="confirm" label="변경 전 안내를 불러오는 중" />
      </main>
      <DisabledCTA />
    </>
  );
}

export function ConfirmView() {
  const params = useParams<{ planId: string }>();
  const searchParams = useSearchParams();
  const type = parseTypeFilter(searchParams.get("type"));
  const [, setAttempt] = useState(0);
  const result = loadPlan(params.planId);
  const detailHref = withType(planDetailPath(params.planId ?? ""), type);

  if (result.status === "empty") {
    return (
      <>
        <Header type="default" title={TITLE} backHref={withType(PLAN_LIST_PATH, type)} />
        <main className="flex flex-1 flex-col px-16 pt-24 pb-32">
          <EmptyState
            message="선택한 요금제 정보가 없어요."
            action={<Button type="Secondary" size="lg" label="처음으로" href={PLAN_LIST_PATH} replace />}
          />
        </main>
      </>
    );
  }

  if (result.status === "error") {
    return (
      <>
        <Header type="default" title={TITLE} backHref={detailHref} />
        <main className="flex flex-1 flex-col px-16 pt-24 pb-24">
          <InlineError
            message="변경 전 안내를 불러오지 못했어요. 잠시 후 다시 시도해 주세요."
            action={<Button type="Secondary" size="lg" label="다시 불러오기" onClick={() => setAttempt((n) => n + 1)} />}
          />
        </main>
        <DisabledCTA />
      </>
    );
  }

  const plan = result.data;

  return (
    <>
      {/* 뒤로 → 요금제 상세 (?type= 유지, 기록 교체) */}
      <Header type="default" title={TITLE} backHref={detailHref} />
      <main className="flex flex-1 flex-col gap-24 px-16 pt-16 pb-24">
        <ConfirmSummary plan={plan} />

        {/* 변경 전 안내 (B7) — 제목은 카드 밖, 안내 3항목은 흰 카드(bg/surface · radius/12) 안 */}
        <section aria-labelledby="confirm-notice-title" className="flex flex-col gap-12">
          <h2 id="confirm-notice-title" className="text-body-strong text-text-primary">
            변경 전 안내
          </h2>
          <div className="flex flex-col rounded-12 bg-bg-surface px-20 py-4">
            {NOTICES.map((n, i) => (
              <ListRow key={n.label} type="desc" label={n.label} value={n.text} divider={i < NOTICES.length - 1} />
            ))}
          </div>
        </section>
      </main>
      <ConfirmActionsSpacer />
      <ConfirmActions>
        <Button label={PRIMARY_LABEL} href={withType(planApplyPath(plan.id), type)} />
        <Button type="Secondary" label={SECONDARY_LABEL} href={withType(PLAN_LIST_PATH, type)} />
      </ConfirmActions>
    </>
  );
}
