"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { BottomCTA, BottomCTASpacer } from "@/components/ui/BottomCTA";
import { Button } from "@/components/ui/Button";
import { CautionNotice } from "@/components/ui/CautionNotice";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconDoneMark } from "@/components/ui/IconDoneMark";
import { InlineError } from "@/components/ui/InlineError";
import { Skeleton } from "@/components/ui/Skeleton";
import { Toast } from "@/components/ui/Toast";
import { clearLastSubscription, isUuid, readLastSubscriptionId } from "@/lib/last-subscription";
import { formatDateTime } from "@/lib/mask";
import { PLAN_LIST_PATH, formatWon } from "@/lib/plan-display";
import type { SubscriptionView } from "@/lib/subscription";
import { ReceiptBox } from "./receipt-box";

const HOME_LABEL = "처음으로";

// sessionStorage는 같은 탭에서 바뀌어도 알림이 없으므로 구독할 것이 없다.
// 서버 · 첫 렌더(hydration)는 undefined → 로딩 상태, 그 뒤 클라이언트에서 id를 읽는다.
const noopSubscribe = () => () => {};
const getServerSnapshot = (): string | null | undefined => undefined;

/** 화면에 보여 줄 값 — API가 가린 이름 · 휴대폰만 받는다 */
type Receipt = {
  applicationNo: string;
  planName: string;
  monthly: string;
  maskedName: string;
  maskedPhone: string;
  createdAt: string;
};

type Fetched = { id: string; result: { status: "ok"; data: Receipt } | { status: "error" } };

/** API 응답 → 화면 값. 형태가 맞지 않거나 접수(received) 상태가 아니면 null */
function toReceipt(v: unknown): Receipt | null {
  if (typeof v !== "object" || v === null) return null;
  const s = v as Partial<Record<keyof SubscriptionView, unknown>>;
  if (
    typeof s.application_no !== "string" ||
    !/^SUB-\d{6}$/.test(s.application_no) ||
    typeof s.plan_name !== "string" ||
    typeof s.promo_price !== "number" ||
    typeof s.name_masked !== "string" ||
    typeof s.phone_masked !== "string" ||
    s.status !== "received" ||
    typeof s.created_at !== "string"
  ) {
    return null;
  }
  const createdAt = formatDateTime(s.created_at);
  if (!createdAt) return null;
  return {
    applicationNo: s.application_no,
    planName: s.plan_name,
    monthly: formatWon(s.promo_price),
    maskedName: s.name_masked,
    maskedPhone: s.phone_masked,
    createdAt,
  };
}

async function fetchReceipt(id: string, signal: AbortSignal): Promise<Receipt | null> {
  const res = await fetch(`/api/subscriptions?id=${encodeURIComponent(id)}`, { cache: "no-store", signal });
  if (!res.ok) return null;
  return toReceipt(await res.json());
}

export function CompleteView() {
  const router = useRouter();
  const id = useSyncExternalStore(noopSubscribe, readLastSubscriptionId, getServerSnapshot);
  const [fetched, setFetched] = useState<Fetched | null>(null);
  const [toastOpen, setToastOpen] = useState(false);

  // id가 있으면 API에서 그 1건(가린 값)을 불러온다. 잘못된 id는 요청 없이 에러 상태.
  useEffect(() => {
    if (!id || !isUuid(id)) return;
    const controller = new AbortController();
    fetchReceipt(id, controller.signal)
      .then((data) => setFetched({ id, result: data ? { status: "ok", data } : { status: "error" } }))
      .catch(() => {
        if (!controller.signal.aborted) setFetched({ id, result: { status: "error" } });
      });
    return () => controller.abort();
  }, [id]);

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

  const result = id && !isUuid(id) ? { status: "error" as const } : fetched && fetched.id === id ? fetched.result : undefined;

  // 로딩: sessionStorage를 읽기 전 · API 응답 전
  if (id === undefined || (id && result === undefined)) {
    return (
      <>
        <main className="flex flex-1 flex-col px-16 pt-40 pb-24">
          <Skeleton variant="completion" label="신청 정보를 불러오는 중" />
        </main>
        {homeCTA(true)}
      </>
    );
  }

  // 빈: 넘겨받은 id 없음
  if (!id) {
    return (
      <>
        <main className="flex flex-1 flex-col px-16 pt-40 pb-24">
          <EmptyState message="확인할 신청 정보가 없어요." />
        </main>
        {homeCTA()}
      </>
    );
  }

  const receipt = result?.status === "ok" ? result.data : null;

  // 에러: 404 · 500 · 네트워크 · 응답 형태 이상
  if (!receipt) {
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
    if (!receipt) return;
    try {
      await navigator.clipboard.writeText(receipt.applicationNo);
      setToastOpen(true);
    } catch {
      // 클립보드를 쓸 수 없는 환경: 번호는 화면에 그대로 보인다
    }
  }

  return (
    <>
      <div className="flex flex-col items-center gap-12 px-16 pt-40 pb-16">
        <IconDoneMark />
        <h1 className="text-center text-heading-h3 text-text-primary">요금제 변경 신청이 접수됐어요</h1>
      </div>
      <main className="flex flex-1 flex-col gap-24 px-16 pt-16 pb-24">
        <ReceiptBox
          applicationNo={receipt.applicationNo}
          planName={receipt.planName}
          monthly={receipt.monthly}
          maskedName={receipt.maskedName}
          maskedPhone={receipt.maskedPhone}
          createdAt={receipt.createdAt}
          onCopy={() => void onCopy()}
        />

        <CautionNotice message="이 화면을 닫으면 신청 내용을 다시 조회할 수 없어요. 신청 번호를 복사해 두세요." />
      </main>
      <Toast open={toastOpen} message="신청 번호를 복사했어요." onClose={() => setToastOpen(false)} />
      {homeCTA()}
    </>
  );
}
