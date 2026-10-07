"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { BottomCTA, BottomCTASpacer } from "@/components/ui/BottomCTA";
import { Button } from "@/components/ui/Button";
import { CautionNotice } from "@/components/ui/CautionNotice";
import { EmptyState } from "@/components/ui/EmptyState";
import { Header } from "@/components/ui/Header";
import { IconDoneMark } from "@/components/ui/IconDoneMark";
import { InlineError } from "@/components/ui/InlineError";
import { Skeleton } from "@/components/ui/Skeleton";
import { Toast } from "@/components/ui/Toast";
import { clearLastSubscription, parseLastSubscription, readLastSubscriptionRaw } from "@/lib/last-subscription";
import { formatDateTime, maskName, maskPhone } from "@/lib/mask";
import { findPlan } from "@/lib/plan-data";
import { PLAN_LIST_PATH, formatWon } from "@/lib/plan-display";
import { ReceiptBox } from "./receipt-box";

const HOME_LABEL = "처음으로";

// sessionStorage는 같은 탭에서 바뀌어도 알림이 없으므로 구독할 것이 없다.
// 서버 · 첫 렌더(hydration)는 undefined → 로딩 상태, 그 뒤 클라이언트에서 값을 읽는다.
const noopSubscribe = () => () => {};
const getServerSnapshot = (): string | null | undefined => undefined;

export function CompleteView() {
  const router = useRouter();
  const raw = useSyncExternalStore(noopSubscribe, readLastSubscriptionRaw, getServerSnapshot);
  const [toastOpen, setToastOpen] = useState(false);

  // 브라우저 뒤로 → 요금제 목록. 신청 화면은 replace로 빠져 있지만 그 앞(변경 전 확인)이 남아 있으므로
  // 진입 시 기록을 한 칸 쌓고, 그 칸을 벗어나는 뒤로 가기를 목록 이동으로 바꾼다. 다시 저장하지 않는다.
  useEffect(() => {
    const marker = "uplusCompleteGuard";
    const current = (window.history.state ?? {}) as Record<string, unknown>;
    if (!current[marker]) {
      window.history.pushState({ ...current, [marker]: true }, "", window.location.href);
    }
    function onPopState() {
      clearLastSubscription();
      router.replace(PLAN_LIST_PATH);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [router]);

  function goHome() {
    router.replace(PLAN_LIST_PATH);
    clearLastSubscription();
  }

  const homeCTA = (disabled = false) => (
    <>
      <BottomCTASpacer />
      <BottomCTA>
        <Button label={HOME_LABEL} state={disabled ? "Disabled" : "Default"} onClick={goHome} />
      </BottomCTA>
    </>
  );

  // 로딩: sessionStorage를 읽기 전
  if (raw === undefined) {
    return (
      <>
        <main className="flex flex-1 flex-col px-16 pt-40 pb-24">
          <Skeleton variant="completion" label="신청 정보를 불러오는 중" />
        </main>
        {homeCTA(true)}
      </>
    );
  }

  const parsed = parseLastSubscription(raw);

  if (parsed.status === "empty") {
    return (
      <>
        <main className="flex flex-1 flex-col px-16 pt-40 pb-24">
          <EmptyState message="확인할 신청 정보가 없어요." />
        </main>
        {homeCTA()}
      </>
    );
  }

  const sub = parsed.status === "ok" ? parsed.data : null;
  const plan = sub ? findPlan(sub.plan_id) : undefined;
  const createdAt = sub ? formatDateTime(sub.created_at) : null;

  if (!sub || !plan || !createdAt) {
    return (
      <>
        <main className="flex flex-1 flex-col px-16 pt-40 pb-24">
          <InlineError message="신청은 접수됐지만 내용을 표시하지 못했어요. 처음 화면으로 이동해 주세요." />
        </main>
        {homeCTA()}
      </>
    );
  }

  async function onCopy() {
    if (!sub) return;
    try {
      await navigator.clipboard.writeText(sub.application_no);
      setToastOpen(true);
    } catch {
      // 클립보드를 쓸 수 없는 환경: 번호는 화면에 그대로 보인다
    }
  }

  return (
    <>
      <div className="flex justify-center px-16 pt-40 pb-16">
        <IconDoneMark />
      </div>
      <Header type="root" title="요금제 변경 신청이 접수됐어요" />
      <main className="flex flex-1 flex-col gap-24 px-16 pt-16 pb-24">
        <ReceiptBox
          applicationNo={sub.application_no}
          planName={plan.name}
          monthly={formatWon(plan.promo_price)}
          maskedName={maskName(sub.name)}
          maskedPhone={maskPhone(sub.phone)}
          createdAt={createdAt}
          onCopy={() => void onCopy()}
        />

        <CautionNotice message="이 화면을 닫으면 신청 내용을 다시 조회할 수 없어요. 신청 번호를 복사해 두세요." />
      </main>
      <Toast open={toastOpen} message="신청 번호를 복사했어요." onClose={() => setToastOpen(false)} />
      {homeCTA()}
    </>
  );
}
