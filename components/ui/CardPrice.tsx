import type { ReactNode } from "react";

export type CardPriceProps = {
  /** 정가 금액 (쉼표+원 형식으로 넘긴다, 예: "69,000원") → "월 69,000원" */
  regular: ReactNode;
  /** 약정 기간 차액 (예: "10,000원") → "−10,000원" */
  discount: ReactNode;
  /** 매달 내는 돈 (예: "59,000원") → "월 59,000원" — 이 카드의 유일한 강조 값 */
  monthly: ReactNode;
  /** 두 번째 줄 라벨 (기본 "24개월 할인") */
  discountLabel?: string;
  /** 카드 제목(선택). 없으면 숨김 */
  title?: ReactNode;
  className?: string;
};

/**
 * Card/Price — Design.md 4장. 358 × 124. 3줄 고정:
 * 정가 월 OO원 / 24개월 할인 −OO원 / 매달 내는 돈 월 OO원(강조)
 */
export function CardPrice({ regular, discount, monthly, discountLabel = "24개월 할인", title, className = "" }: CardPriceProps) {
  return (
    <section className={`flex min-h-[124px] w-full flex-col gap-8 rounded-16 bg-bg-surface p-20 border border-border-default ${className}`}>
      {title !== undefined && <h2 className="text-body-strong text-text-primary">{title}</h2>}
      <dl className="flex flex-col gap-8">
        <div className="flex items-center justify-between gap-8">
          <dt className="text-body-small-medium text-text-secondary">정가</dt>
          <dd className="text-body-small-medium text-text-secondary">월 {regular}</dd>
        </div>
        <div className="flex items-center justify-between gap-8">
          <dt className="text-body-small-medium text-text-secondary">{discountLabel}</dt>
          <dd className="text-body-small-medium text-text-secondary">−{discount}</dd>
        </div>
        <div className="flex items-center justify-between gap-8 border-t border-border-subtle pt-8">
          <dt className="text-body-strong text-text-primary">매달 내는 돈</dt>
          <dd className="text-subtitle-bold text-text-accent">월 {monthly}</dd>
        </div>
      </dl>
    </section>
  );
}
