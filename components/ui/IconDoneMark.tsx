import type { SVGProps } from "react";

/** icon/doneMark — 64 × 64. 완료 상태를 대표하는 큰 확인 표시. */
export function IconDoneMark({ className = "", ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={`size-[64px] shrink-0 text-icon-accent ${className}`}
      {...rest}
    >
      <circle cx="32" cy="32" r="32" fill="currentColor" />
      <path
        d="M20 33l8 8 16-17"
        className="text-icon-on-dark"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
