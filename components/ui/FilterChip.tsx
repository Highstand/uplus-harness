"use client";

import type { KeyboardEvent, ReactNode } from "react";

export type FilterChipState = "default" | "selected";

export type FilterChipProps = {
  /** Text: 칩 문구 */
  label: ReactNode;
  /** Variant State — 같은 그룹에서 한 개만 selected */
  state?: FilterChipState;
  onClick?: () => void;
  /** 로딩 중 조작 막기 */
  disabled?: boolean;
};

/**
 * FilterChip — Design.md 4장 / Figma 28:528 (State = default | selected, Label). 높이 40px, 너비 Hug, px 16 · py 8, rounded full.
 * default: 흰 배경 + border/default + body/small-medium. selected: fill/secondary(검정) + 흰 글자 body/small-strong.
 * 선택은 배경 반전 + 글자 굵기 + aria-checked로 함께 전달한다. FilterChipGroup(role="radiogroup") 안에서 쓴다.
 */
export function FilterChip({ label, state = "default", onClick, disabled = false }: FilterChipProps) {
  const selected = state === "selected";
  const weight = selected ? "text-body-small-strong" : "text-body-small-medium";
  const tone = disabled
    ? "bg-fill-tertiary text-text-on-disabled border-border-subtle cursor-not-allowed"
    : selected
      ? "bg-fill-secondary text-text-on-dark border-fill-secondary"
      : "bg-bg-surface text-text-primary border-border-default hover:bg-bg-subtle";

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      tabIndex={selected ? 0 : -1}
      data-chip
      onClick={onClick}
      className={`inline-flex h-[40px] shrink-0 items-center justify-center whitespace-nowrap rounded-full border px-16 py-8 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus ${weight} ${tone}`}
    >
      <span>{label}</span>
    </button>
  );
}

export type FilterChipGroupProps = {
  /** 그룹 낭독 이름 (예: "요금제 유형") */
  label: string;
  children: ReactNode;
  className?: string;
};

/** 단일 선택 그룹. 가로 스크롤 가능, 좌우 화살표로 칩 사이 이동. */
export function FilterChipGroup({ label, children, className = "" }: FilterChipGroupProps) {
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    const chips = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("[data-chip]:not(:disabled)"));
    if (chips.length === 0) return;
    const i = chips.indexOf(document.activeElement as HTMLButtonElement);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % chips.length;
    if (e.key === "ArrowLeft") next = (i - 1 + chips.length) % chips.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = chips.length - 1;
    e.preventDefault();
    chips[next].focus();
    chips[next].click();
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={`-mx-16 flex gap-8 overflow-x-auto px-16 py-4 ${className}`}
    >
      {children}
    </div>
  );
}
