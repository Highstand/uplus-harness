import type { SVGProps } from "react";

/** icon/arrowLeft — 24 × 24. 단독 터치 영역(40 × 40)은 감싸는 버튼이 확보한다. */
export function IconArrowLeft({ className = "", ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={`size-24 shrink-0 ${className}`}
      {...rest}
    >
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
