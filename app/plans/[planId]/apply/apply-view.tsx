"use client";

import { useState, type ChangeEvent } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { BottomCTA, BottomCTASpacer } from "@/components/ui/BottomCTA";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Header } from "@/components/ui/Header";
import { InlineError } from "@/components/ui/InlineError";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { MESSAGES, NAME_MAX, canSubmit, formatPhoneInput, isValidName, isValidPhone } from "@/lib/apply-form";
import { saveLastSubscription } from "@/lib/last-subscription";
import { loadPlan } from "@/lib/plan-data";
import { COMPLETE_PATH, PLAN_LIST_PATH, parseTypeFilter, planDetailPath, withType } from "@/lib/plan-display";
import { submitSubscription } from "@/lib/subscription";
import { ApplySummary } from "./apply-summary";
import { CancelTextButton } from "./cancel-text-button";
import { PrivacyAgreeRow } from "./privacy-agree-row";
import { PrivacySheet } from "./privacy-sheet";

const TITLE = "변경 신청";
const CTA_LABEL = "신청 완료하기";
const AGREE_ID = "privacy-agree";

/** 로딩(첫 표시 전): Application Skeleton + 신청 Button Disabled */
export function ApplyLoading() {
  return (
    <>
      <Header type="default" title={TITLE} />
      <main className="flex flex-1 flex-col px-16 pt-16 pb-24">
        <Skeleton variant="application" label="신청 화면을 불러오는 중" />
      </main>
      <BottomCTASpacer />
      <BottomCTA>
        <Button label={CTA_LABEL} state="Disabled" />
      </BottomCTA>
    </>
  );
}

export function ApplyView() {
  const router = useRouter();
  const params = useParams<{ planId: string }>();
  const searchParams = useSearchParams();
  const type = parseTypeFilter(searchParams.get("type"));
  const result = loadPlan(params.planId);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [nameError, setNameError] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);

  const detailHref = withType(planDetailPath(params.planId ?? ""), type);

  function onCancel() {
    // 입력값 지우고 요금제 상세로 (기록 교체)
    setName("");
    setPhone("");
    setAgreed(false);
    setNameError(undefined);
    setPhoneError(undefined);
    setSubmitFailed(false);
    router.replace(detailHref);
  }

  const cancelButton = <CancelTextButton onClick={onCancel} />;

  if (result.status !== "ok") {
    // 잘못된 planId → 변경 전 확인의 빈 상태 문구 재사용 (페이즈 2 확정). 입력 폼 · BottomCTA 숨김
    return (
      <>
        <Header type="default" title={TITLE} />
        <main className="flex flex-1 flex-col px-16 pt-24 pb-32">
          <EmptyState
            message="선택한 요금제 정보가 없어요."
            action={<Button type="Secondary" size="lg" label="처음으로" href={PLAN_LIST_PATH} replace />}
          />
        </main>
      </>
    );
  }

  const plan = result.data;
  const enabled = canSubmit({ name, phone, agreed });

  function onNameChange(e: ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    if (next.length > NAME_MAX) {
      // 21번째 글자부터 입력 막음
      setName(next.slice(0, NAME_MAX));
      setNameError(MESSAGES.nameTooLong);
      return;
    }
    setName(next);
    if (nameError === MESSAGES.nameTooLong || (nameError && isValidName(next))) setNameError(undefined);
  }

  function onNameBlur() {
    if (name.trim().length === 0) setNameError(MESSAGES.nameEmpty);
    else if (nameError === MESSAGES.nameTooLong) setNameError(undefined);
  }

  function onPhoneChange(e: ChangeEvent<HTMLInputElement>) {
    const next = formatPhoneInput(e.target.value);
    setPhone(next);
    if (phoneError && isValidPhone(next)) setPhoneError(undefined);
  }

  function onPhoneBlur() {
    setPhoneError(isValidPhone(phone) ? undefined : MESSAGES.phoneInvalid);
  }

  async function onSubmit() {
    if (!enabled || submitting) return;
    setSubmitting(true);
    setSubmitFailed(false);
    try {
      const sub = await submitSubscription({ name, phone, plan_id: plan.id, privacy_agreed: agreed });
      saveLastSubscription(sub);
      // 기록 교체 — 완료 화면에서 뒤로 가도 신청 화면으로 돌아오지 않게
      router.replace(COMPLETE_PATH);
    } catch {
      setSubmitFailed(true);
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header type="default" title={TITLE} right={cancelButton} />
      <main className="flex flex-1 flex-col gap-24 px-16 pt-16 pb-24">
        {/* 큰 제목 (B8) */}
        <h2 className="whitespace-pre-line text-heading-h3 text-text-primary">{"신청 정보를\n입력해 주세요"}</h2>

        <ApplySummary plan={plan} />

        <form
          noValidate
          className="flex flex-col gap-24"
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit();
          }}
        >
          <Input
            label="이름"
            showLabel
            placeholder="이름"
            type="text"
            autoComplete="name"
            value={name}
            onChange={onNameChange}
            onBlur={onNameBlur}
            errorMessage={nameError}
          />
          <Input
            label="휴대폰 번호"
            showLabel
            placeholder="010-0000-0000"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={13}
            value={phone}
            onChange={onPhoneChange}
            onBlur={onPhoneBlur}
            errorMessage={phoneError}
          />
          <PrivacyAgreeRow id={AGREE_ID} checked={agreed} onChange={setAgreed} onView={() => setSheetOpen(true)} />
        </form>

        {submitFailed && <InlineError message={MESSAGES.submitFailed} />}
      </main>

      <PrivacySheet open={sheetOpen} onClose={() => setSheetOpen(false)} />

      <BottomCTASpacer />
      <BottomCTA>
        <Button
          label={CTA_LABEL}
          state={enabled ? "Default" : "Disabled"}
          loading={submitting}
          onClick={() => void onSubmit()}
        />
      </BottomCTA>
    </>
  );
}
