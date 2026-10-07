import type { ReactNode } from "react";

export type TagTone = "neutral" | "accent";

export type TagProps = {
  /** Text: 짧은 분류 · 강조 레이블 (유형 라벨, 추천, 접수 완료 …) */
  label: ReactNode;
  /** 색 톤 — neutral(기본 분류) / accent(추천 등 강조). 의미는 항상 label 텍스트로 전달한다 */
  tone?: TagTone;
  className?: string;
};

const TONE: Record<TagTone, string> = {
  neutral: "bg-bg-subtle text-text-secondary",
  accent: "bg-bg-accent-subtle text-text-accent",
};

/** Tag — Design.md 4장. 높이 26px, 좌우 padding 12px. 인터랙션 없음. */
export function Tag({ label, tone = "neutral", className = "" }: TagProps) {
  return (
    <span
      className={`inline-flex h-[26px] shrink-0 items-center justify-center whitespace-nowrap rounded-full px-12 text-caption-bold ${TONE[tone]} ${className}`}
    >
      {label}
    </span>
  );
}
