import type { ReactNode } from "react";

export type BottomCTALayout = "single" | "double" | "price";

export type BottomCTAProps = {
  /** Variant Layout — single: 핵심 액션 1개 / double: 보조 + 핵심 / price: 요약 값 + 핵심 액션 */
  layout?: BottomCTALayout;
  /** single · price: 핵심 Button 1개. double: [보조 Button, 핵심 Button] 순서로 2개 */
  children: ReactNode;
  /** Text: price 레이아웃의 요약 값 (예: "월 59,000원") */
  amount?: ReactNode;
  /** Text: price 레이아웃의 요약 라벨 (예: "매달 내는 돈") */
  amountLabel?: ReactNode;
};

const HEIGHT: Record<BottomCTALayout, string> = {
  single: "h-[97px]",
  double: "h-[97px]",
  price: "h-[139px]",
};

/**
 * BottomCTA — Design.md 4장 (Layout = single | double | price, Amount · AmountLabel).
 * 화면 하단 고정, 폭 390, 높이 97(price 139). 좌우 16 · 상단 12 · 하단 32 안전 여백.
 * 본문이 가려지지 않게 페이지 맨 아래에 <BottomCTASpacer layout=…/>를 둔다.
 */
export function BottomCTA({ layout = "single", children, amount, amountLabel }: BottomCTAProps) {
  return (
    <div
      className={`fixed bottom-[0px] left-1/2 z-40 flex w-full max-w-[390px] -translate-x-1/2 flex-col gap-12 border-t border-border-subtle bg-bg-surface px-16 pt-12 pb-32 ${HEIGHT[layout]}`}
    >
      {layout === "price" && (
        <div className="flex items-center justify-between gap-8">
          <span className="text-body-small-medium text-text-secondary">{amountLabel}</span>
          <span className="text-subtitle-bold text-text-primary">{amount}</span>
        </div>
      )}
      <div className={layout === "double" ? "grid grid-cols-2 gap-8" : "flex"}>{children}</div>
    </div>
  );
}

/** BottomCTA 높이만큼 본문 아래 빈 공간을 만든다 */
export function BottomCTASpacer({ layout = "single" }: { layout?: BottomCTALayout }) {
  return <div aria-hidden="true" className={`w-full shrink-0 ${HEIGHT[layout]}`} />;
}
