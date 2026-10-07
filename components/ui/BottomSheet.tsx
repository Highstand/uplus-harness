"use client";

import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from "react";

export type BottomSheetProps = {
  /** 열림 여부 */
  open: boolean;
  /** 닫기 요청 (딤 배경 탭 · 닫기 버튼 · Esc) */
  onClose: () => void;
  /** 시트 제목 */
  title: ReactNode;
  children: ReactNode;
  /** 닫기 버튼 낭독 문구 (기본 "닫기") */
  closeLabel?: string;
};

/**
 * 신규: Bottom Sheet — 네이티브 <dialog>(showModal)로 포커스 가두기 · Esc 닫기 · 배경 비활성화를 처리한다.
 * 폭 390 기준 하단에 붙고, 내용이 길면 시트 안에서만 스크롤한다. 닫으면 열었던 요소로 포커스가 돌아간다.
 */
export function BottomSheet({ open, onClose, title, children, closeLabel = "닫기" }: BottomSheetProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function onBackdropClick(e: MouseEvent<HTMLDialogElement>) {
    // 시트 바깥(딤 배경)을 누르면 이벤트 대상이 dialog 자신이다
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={onBackdropClick}
      className="fixed inset-x-[0px] bottom-[0px] top-auto m-[0px] mx-auto max-h-[80dvh] w-full max-w-[390px] overflow-hidden rounded-t-24 bg-bg-surface p-[0px] text-text-primary backdrop:bg-bg-inverse/60"
    >
      <div className="flex max-h-[80dvh] flex-col">
        <div className="flex shrink-0 items-center justify-between gap-8 px-16 pt-20 pb-12">
          <h2 id={titleId} className="text-subtitle-bold text-text-primary">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="-mr-8 inline-flex size-[40px] items-center justify-center rounded-full text-icon-strong hover:bg-bg-subtle focus-visible:outline-2 focus-visible:outline-border-focus"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-16 pb-32">{children}</div>
      </div>
    </dialog>
  );
}
