"use client";

import { IconCheck } from "./IconCheck";

export type CheckboxState = "default" | "active";

export type CheckboxProps = {
  /** input id — OptionItem의 labelFor 등 바깥 <label>과 연결할 때 쓴다 */
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** 바깥에 연결된 <label>이 없을 때의 낭독 이름 */
  ariaLabel?: string;
  /** 설명 문구 id (aria-describedby) */
  describedBy?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
};

/**
 * Checkbox — Design.md 4장 (State = default | active). 24 × 24 표시, 터치 영역 40 × 40.
 * 실제 <input type="checkbox">를 쓴다. 체크는 색 + 체크 표시 모양으로 함께 전달한다.
 */
export function Checkbox({ id, checked, onChange, ariaLabel, describedBy, disabled = false, required, name }: CheckboxProps) {
  const state: CheckboxState = checked ? "active" : "default";
  const box =
    state === "active"
      ? "bg-fill-primary border-fill-primary text-icon-on-dark"
      : "bg-bg-surface border-border-medium text-transparent";

  return (
    <span className="relative inline-flex size-[40px] shrink-0 items-center justify-center" data-state={state}>
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        required={required}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        onChange={(e) => onChange(e.target.checked)}
        className="peer absolute inset-[0px] m-[0px] size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-flex size-24 items-center justify-center rounded-4 border-2 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-border-focus ${
          disabled ? "bg-fill-disabled border-fill-disabled-strong text-icon-disabled" : box
        }`}
      >
        <IconCheck className="size-20" />
      </span>
    </span>
  );
}
