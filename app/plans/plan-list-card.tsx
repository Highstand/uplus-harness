import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { TYPE_LABEL, afterPromoCaption, formatData, formatSpeed, formatWon } from "@/lib/plan-display";
import type { Plan } from "@/lib/plans";

/** 카드 안 구분선 (border/subtle 1px) */
function Divider() {
  return <div aria-hidden="true" className="w-full border-t border-border-subtle" />;
}

/**
 * 목록 카드 (A2 — 화면 폴더 조합, Card/Plan은 순서 · 구분선을 바꿀 수 없어 쓰지 않음).
 * 틀은 Card/Plan과 같음: 흰 배경 · radius/16 · p 20 · 1px border/default, 카드 전체 링크.
 * 순서: 유형 Tag → 추천 Tag → 이름 → 구분선 → 기본 데이터 / 소진 후 속도 → 구분선 → 매달 내는 돈 / 24개월 후 월 OO원 → 한 줄 설명.
 * 카드 금액은 매달 내는 돈 · 24개월 후 월 요금 2개뿐 (PRD 3).
 */
export function PlanListCard({ plan, href }: { plan: Plan; href: string }) {
  return (
    <Link
      href={href}
      className="flex w-full flex-col gap-12 rounded-16 border border-border-default bg-bg-surface p-20 text-left transition-colors hover:border-border-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
    >
      <div className="flex flex-wrap items-center gap-4">
        <Tag label={TYPE_LABEL[plan.type]} />
        {plan.is_recommended && <Tag label="추천" />}
      </div>

      <h2 className="text-subtitle-bold text-text-primary">{plan.name}</h2>

      <Divider />

      <dl className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-8">
          <dt className="text-caption-medium text-text-tertiary">기본 데이터</dt>
          <dd className="text-body-small-strong text-text-primary">{formatData(plan)}</dd>
        </div>
        <div className="flex items-center justify-between gap-8">
          <dt className="text-caption-medium text-text-tertiary">소진 후 속도</dt>
          <dd className="text-body-small-strong text-text-primary">{formatSpeed(plan)}</dd>
        </div>
      </dl>

      <Divider />

      <div className="flex flex-col gap-4">
        <p className="flex flex-wrap items-baseline gap-8">
          <span className="text-caption-medium text-text-tertiary">매달 내는 돈</span>
          <span className="text-heading-h3 text-text-primary">{formatWon(plan.promo_price)}</span>
        </p>
        <p className="text-caption-medium text-text-tertiary">{afterPromoCaption(plan)}</p>
        <p className="pt-4 text-body-small-medium text-text-secondary">{plan.description}</p>
      </div>
    </Link>
  );
}
