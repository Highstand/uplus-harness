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

// 테두리는 1px로 고정하고 강조 상태는 ring으로 한 겹 더해 글자 위치가 흔들리지 않게 한다
const FRAME: Record<InputState, string> = {
  default: "border-border-default bg-bg-surface",
  focus: "border-border-focus ring-1 ring-border-focus bg-bg-surface",
  filled: "border-border-strong bg-bg-surface",
  caution: "border-border-error ring-1 ring-border-error bg-bg-error-subtle",
  disabled: "border-border-subtle bg-fill-tertiary",
};

function ErrorIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-16 shrink-0 text-icon-error">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5v4.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11.25" r="0.9" fill="currentColor" />
    </svg>
  );
}

/**
 * Input — Design.md 4장 (State = default | focus | filled | caution | disabled, errorMessage).
 * 358 × 58, 오류 문구 노출 시 358 × 90. 나머지 input 속성(value, onChange, onBlur, maxLength, inputMode …)은 그대로 전달된다.
 * 오류는 테두리 색 + 아이콘 + 문구 + aria-invalid로 함께 전달한다.
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
    <div className={`flex w-full flex-col gap-8 ${className}`} data-state={resolved}>
      <label htmlFor={inputId} className={showLabel ? "text-body-small-medium text-text-secondary" : "sr-only"}>
        {label}
      </label>
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
        className={`h-[58px] w-full rounded-12 border px-16 text-body-medium text-text-primary outline-none transition-colors placeholder:text-text-placeholder disabled:cursor-not-allowed disabled:text-text-on-disabled ${FRAME[resolved]}`}
        {...rest}
      />
      {showError && (
        <p id={errorId} className="flex items-center gap-4 text-caption-medium text-text-error">
          <ErrorIcon />
          <span>{errorMessage}</span>
        </p>
      )}
    </div>
  );
}
