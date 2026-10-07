-- =====================================================================
-- 요금제 변경 신청 저장 테이블 (M6 Supabase 연결)
-- Supabase 대시보드 > SQL Editor에서 사람이 실행한다. 다시 실행해도 안전하다.
--
-- [경고] 실습용 RLS 설정이다.
--   공개 키(publishable key = anon 역할)로 전체 행 select가 가능하다.
--   즉, 이름 · 휴대폰 번호 원본이 공개 키만으로 읽힐 수 있다.
--   실서비스에서는 anon의 select를 막고, 서버 전용 키로 서버에서만 조회해야 한다.
-- =====================================================================

-- gen_random_uuid()용 (Supabase에는 기본 설치되어 있음)
create extension if not exists pgcrypto;

-- PRD 5장 Subscription (구독 신청) 필드 그대로
create table if not exists public.subscriptions (
  -- id: uuid
  id              uuid        primary key default gen_random_uuid(),

  -- application_no: SUB-000000 형식, 중복 불가.
  -- DB default로 생성한다. 앱은 insert 후 돌려받은 행의 id · application_no를 쓴다.
  -- 번호가 우연히 겹치면 unique 위반(SQLSTATE 23505)이 나고, 앱이 insert를 재시도한다.
  application_no  text        not null unique
                  default ('SUB-' || lpad((floor(random() * 1000000))::int::text, 6, '0'))
                  constraint subscriptions_application_no_format
                    check (application_no ~ '^SUB-[0-9]{6}$'),

  -- name: 1~20자
  name            text        not null
                  constraint subscriptions_name_length
                    check (char_length(name) between 1 and 20),

  -- phone: 숫자 11자리, 010으로 시작 (하이픈 없이 저장)
  phone           text        not null
                  constraint subscriptions_phone_format
                    check (phone ~ '^010[0-9]{8}$'),

  -- plan_id: PRD 4장 요금제 데이터의 id
  plan_id         text        not null
                  constraint subscriptions_plan_id_valid
                    check (plan_id in ('p01', 'p02', 'p03', 'p04')),

  -- privacy_agreed: 항상 true (미동의 시 저장 불가)
  privacy_agreed  boolean     not null
                  constraint subscriptions_privacy_agreed_true
                    check (privacy_agreed = true),

  -- status: received / processing / completed / canceled (이번 범위에서는 received로만 생성)
  status          text        not null default 'received'
                  constraint subscriptions_status_valid
                    check (status in ('received', 'processing', 'completed', 'canceled')),

  -- created_at: 신청 일시
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 권한 · RLS (실습용): 공개 키로 insert · select만 허용, update · delete는 막는다.
-- ---------------------------------------------------------------------
alter table public.subscriptions enable row level security;

grant insert, select on table public.subscriptions to anon, authenticated;
revoke update, delete on table public.subscriptions from anon, authenticated;

-- insert: 접수(received) 상태 + 개인정보 동의한 행만 넣을 수 있다.
drop policy if exists "subscriptions_insert_public" on public.subscriptions;
create policy "subscriptions_insert_public"
  on public.subscriptions
  for insert
  to anon, authenticated
  with check (status = 'received' and privacy_agreed = true);

-- select: 실습용으로 전체 허용 (맨 위 경고 참고). insert ... returning에도 필요하다.
drop policy if exists "subscriptions_select_public" on public.subscriptions;
create policy "subscriptions_select_public"
  on public.subscriptions
  for select
  to anon, authenticated
  using (true);

-- update · delete 정책은 만들지 않는다 (RLS로 막힘 + 위에서 권한 revoke).
