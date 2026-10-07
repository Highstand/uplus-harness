import type { ReactNode } from "react";

export type OptionItemState = "default" | "selected";

export type OptionItemProps = {
  /** Text: 제목 */
  title: ReactNode;
  /** Text: 설명 (없으면 숨김) */
  desc?: ReactNode;
  /** Variant State — 같은 그룹에서 한 항목만 selected */
  state?: OptionItemState;
  /** 왼쪽 슬롯 (예: Checkbox) */
  leading?: ReactNode;
  /** 오른쪽 슬롯 (예: 보기 Button) */
  trailing?: ReactNode;
  /** 제목을 <label htmlFor>로 만들어 왼쪽 입력과 연결 (제목 탭 = 체크 토글) */
  labelFor?: string;
  /** desc 요소 id (입력의 aria-describedby에 쓸 수 있게) */
  descId?: string;
  className?: string;
};

/**
 * OptionItem — Design.md 4장 (State = default | selected, Title · Desc). 358 × 83 / 선택 358 × 86.
 * 행 컨테이너일 뿐 자체 radio · input을 렌더링하지 않는다(입력은 leading 슬롯으로 넣는다).
 * 선택은 테두리 굵기 · 색 + 슬롯 입력의 체크 표시로 함께 전달한다.
 */
export function OptionItem({
  title,
  desc,
  state = "default",
  leading,
  trailing,
  labelFor,
  descId,
  className = "",
}: OptionItemProps) {
  const selected = state === "selected";
  const frame = selected
    ? "min-h-[86px] border-2 border-border-focus bg-bg-accent-subtle"
    : "min-h-[83px] border border-border-default bg-bg-surface";
  const titleCls = "text-body-small-strong text-text-primary";

  return (
    <div data-state={state} className={`flex w-full items-center gap-8 rounded-16 px-12 py-12 transition-colors ${frame} ${className}`}>
      {leading}
      <div className="flex min-w-[0px] flex-1 flex-col gap-4">
        {labelFor ? (
          <label htmlFor={labelFor} className={`cursor-pointer ${titleCls}`}>
            {title}
          </label>
        ) : (
          <p className={titleCls}>{title}</p>
        )}
        {desc !== undefined && (
          <p id={descId} className="text-caption-medium text-text-secondary">
            {desc}
          </p>
        )}
      </div>
      {trailing && <div className="flex shrink-0 items-center">{trailing}</div>}
    </div>
  );
}
