// 신청 1건 조회 — GET /api/subscriptions?id=<uuid>
// 이름 가운데 · 휴대폰 가운데 4자리 가리기는 여기서 끝낸다. 원본 name · phone은 응답에 넣지 않는다.
// cacheComponents 사용 중이라 `dynamic` 설정 대신, request.nextUrl을 읽어 요청 시점에 실행되고 응답에 no-store를 붙인다.
import type { NextRequest } from "next/server";
import { isUuid } from "@/lib/last-subscription";
import { maskName, maskPhone } from "@/lib/mask";
import { PLANS } from "@/lib/plans";
import { SUBSCRIPTIONS_TABLE, getSupabase } from "@/lib/supabase";
import type { Subscription, SubscriptionView } from "@/lib/subscription";

const NO_STORE = { "Cache-Control": "no-store" };

function fail(status: 400 | 404 | 500) {
  const error = status === 400 ? "bad_request" : status === 404 ? "not_found" : "server_error";
  return Response.json({ error }, { status, headers: NO_STORE });
}

type Row = Pick<Subscription, "id" | "application_no" | "name" | "phone" | "plan_id" | "status" | "created_at">;

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") ?? "";
  if (!isUuid(id)) return fail(400);

  let row: Row | null;
  try {
    const { data, error } = await getSupabase()
      .from(SUBSCRIPTIONS_TABLE)
      .select("id, application_no, name, phone, plan_id, status, created_at")
      .eq("id", id)
      .maybeSingle<Row>();
    if (error) return fail(500);
    row = data;
  } catch {
    return fail(500);
  }

  if (!row) return fail(404);

  const plan = PLANS.find((p) => p.id === row.plan_id);
  const createdAt = new Date(row.created_at);
  if (!plan || Number.isNaN(createdAt.getTime())) return fail(500);

  const body: SubscriptionView = {
    id: row.id,
    application_no: row.application_no,
    plan_name: plan.name,
    promo_price: plan.promo_price,
    name_masked: maskName(row.name),
    phone_masked: maskPhone(row.phone),
    status: row.status,
    created_at: createdAt.toISOString(),
  };
  return Response.json(body, { headers: NO_STORE });
}
