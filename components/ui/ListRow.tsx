import type { ReactNode } from "react";
import { IconCheck } from "./IconCheck";

export type ListRowType = "default" | "check" | "desc";

export type ListRowProps = {
  /** Text: 라벨 */
  label: ReactNode;
  /**
   * Text: 값. 노드 허용(복사 Button, Tag 등).
   * type="desc"에서는 라벨 아래 여러 줄 설명.
   */
  value?: ReactNode;
  /**
   * Variant Type
   * - default: 라벨 · 값 한 줄 비교 (358 × 46)
   * - check: 포함 · 완료 항목 (왼쪽 icon/check)
   * - desc: 라벨 위 · 여러 줄 설명 아래 (Design.md 규칙에 따라 추가한 Variant)
   */
  type?: ListRowType;
  /** 아래 구분선 (기본 true) */
  divider?: boolean;
  className?: string;
};

/** List/Row — Design.md 4장. 목록 부모는 <dl> 대신 <div>로 감싸도 된다(각 행이 자체 dl 구조). */
export function ListRow({ label, value, type = "default", divider = true, className = "" }: ListRowProps) {
  const line = divider ? "border-b border-border-subtle" : "";

  if (type === "desc") {
    return (
      <dl className={`flex w-full flex-col gap-8 py-16 ${line} ${className}`}>
        <dt className="text-body-strong text-text-primary">{label}</dt>
        <dd className="whitespace-pre-line text-body-small-medium text-text-secondary">{value}</dd>
      </dl>
    );
  }

  return (
    <dl className={`flex min-h-[46px] w-full items-center gap-12 py-12 ${line} ${className}`}>
      <dt className="flex min-w-[0px] flex-1 items-center gap-8 text-body-small-medium text-text-secondary">
        {type === "check" && <IconCheck className="text-icon-accent" />}
        <span>{label}</span>
      </dt>
      {value !== undefined && (
        <dd className="flex shrink-0 items-center justify-end gap-8 text-right text-body-small-strong text-text-primary">
          {value}
        </dd>
      )}
    </dl>
  );
}
