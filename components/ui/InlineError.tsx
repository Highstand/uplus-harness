import type { ReactNode } from "react";

export type InlineErrorProps = {
  /** 오류 문구 */
  message: ReactNode;
  /** 액션 슬롯 (예: 다시 불러오기 Button) */
  action?: ReactNode;
  className?: string;
};

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-24 shrink-0 text-icon-error">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1.25" fill="currentColor" />
    </svg>
  );
}

/** 신규: Inline Error — 오류 아이콘 + 문구 + (선택) 액션. role="alert"로 바로 낭독된다. */
export function InlineError({ message, action, className = "" }: InlineErrorProps) {
  return (
    <div
      role="alert"
      className={`flex w-full flex-col gap-12 rounded-12 border border-border-error bg-bg-error-subtle p-16 ${className}`}
    >
      <div className="flex items-start gap-8">
        <AlertIcon />
        <p className="text-body-small-medium text-text-error">
          <span className="sr-only">오류: </span>
          {message}
        </p>
      </div>
      {action && <div className="flex">{action}</div>}
    </div>
  );
}
