// 요금제 데이터 — PRD 4장 표 · 5장 필드 이름 그대로 (실습용 가상 데이터, 실제 통신사 요금제 아님)
// 약속: checks/rules.mjs가 이 파일을 직접 불러온다. 다른 파일을 import하지 않는다.

export type PlanType = "basic" | "limited_unlimited" | "full_unlimited";

export type Plan = {
  id: string;
  name: string;
  /** 정가(원), 24개월 후 월 요금 */
  regular_price: number;
  /** 매달 내는 돈(원), 가입 후 24개월 */
  promo_price: number;
  promo_months: number;
  /** null = 제한 없음 */
  data_gb: number | null;
  /** 소진 후 속도, null = 제한 없음 */
  speed_after: string | null;
  type: PlanType;
  /** true는 1개만 */
  is_recommended: boolean;
  description: string;
};

export const PLANS: Plan[] = [
  {
    id: "p01",
    name: "라이트 7",
    regular_price: 39000,
    promo_price: 32000,
    promo_months: 24,
    data_gb: 7,
    speed_after: "400kbps",
    type: "basic",
    is_recommended: false,
    description: "영상보다 메신저·검색 위주로 쓰는 분께 맞는 요금제",
  },
  {
    id: "p02",
    name: "출퇴근 50",
    regular_price: 55000,
    promo_price: 47000,
    promo_months: 24,
    data_gb: 50,
    speed_after: "1Mbps",
    type: "limited_unlimited",
    is_recommended: false,
    description: "출퇴근길에 짧은 영상을 매일 보는 분께 맞는 요금제",
  },
  {
    id: "p03",
    name: "데일리 무제한 110",
    regular_price: 69000,
    promo_price: 59000,
    promo_months: 24,
    data_gb: 110,
    speed_after: "5Mbps",
    type: "limited_unlimited",
    is_recommended: true,
    description: "출퇴근길 영상 시청이 길어 월말 전에 데이터가 떨어지는 분께 맞는 요금제",
  },
  {
    id: "p04",
    name: "프리 무제한",
    regular_price: 89000,
    promo_price: 79000,
    promo_months: 24,
    data_gb: null,
    speed_after: null,
    type: "full_unlimited",
    is_recommended: false,
    description: "데이터 한도와 속도 제한 없이 쓰고 싶은 분께 맞는 요금제",
  },
];
