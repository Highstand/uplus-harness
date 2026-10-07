import { Suspense } from "react";
import { ConfirmLoading, ConfirmView } from "./confirm-view";

// 변경 전 확인 — planId · ?type=를 클라이언트에서 읽으므로 Suspense 안에서 그린다 (fallback = 로딩 상태)
export default function PlanConfirmPage() {
  return (
    <Suspense fallback={<ConfirmLoading />}>
      <ConfirmView />
    </Suspense>
  );
}
