"use client";

import { useEffect, useRef, type ReactNode } from "react";

export type ToastProps = {
  /** 표시 여부 */
  open: boolean;
  /** 문구 */
  message: ReactNode;
  /** 자동으로 닫히기까지 ms (기본 2000) */
  duration?: number;
  /** 시간이 지나 닫힐 때 호출 — 부모가 open을 false로 돌린다 */
  onClose: () => void;
  /** 아래 BottomCTA를 피해 위로 띄울지 (기본 true) */
  aboveBottomCTA?: boolean;
};

/**
 * 신규: Toast — 짧은 완료 알림. role="status"(polite)로 낭독, duration 후 자동 닫힘.
 * 낭독 영역은 항상 렌더링해 두고 내용만 바꿔 스크린리더가 변화를 놓치지 않게 한다.
 */
export function Toast({ open, message, duration = 2000, onClose, aboveBottomCTA = true }: ToastProps) {
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => closeRef.current(), duration);
    return () => window.clearTimeout(t);
  }, [open, duration, message]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`pointer-events-none fixed left-1/2 z-50 flex w-full max-w-[390px] -translate-x-1/2 justify-center px-16 ${
        aboveBottomCTA ? "bottom-[109px]" : "bottom-[32px]"
      }`}
    >
      {open && (
        <p className="flex items-center gap-8 rounded-12 bg-bg-inverse px-16 py-12 text-body-small-medium text-text-on-dark">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-20 shrink-0 text-icon-on-dark">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{message}</span>
        </p>
      )}
    </div>
  );
}
