"use client";

import { Checkbox } from "@/components/ui/Checkbox";

export type PrivacyAgreeRowProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** "보기" — 바텀시트 열기 (이동 없음) */
  onView: () => void;
};

/**
 * 동의 행 (A10 — 화면 폴더 조합, OptionItem 쓰지 않음). 테두리 · 배경 없는 한 줄:
 * Checkbox(실제 input, 라벨 연결) + 문구 + 오른쪽 "보기" 글자 버튼(text/accent · 밑줄).
 * 입력 요소는 Checkbox 1개뿐 — "보기"는 button이다.
 */
export function PrivacyAgreeRow({ id, checked, onChange, onView }: PrivacyAgreeRowProps) {
  return (
    <div className="flex w-full items-center gap-4">
      {/* Checkbox 터치 영역 40 중 보이는 상자 24를 왼쪽 끝에 맞춘다 */}
      <span className="-ml-8 flex shrink-0">
        <Checkbox id={id} checked={checked} onChange={onChange} required />
      </span>
      <label htmlFor={id} className="min-w-[0px] flex-1 cursor-pointer text-body-small-medium text-text-primary">
        [필수] 개인정보 수집·이용에 동의합니다
      </label>
      <button
        type="button"
        onClick={onView}
        aria-label="개인정보 수집·이용 내용 보기"
        aria-haspopup="dialog"
        className="-mr-8 inline-flex min-h-[40px] shrink-0 items-center rounded-8 px-8 text-body-small-medium whitespace-nowrap text-text-accent underline focus-visible:outline-2 focus-visible:outline-border-focus"
      >
        보기
      </button>
    </div>
  );
}
