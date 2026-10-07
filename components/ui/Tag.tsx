import type { ReactNode } from "react";

export type TagTone = "neutral" | "accent";

export type TagProps = {
  /** Text: 짧은 분류 · 강조 레이블 (유형 라벨, 추천, 접수 완료 …) */
  label: ReactNode;
  /**
   * 호환용 prop. Figma Tag(22:757)에는 색 변형이 없어 neutral · accent 모두 같은 회색 Tag로 그린다.
   * 의미는 항상 label 텍스트로 전달한다.
   */
  tone?: TagTone;
  className?: string;
};

/**
 * Tag — Design.md 4장 / Figma 22:757. 높이 26px, 좌우 padding 12px, 위아래 4px, rounded full.
 * 배경 border/subtle, 글자 caption/bold(13 · 18 · 700) text/secondary. 인터랙션 없음.
 */
export function Tag({ label, tone = "neutral", className = "" }: TagProps) {
  return (
    <span
      data-tone={tone}
      className={`inline-flex h-[26px] shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-border-subtle px-12 py-4 text-caption-bold text-text-secondary ${className}`}
    >
      {label}
    </span>
  );
}
