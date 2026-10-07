import { CompleteView } from "./complete-view";

// 신청 완료 — sessionStorage(`uplus:lastSubscription`)의 id로 /api/subscriptions에서 가린 1건을 불러온다
export default function SubscriptionCompletePage() {
  return <CompleteView />;
}
