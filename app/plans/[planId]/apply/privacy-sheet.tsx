"use client";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { ListRow } from "@/components/ui/ListRow";

/** 개인정보 수집·이용 바텀시트 (PRD 4-4). 보관 기간은 확정 2의 자리표시 문구 */
export function PrivacySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <BottomSheet open={open} onClose={onClose} title="개인정보 수집·이용">
      <div className="flex flex-col">
        <ListRow type="desc" label="수집 항목" value="이름, 휴대폰 번호" />
        <ListRow type="desc" label="이용 목적" value="요금제 변경 신청 처리" />
        <ListRow type="desc" label="보관 기간" value="신청 처리 완료 후 파기" divider={false} />
      </div>
    </BottomSheet>
  );
}
