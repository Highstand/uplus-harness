"use client";

import { useId, useState, type ComponentPropsWithRef } from "react";

export type InputState = "default" | "focus" | "filled" | "caution" | "disabled";

export type InputProps = Omit<ComponentPropsWithRef<"input">, "className"> & {
  /** 낭독용 이름 (화면에 보이려면 showLabel) */
  label: string;
  showLabel?: boolean;
  /**
   * Variant State. 생략하면 자동: disabled → caution(errorMessage 있음) → focus → filled(값 있음) → default
   */
  state?: InputState;
  /** Boolean errorMessage — caution 상태에서만 아래에 표시 */
  errorMessage?: string;
  className?: string;
};

// Figma 1:754 — 박스가 아닌 아래쪽 1.5px 밑줄형. 상태는 밑줄 색으로 구분한다
const UNDERLINE: Record<InputState, string> = {
  default: "border-border-default",
  focus: "border-border-focus",
  filled: "border-border-default",
  caution: "border-border-error",
  disabled: "border-border-default",
};

// icon 20px, 채운 원 + 느낌표 (Figma 메시지 행 아이콘)
function ErrorIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-[20px] shrink-0 text-icon-error">
      <circle cx="10" cy="10" r="8.5" fill="currentColor" />
      <path d="M10 5.75v5" stroke="var(--color-icon-on-dark)" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="10" cy="13.75" r="1.05" fill="var(--color-icon-on-dark)" />
    </svg>
  );
}

/**
 * Input — Design.md 4장 (State = default | focus | filled | caution | disabled, errorMessage).
 * 358 × 58(투명 입력 영역 + 아래 1.5px 밑줄, disabled만 bg/subtle), 오류 문구 노출 시 358 × 90(간격 12 + 메시지 행 20).
 * 글자 body/strong(SemiBold 600 · 16px · 줄높이 24, 값·placeholder 공통). 나머지 input 속성(value, onChange, onBlur, maxLength, inputMode …)은 그대로 전달된다.
 * 오류는 밑줄 색 + 아이콘 + 문구 + aria-invalid로 함께 전달한다.
 */
export function Input({
  label,
  showLabel = false,
  state,
  errorMessage,
  className = "",
  id,
  disabled,
  value,
  defaultValue,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? `input-${autoId}`;
  const errorId = `${inputId}-error`;
  const [focused, setFocused] = useState(false);

  const hasValue = String(value ?? defaultValue ?? "").length > 0;
  const resolved: InputState =
    state ??
    (disabled ? "disabled" : errorMessage ? "caution" : focused ? "focus" : hasValue ? "filled" : "default");
  const showError = resolved === "caution" && !!errorMessage;

  return (
    <div className={`flex w-full flex-col gap-12 ${className}`} data-state={resolved}>
      <label htmlFor={inputId} className={showLabel ? "text-body-small-medium text-text-secondary" : "sr-only"}>
        {label}
      </label>
      <div
        className={`flex h-[58px] w-full items-center border-b-[1.5px] py-12 pl-4 transition-colors ${resolved === "disabled" ? "bg-bg-subtle" : "bg-transparent"} ${UNDERLINE[resolved]}`}
      >
        <input
          id={inputId}
          disabled={disabled || resolved === "disabled"}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={resolved === "caution" || undefined}
          aria-describedby={showError ? errorId : undefined}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className="h-full w-full min-w-[0px] bg-transparent text-body-strong text-text-primary outline-none placeholder:text-text-placeholder disabled:cursor-not-allowed disabled:text-text-on-disabled"
          {...rest}
        />
      </div>
      {showError && (
        <p id={errorId} className="flex items-center gap-4 text-body-small-medium text-text-error">
          <ErrorIcon />
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
}
