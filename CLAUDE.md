# CLAUDE.md — 요금제 추천·구독 하네스 (수업용 경량판)

## 1. 목표

docs/의 PRD·screens·Design·tokens를 읽어, screens.md의 화면을 Next.js(App Router · TypeScript · Tailwind) 모바일 웹으로 구현한다.

완료 기준: screens.md의 화면 수만큼 라우트가 1:1로 있고, 키 없이 `npm run build` · `npm run lint` · `node checks/routes.mjs --all` · `node checks/rules.mjs`가 통과하고, 사람이 PRD "어기면 안 되는 것" 나머지 항목과 화면을 O/X로 승인하면 끝.

기준 문서 우선순위: PRD > screens.md > flow.png. 문구는 PRD에 있으면 PRD 그대로.

M6 Supabase 연결: 신청 저장을 Supabase로 바꾼다.
- 고치는 곳: `supabase/subscriptions.sql`(테이블 · RLS, 사람이 SQL Editor에서 실행), `lib/subscription.ts`, `app/api/**`, `app/subscriptions/complete/complete-view.tsx`. 신청 화면 · components/ui · lib/plans.ts는 그대로.
- 테이블은 PRD 5장 Subscription 필드 그대로. RLS(실습용): 공개 키로 insert · select만 허용, update · delete는 막는다. 서버 전용 키는 쓰지 않는다.
- 키는 `.env.local`(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)에 두고 커밋하지 않는다(.gitignore의 `.env*`).
- `submitSubscription()`은 insert 후 돌려받은 행의 id와 `SUB-`+6자리 신청 번호를 쓴다.
- 완료 화면은 넘겨받은 id로 `app/api/subscriptions`(GET)를 불러 그 1건만 보여준다. 이름 가운데 · 휴대폰 가운데 4자리 가리기는 API에서 끝내고 가린 값만 브라우저로 보낸다.

보호 경로(훅이 막음): docs/ · reference/ · app/tokens.css(→ `node checks/gen-tokens.mjs`로만 생성)

디자인 토큰 원본: 색 · 간격 · 모서리 · 서체는 docs/tokens.json, 텍스트 스타일(크기 · 줄높이 · 굵기 15개)은 docs/Design.md 2장 표. tokens.json에 없는 caption/small · caption/small-bold(12px)는 Figma 글자 위계에 있는 정식 스타일이라 Design.md 표를 따른다.

## 2. 페이즈 순서

작업 브랜치: `harness/build` (main 합치기는 사람이 한다)

| # | 페이즈 | 출력 |
|---|---|---|
| 1 | PRD 읽기 | harness/01-prd.md |
| 2 | 페이지 분해 | harness/02-pages.md |
| 3 | Design·토큰 적용 | app/tokens.css · app/globals.css · app/layout.tsx · components/ui/** |
| 4 | 화면 구현 (목록 → 상세 → 확인 → 신청 → 완료, 한 번에 5개) | app/**/page.tsx · lib/plans.ts · lib/subscription.ts 등 |
| 5 | 검증 | harness/05-review.md |

진행 규칙
- 페이즈가 끝나면 게이트 → 통과 시 `harness/progress.md` 체크 → 커밋 `phase-N: 내용`.
- 게이트를 통과하기 전에는 다음 페이즈로 넘어가지 않는다. 사람 게이트(1·5)에서는 묻고 멈춘다.
- 같은 실패가 2번 나면 멈추고 사람에게 묻는다.
- Next.js 16은 바뀐 게 많으니 코드를 쓰기 전에 node_modules/next/dist/docs/의 관련 문서를 먼저 확인한다.
- "이어서 해줘": progress.md와 마지막 커밋을 보고 체크 안 된 첫 페이즈부터.

## 3. 페이즈별 에이전트

| 페이즈 | 에이전트 | 고칠 수 있는 것 | 부르는 말 |
|---|---|---|---|
| 1 | @prd-reader | harness/01-prd.md | "페이즈 1 시작", "PRD 읽어줘" |
| 2 | @page-splitter | harness/02-pages.md | "페이즈 2 시작", "화면 나눠줘" |
| 3 | @theme-builder | 뼈대 파일, app/layout.tsx, app/globals.css, components/ui/** | "페이즈 3 시작", "토큰 적용해줘" |
| 4 | @screen-builder | 5개 화면 page.tsx(+같은 폴더), lib/**, app/api/**, supabase/**(M6) | "페이즈 4 시작", "화면 만들어줘" |
| 5 | @reviewer | 없음 (읽기 + 검사 실행 + O/X 체크리스트 보고) | "페이즈 5 시작", "검증해줘" |

- 오케스트레이터(메인 대화)는 직접 구현하지 않는다. 페이즈마다 3장의 담당 에이전트를 부르고, 게이트 실행 · 기록 · 커밋 · 실패 시 되돌아갈 페이즈 판단만 한다.
- @screen-builder는 components/ui/를 고치지 않는다. 모자라면 보고 → 페이즈 3.
- @screen-builder 입력에는 `reference/make-export`(특히 `src/App.tsx`)가 포함된다. 화면 레이아웃(화면 제목, 입력 라벨, 요약 영역 모양, 동의 행, 하단 버튼 배치)의 참고용이며, 코드는 복사하지 않고 구조만 참고한다. 컴포넌트는 components/ui 것만 쓴다. screens.md와 다르면 차이 목록을 먼저 사람에게 보여주고 확인을 받는다.
- 판정용 약속은 하나뿐: `lib/plans.ts`가 `export const PLANS`를 PRD 5장 필드 이름 그대로 내보낸다 (id, name, regular_price, promo_price, promo_months, data_gb, speed_after, type, is_recommended, description). lib/plans.ts는 다른 파일을 import하지 않는다.

## 4. 게이트 조건

| 페이즈 | 통과 조건 | 판정 | 실패하면 |
|---|---|---|---|
| 1 | 01-prd.md를 보여주고 사람이 채팅에서 "승인" | 🧑 사람 | 페이즈 1 |
| 2 | `node checks/routes.mjs`: screens.md `## ` 수 = 02-pages.md 라우트 수, 문자열 일치 | 🤖 | 페이즈 2 |
| 3 | 훅(hex 색 금지 · 토큰 밖 임의 값 금지) + `node checks/gen-tokens.mjs --check` | 🪝 + 🤖 | 페이즈 3 |
| 4 | 5개 화면을 다 만든 뒤 한 번: `npm run build` · `npm run lint` · `node checks/routes.mjs --all` · `node checks/rules.mjs` | 🤖 | 페이즈 4 |
| 5 | @reviewer 체크리스트 → 사람이 PRD 나머지 규칙 + 5개 화면 O/X | 🧑 사람 | 원인별: 라우트→2, 토큰→3, 화면→4 |

★ `checks/rules.mjs`는 lib/plans.ts 데이터로 셀 수 있는 규칙 3개만 판정한다.
- PRD 1: 추천(`is_recommended`) 요금제는 정확히 1개
- PRD 2: 이름에 "무제한"이 들어간 요금제는 `type`이 basic이 아님
- 보조(US2): `limited_unlimited`는 `speed_after`가 있고, `full_unlimited`는 `data_gb`·`speed_after`가 모두 null

PRD 3~9는 페이즈 5에서 사람이 O/X로 확인한다.
