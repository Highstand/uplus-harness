import type { ReactNode } from "react";


export type SkeletonVariant = "planCard" | "detail" | "confirm" | "application" | "completion";

export type SkeletonProps = {
  /** 화면별 뼈대 모양 */
  variant: SkeletonVariant;
  /** planCard 반복 수 (기본 4) */
  count?: number;
  /** 낭독 문구 (기본 "불러오는 중") */
  label?: string;
};

/** 회색 블록 하나 */
function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-8 bg-bg-subtle ${className}`} />;
}

function PlanCardBone() {
  return (
    <div className="flex w-full flex-col gap-12 rounded-16 border border-border-subtle bg-bg-surface p-20">
      <div className="flex gap-4">
        <Bone className="h-[26px] w-[64px] rounded-full" />
        <Bone className="h-[26px] w-[40px] rounded-full" />
      </div>
      <Bone className="h-[28px] w-[160px]" />
      <div className="flex flex-col gap-8 border-t border-border-subtle pt-12">
        <Bone className="h-[18px] w-full" />
        <Bone className="h-[18px] w-full" />
      </div>
      <div className="flex flex-col gap-8 border-t border-border-subtle pt-12">
        <Bone className="h-[32px] w-[180px]" />
        <Bone className="h-[18px] w-[140px]" />
      </div>
      <Bone className="h-[21px] w-full" />
    </div>
  );
}

function RowsBone({ rows }: { rows: number }) {
  return (
    <div className="flex w-full flex-col">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex h-[46px] items-center justify-between border-b border-border-subtle">
          <Bone className="h-[18px] w-[88px]" />
          <Bone className="h-[18px] w-[72px]" />
        </div>
      ))}
    </div>
  );
}

function DescBone({ rows }: { rows: number }) {
  return (
    <div className="flex w-full flex-col">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex flex-col gap-8 border-b border-border-subtle py-16">
          <Bone className="h-[24px] w-[96px]" />
          <Bone className="h-[21px] w-full" />
          <Bone className="h-[21px] w-[240px]" />
        </div>
      ))}
    </div>
  );
}

function SimpleCardBone() {
  return (
    <div className="flex w-full flex-col gap-12 rounded-16 border border-border-subtle bg-bg-surface p-20">
      <Bone className="h-[28px] w-[160px]" />
      <Bone className="h-[32px] w-[180px]" />
    </div>
  );
}

/**
 * 신규: Skeleton — 화면별 로딩 뼈대 5종(planCard · detail · confirm · application · completion).
 * 토큰 색(bg-subtle) · 모서리만 쓴다. aria-busy + 낭독 문구로 로딩 상태를 알린다.
 */
export function Skeleton({ variant, count = 4, label = "불러오는 중" }: SkeletonProps) {
  let body: ReactNode;
  switch (variant) {
    case "planCard":
      body = (
        <div className="flex w-full flex-col gap-16">
          {Array.from({ length: count }, (_, i) => (
            <PlanCardBone key={i} />
          ))}
        </div>
      );
      break;
    case "detail":
      body = (
        <div className="flex w-full flex-col gap-24">
          <PlanCardBone />
          <div className="flex w-full flex-col gap-8 rounded-16 border border-border-subtle bg-bg-surface p-20">
            <Bone className="h-[21px] w-full" />
            <Bone className="h-[21px] w-full" />
            <Bone className="h-[26px] w-full" />
          </div>
          <RowsBone rows={2} />
          <DescBone rows={1} />
        </div>
      );
      break;
    case "confirm":
      body = (
        <div className="flex w-full flex-col gap-24">
          <SimpleCardBone />
          <DescBone rows={3} />
        </div>
      );
      break;
    case "application":
      body = (
        <div className="flex w-full flex-col gap-16">
          <SimpleCardBone />
          <Bone className="h-[58px] w-full rounded-12" />
          <Bone className="h-[58px] w-full rounded-12" />
          <Bone className="h-[83px] w-full rounded-16" />
        </div>
      );
      break;
    case "completion":
      body = (
        <div className="flex w-full flex-col items-center gap-24">
          <Bone className="size-[64px] rounded-full" />
          <Bone className="h-[26px] w-[240px]" />
          <RowsBone rows={1} />
          <SimpleCardBone />
          <RowsBone rows={4} />
        </div>
      );
      break;
  }

  return (
    <div role="status" aria-busy="true" aria-live="polite" className="w-full">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true">{body}</div>
    </div>
  );
}
