"use client";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { ListRow } from "@/components/ui/ListRow";

/**
 * 개인정보 수집·이용 바텀시트 (PRD 4-4 · B10). 보관 기간은 확정 2 문구.
 * 맨 아래 "확인"은 시트만 닫는다 — 체크 상태는 그대로.
 */
export function PrivacySheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <BottomSheet open={open} onClose={onClose} title="개인정보 수집·이용 동의">
      <div className="flex flex-col gap-16">
        <div className="flex flex-col">
          <ListRow type="desc" label="수집 항목" value="이름, 휴대폰 번호" />
          <ListRow type="desc" label="이용 목적" value="요금제 변경 신청 처리" />
          <ListRow type="desc" label="보관 기간" value="신청 처리 완료 후 파기" divider={false} />
        </div>
        <Button label="확인" onClick={onClose} />
      </div>
    </BottomSheet>
  );
}
