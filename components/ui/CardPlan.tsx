import Link from "next/link";
import type { ReactNode } from "react";
import { IconCheck } from "./IconCheck";
import { Tag } from "./Tag";

export type CardPlanState = "default" | "selected";

export type CardPlanSpec = { label: string; value: ReactNode };

export type CardPlanProps = {
  /** Text: 요금제 이름 */
  name: ReactNode;
  /** Text: 설명 (없으면 숨김) */
  desc?: ReactNode;
  /** Text: 강조 금액 (예: "59,000원") */
  price: ReactNode;
  /** 금액 앞 라벨 (기본 "매달 내는 돈") */
  priceLabel?: string;
  /** 금액 아래 보조 문구 (예: "24개월 후 월 69,000원"). 없으면 숨김 */
  priceCaption?: ReactNode;
  /** Text: 원래 금액 — 값을 줄 때만 표시 */
  original?: ReactNode;
  /** Text: 차액 표시 — 값을 줄 때만 표시 */
  discount?: ReactNode;
  /** Boolean Badge — 강조 Tag (기본 문구 "추천") */
  badge?: boolean;
  badgeLabel?: string;
  /** Boolean Promo — 기간 안내 줄 (promoText) */
  promo?: boolean;
  /** Promo 문구 (예: "가입 후 24개월 동안"). promo를 생략하고 이것만 줘도 표시된다 */
  promoText?: ReactNode;
  /** Boolean Sale — 판매 표시 Tag (saleLabel) */
  sale?: boolean;
  saleLabel?: string;
  /** 유형 Tag 문구 (예: "기본형") */
  typeLabel?: ReactNode;
  /** 데이터 · 소진 후 속도 같은 짧은 줄 */
  specs?: CardPlanSpec[];
  /** Variant State — 선택 가능한 카드에서만 selected */
  state?: CardPlanState;
  /** 카드 전체 링크 */
  href?: string;
  replace?: boolean;
  /** 카드 이름의 제목 수준 (기본 h2) */
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * Card/Plan — Design.md 4장 / Figma 23:434 (Name · Desc · Discount · Price · Original, Badge · Promo · Sale, State).
 * 순서: Tag → 이름(subtitle/bold) → 설명(body/small-medium, text/secondary) → price-row(pt 8, 금액 Bold 18).
 * 폭 358(부모 폭 채움). 부가 정보는 기본으로 모두 꺼져 있다. Tag는 Figma처럼 모두 회색 Tag.
 */
export function CardPlan({
  name,
  desc,
  price,
  priceLabel = "매달 내는 돈",
  priceCaption,
  original,
  discount,
  badge = false,
  badgeLabel = "추천",
  promo,
  promoText,
  sale = false,
  saleLabel = "",
  typeLabel,
  specs,
  state = "default",
  href,
  replace,
  headingLevel = "h2",
  className = "",
}: CardPlanProps) {
  const selected = state === "selected";
  const showPromo = (promo ?? promoText !== undefined) && promoText !== undefined;
  const showTags = typeLabel !== undefined || badge || (sale && saleLabel);
  const Heading = headingLevel;

  const body = (
    <>
      {(showTags || selected) && (
        <div className="flex flex-wrap items-center gap-4">
          {badge && <Tag label={badgeLabel} />}
          {typeLabel !== undefined && <Tag label={typeLabel} />}
          {sale && saleLabel && <Tag label={saleLabel} />}
          {selected && (
            <span className="ml-auto inline-flex items-center gap-4 text-caption-bold text-text-primary">
              <IconCheck className="size-16" />
              선택됨
            </span>
          )}
        </div>
      )}

      <Heading className="text-subtitle-bold text-text-primary">{name}</Heading>

      {desc !== undefined && <p className="text-body-small-medium text-text-secondary">{desc}</p>}

      {specs && specs.length > 0 && (
        <dl className="flex flex-col gap-4">
          {specs.map((s) => (
            <div key={s.label} className="flex items-center justify-between gap-8">
              <dt className="text-body-small-medium text-text-secondary">{s.label}</dt>
              <dd className="text-body-small-strong text-text-primary">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="flex flex-col items-start gap-4 pt-8">
        <div className="flex flex-wrap items-baseline gap-8">
          <span className="text-caption-medium text-text-tertiary">{priceLabel}</span>
          {discount !== undefined && <span className="text-subtitle-bold text-text-accent">{discount}</span>}
          <span className="text-subtitle-bold text-text-primary">{price}</span>
        </div>
        {original !== undefined && <s className="text-caption-medium text-text-tertiary">{original}</s>}
        {priceCaption !== undefined && <p className="text-caption-medium text-text-tertiary">{priceCaption}</p>}
        {showPromo && (
          <p className="inline-flex h-[24px] items-center rounded-4 bg-bg-accent-subtle px-10 py-4 text-caption-bold text-icon-accent">
            {promoText}
          </p>
        )}
      </div>
    </>
  );

  // Figma 23:434 — 흰 배경, radius/16, p 20, gap 8. default 1px border/default · selected 1.5px border/medium
  const cls = [
    "flex w-full flex-col gap-8 rounded-16 bg-bg-surface p-20 text-left",
    selected ? "border-[1.5px] border-border-medium" : "border border-border-default",
    className,
  ].join(" ");

  if (href) {
    return (
      <Link
        href={href}
        replace={replace}
        aria-current={selected || undefined}
        className={`${cls} transition-colors hover:border-border-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus`}
      >
        {body}
      </Link>
    );
  }

  return <article className={cls}>{body}</article>;
}
