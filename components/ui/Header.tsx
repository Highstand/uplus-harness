"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { IconArrowLeft } from "./IconArrowLeft";

export type HeaderType = "default" | "root";

export type HeaderProps = {
  /** Text: 화면 제목 (빈 상태 등에서는 생략 가능) */
  title?: ReactNode;
  /** Variant Type — default: 이전 단계로 돌아갈 수 있는 화면 / root: 상위 진입점 */
  type?: HeaderType;
  /** 제목 아래 보조 문구 (목록 화면용) */
  subtitle?: ReactNode;
  /** 오른쪽 슬롯 (예: 취소 Button) */
  right?: ReactNode;
  /** 뒤로 동작(함수). type="default"에서 onBack 또는 backHref가 있을 때만 뒤로 버튼이 보인다 */
  onBack?: () => void;
  /** 뒤로 링크 */
  backHref?: string;
  /** backHref로 갈 때 기록 교체 (기본 true) */
  backReplace?: boolean;
  /** 뒤로 버튼 낭독 문구 */
  backLabel?: string;
};

const backBtnCls =
  "-ml-8 inline-flex size-[40px] shrink-0 items-center justify-center rounded-full text-icon-strong hover:bg-bg-subtle focus-visible:outline-2 focus-visible:outline-border-focus";

/** Header — Design.md 4장 (Type = default | root, Title). 390 × 56, 좌우 16px. 화면당 하나. */
export function Header({
  title,
  type = "default",
  subtitle,
  right,
  onBack,
  backHref,
  backReplace = true,
  backLabel = "뒤로 가기",
}: HeaderProps) {
  const showBack = type === "default" && (onBack !== undefined || backHref !== undefined);

  let back: ReactNode = null;
  if (showBack) {
    back = backHref ? (
      <Link href={backHref} replace={backReplace} aria-label={backLabel} className={backBtnCls} onClick={onBack ? () => onBack() : undefined}>
        <IconArrowLeft />
      </Link>
    ) : (
      <button type="button" aria-label={backLabel} className={backBtnCls} onClick={onBack}>
        <IconArrowLeft />
      </button>
    );
  }

  if (type === "root") {
    return (
      <header className="w-full bg-bg-surface">
        <div className="flex min-h-[56px] w-full items-center gap-8 px-16">
          {title !== undefined && (
            <h1 className="min-w-[0px] flex-1 text-subtitle-bold text-text-primary">{title}</h1>
          )}
          {right && <div className="ml-auto flex shrink-0 items-center">{right}</div>}
        </div>
        {subtitle && <p className="px-16 pb-16 text-body-small-medium text-text-secondary">{subtitle}</p>}
      </header>
    );
  }

  return (
    <header className="w-full border-b border-border-subtle bg-bg-surface">
      <div className="relative flex h-[56px] w-full items-center gap-8 px-16">
        <div className="flex min-w-[40px] shrink-0 items-center">{back}</div>
        <h1 className="min-w-[0px] flex-1 truncate text-center text-subtitle-default text-text-primary">{title}</h1>
        <div className="flex min-w-[40px] shrink-0 items-center justify-end">{right}</div>
      </div>
      {subtitle && <p className="px-16 pb-12 text-center text-body-small-medium text-text-secondary">{subtitle}</p>}
    </header>
  );
}
