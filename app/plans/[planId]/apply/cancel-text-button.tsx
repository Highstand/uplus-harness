"use client";

/** 신청 Header 오른쪽 "취소" (A12 — 화면 폴더 조합). 테두리 · 배경 없는 회색 글자 버튼, 터치 영역 최소 40 × 40 */
export function CancelTextButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-mr-8 inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-8 px-8 text-body-medium text-text-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-border-focus"
    >
      취소
    </button>
  );
}
