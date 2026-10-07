import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

export type ButtonType = "Primary" | "Secondary";
export type ButtonSize = "sm" | "lg" | "xl";
export type ButtonState = "Default" | "Hover" | "Disabled";

export type ButtonProps = {
  /** Text: 버튼 문구 */
  label: ReactNode;
  /** Variant Type — 핵심 액션 Primary, 보조 액션 Secondary */
  type?: ButtonType;
  /** Variant Size — sm 40px · lg 48px · xl 52px */
  size?: ButtonSize;
  /** Variant State — Hover는 강제 표시용(평소엔 마우스 hover로 자동), Disabled는 조작 불가 */
  state?: ButtonState;
  /** 처리 중: 비활성 + 회전 표시 + "처리 중" 낭독 */
  loading?: boolean;
  /** 링크형: 주어지면 <Link>로 렌더링 */
  href?: string;
  /** 링크형일 때 기록 교체(router.replace와 같은 효과) */
  replace?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  /** HTML button type (기본 "button") */
  htmlType?: "button" | "submit" | "reset";
  /** 부모 폭을 꽉 채움 (기본 true) */
  fullWidth?: boolean;
  "aria-label"?: string;
  className?: string;
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-[40px] px-12 gap-4 rounded-8 text-body-small-strong",
  lg: "h-[48px] px-16 gap-8 rounded-12 text-body-strong",
  xl: "h-[52px] px-20 gap-8 rounded-12 text-body-strong",
};

function toneClass(type: ButtonType, state: ButtonState) {
  if (state === "Disabled") {
    return "bg-fill-disabled text-text-on-disabled border border-fill-disabled cursor-not-allowed";
  }
  if (type === "Primary") {
    return state === "Hover"
      ? "bg-fill-primary-hover text-text-on-dark border border-fill-primary-hover"
      : "bg-fill-primary text-text-on-dark border border-fill-primary hover:bg-fill-primary-hover hover:border-fill-primary-hover";
  }
  return state === "Hover"
    ? "bg-bg-subtle text-text-primary border border-border-medium"
    : "bg-bg-surface text-text-primary border border-border-default hover:bg-bg-subtle hover:border-border-medium";
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-16 shrink-0 animate-spin">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Button — Design.md 4장 (Type · Size · State, Label) + loading · href */
export function Button({
  label,
  type = "Primary",
  size = "xl",
  state = "Default",
  loading = false,
  href,
  replace,
  onClick,
  htmlType = "button",
  fullWidth = true,
  className = "",
  ...aria
}: ButtonProps) {
  const disabled = state === "Disabled" || loading;
  const visualState: ButtonState = disabled ? "Disabled" : state;
  const cls = [
    "inline-flex items-center justify-center whitespace-nowrap transition-colors select-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus",
    SIZE[size],
    toneClass(type, visualState),
    fullWidth ? "w-full" : "",
    className,
  ].join(" ");

  const content = (
    <>
      {loading && <Spinner />}
      <span>{label}</span>
      {loading && <span className="sr-only">처리 중</span>}
    </>
  );

  if (href) {
    if (disabled) {
      return (
        <span role="link" aria-disabled="true" aria-busy={loading || undefined} className={cls} aria-label={aria["aria-label"]}>
          {content}
        </span>
      );
    }
    return (
      <Link href={href} replace={replace} onClick={onClick} className={cls} aria-label={aria["aria-label"]}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={htmlType}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-busy={loading || undefined}
      onClick={onClick}
      className={cls}
      aria-label={aria["aria-label"]}
    >
      {content}
    </button>
  );
}
