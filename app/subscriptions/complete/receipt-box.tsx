"use client";

import { Button } from "@/components/ui/Button";
import { ListRow } from "@/components/ui/ListRow";
import { Tag } from "@/components/ui/Tag";

export type ReceiptBoxProps = {
  applicationNo: string;
  planName: string;
  /** 매달 내는 돈 (예: "59,000원") */
  monthly: string;
  /** 가린 이름 (예: "김*플") */
  maskedName: string;
  /** 가린 휴대폰 번호 (예: "010-****-1234") */
  maskedPhone: string;
  /** YYYY.MM.DD HH:mm */
  createdAt: string;
  onCopy: () => void;
};

/**
 * "신청 내역" 흰 카드 (A16 — 화면 폴더 조합). bg/surface · radius/12 · p 20 안에 제목 + List/Row 7줄.
 * 신청 번호는 이 카드 안 1개뿐 (PRD 9).
 */
export function ReceiptBox({ applicationNo, planName, monthly, maskedName, maskedPhone, createdAt, onCopy }: ReceiptBoxProps) {
  return (
    <section aria-labelledby="receipt-title" className="flex w-full flex-col gap-4 rounded-12 bg-bg-surface p-20">
      <h2 id="receipt-title" className="text-body-strong text-text-primary">
        신청 내역
      </h2>
      <div className="flex flex-col">
        <ListRow
          label="신청 번호"
          value={
            <>
              <span>{applicationNo}</span>
              <Button type="Secondary" size="sm" label="복사" fullWidth={false} aria-label="신청 번호 복사" onClick={onCopy} />
            </>
          }
        />
        <ListRow label="요금제" value={planName} />
        <ListRow label="매달 내는 돈" value={monthly} />
        <ListRow label="이름" value={maskedName} />
        <ListRow label="휴대폰 번호" value={maskedPhone} />
        <ListRow label="신청 일시" value={createdAt} />
        <ListRow label="처리 상태" value={<Tag label="접수 완료" />} divider={false} />
      </div>
    </section>
  );
}
