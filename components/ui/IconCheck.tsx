import type { SVGProps } from "react";

/** icon/check — 24 × 24. 의미를 아이콘 하나에만 맡기지 않는다(옆에 텍스트를 둔다). */
export function IconCheck({ className = "", ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={`size-24 shrink-0 ${className}`}
      {...rest}
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
