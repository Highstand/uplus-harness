import type { ReactNode } from "react";

export type EmptyStateProps = {
  /** 안내 문구 */
  message: ReactNode;
  /** 보조 설명 (선택) */
  description?: ReactNode;
  /** 액션 슬롯 (예: 처음으로 Button) */
  action?: ReactNode;
  className?: string;
};

function EmptyIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="size-48 text-icon-default">
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
      <path d="M16 24h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** 신규: Empty State — 결과가 없을 때 아이콘 + 문구 + (선택) 액션 */
export function EmptyState({ message, description, action, className = "" }: EmptyStateProps) {
  return (
    <section
      className={`flex w-full flex-col items-center gap-16 rounded-16 border border-border-subtle bg-bg-surface px-20 py-40 text-center ${className}`}
    >
      <EmptyIcon />
      <div className="flex flex-col gap-4">
        <p className="text-body-strong text-text-primary">{message}</p>
        {description !== undefined && <p className="text-body-small-medium text-text-secondary">{description}</p>}
      </div>
      {action && <div className="flex w-full justify-center">{action}</div>}
    </section>
  );
}
