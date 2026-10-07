import { Suspense } from "react";
import { PlansLoading, PlansView } from "./plans-view";

// 요금제 목록 — ?type= 필터는 useSearchParams로 읽으므로 Suspense 안에서 그린다 (fallback = 로딩 상태)
export default function PlansPage() {
  return (
    <Suspense fallback={<PlansLoading />}>
      <PlansView />
    </Suspense>
  );
}
