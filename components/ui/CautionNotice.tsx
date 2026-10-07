import type { ReactNode } from "react";

export type CautionNoticeProps = {
  /** 1~2줄 안내 문구 */
  message: ReactNode;
  /** 앞 아이콘 표시 (기본 true) */
  icon?: boolean;
  className?: string;
};

function CautionIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-20 shrink-0 text-icon-error">
      <path d="M10 2.5l8 14H2l8-14z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 8v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="14.3" r="0.9" fill="currentColor" />
    </svg>
  );
}

/** 신규: Caution Notice — 주의 안내 박스. 아이콘 + "주의" 낭독 + 문구로 색에만 기대지 않는다. */
export function CautionNotice({ message, icon = true, className = "" }: CautionNoticeProps) {
  return (
    <div role="note" className={`flex w-full items-start gap-8 rounded-12 bg-bg-error-subtle p-16 ${className}`}>
      {icon && <CautionIcon />}
      <p className="text-body-small-medium text-text-primary">
        <span className="sr-only">주의: </span>
        {message}
      </p>
    </div>
  );
}
