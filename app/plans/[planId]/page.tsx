import { Suspense } from "react";
import { DetailLoading, DetailView } from "./detail-view";

// 요금제 상세 — planId · ?type=를 클라이언트에서 읽으므로 Suspense 안에서 그린다 (fallback = 로딩 상태)
export default function PlanDetailPage() {
  return (
    <Suspense fallback={<DetailLoading />}>
      <DetailView />
    </Suspense>
  );
}
