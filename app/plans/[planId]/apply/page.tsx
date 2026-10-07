import { Suspense } from "react";
import { ApplyLoading, ApplyView } from "./apply-view";

// 변경 신청 — planId · ?type=를 클라이언트에서 읽으므로 Suspense 안에서 그린다 (fallback = 로딩 상태)
export default function PlanApplyPage() {
  return (
    <Suspense fallback={<ApplyLoading />}>
      <ApplyView />
    </Suspense>
  );
}
