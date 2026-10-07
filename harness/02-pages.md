# 공통

출처: docs/screens.md(화면 · 라우트 · 구성 요소) · harness/01-prd.md(문구 원문 · 확정 1~16) · docs/Design.md 4장(컴포넌트 이름 · Variant) · reference/make-export/src/App.tsx(구조 참고만, 코드 복사 금지 — 사람 확인 결정 2026-10-07 반영).
우선순위: PRD > screens.md > make-export > flow.png. 문구는 PRD 원문, PRD에 없으면 screens.md 원문. 둘 다 없는 것은 "(제안)"으로 표시.

### 전역 약속

- 라우트는 5개뿐이다. `app/page.tsx`(`/`)를 만들지 않는다(routes.mjs가 목록 밖 라우트로 막음). 서비스 최초 진입 `/` → `/plans`는 `next.config.ts`의 `redirects()`로 처리한다(페이즈 3 뼈대).
- 필터 유지(확정 14): URL 쿼리 `?type=basic | limited_unlimited | full_unlimited`. `전체`는 쿼리 없음(`/plans`). 그 밖의 값은 `전체`로 본다.
  - 목록 → 상세 → 확인 → 신청 경로에 같은 `?type=`을 그대로 붙여 넘긴다(예: `/plans/p03?type=limited_unlimited`). 되돌아가는 링크는 이 값을 써서 만든다.
- 요금제 데이터: `lib/plans.ts`의 `PLANS`(PRD 5장 필드 이름). 상세 · 확인 · 신청은 경로의 `planId`로 `PLANS`에서 찾는다. 없으면 각 화면의 "빈" 상태.
- 신청 저장: `lib/subscription.ts`의 `submitSubscription()`이 `Subscription`(status `received`, `application_no` = `SUB-`+무작위 6자리, phone은 하이픈 없는 숫자 11자리)을 돌려준다. 결과 1건을 sessionStorage 키 `uplus:lastSubscription`(JSON)에 쓴 뒤 완료 화면으로 간다.
- 표시 형식(확정 8): 금액 `32,000원`(쉼표+원), 데이터 `7GB`, p04 데이터 · 속도는 `제한 없음`. 신청 일시 `YYYY.MM.DD HH:mm`.
- 유형 라벨(PRD 4-1): basic `기본형` / limited_unlimited `무제한 · 속도 제한 있음` / full_unlimited `완전 무제한`.
- 금지 단어(PRD 4): "할인가", "프로모션가"는 어느 화면 · 코드 문구에도 쓰지 않는다. 금액 이름은 "정가", "24개월 할인", "매달 내는 돈"만. "월 요금"(단독 금액 이름) · 할인율(%) · 정가 취소선은 쓰지 않는다(A4 유지).
- 범위 밖: 로그인 · 본인 인증 · 결제 · 저장(Supabase) · 신청 재조회 화면 · 버튼을 만들지 않는다. "개통 안내는 문자로 보내드려요" 문구 넣지 않음(A15).
- 미사용 라이브러리 컴포넌트: StepProgress · Chip · Logo · **OptionItem**(A10 결정으로 동의 행에서 뺌) — 이번 화면에서 쓰지 않는다. 파일은 지우지 않는다.
- 화면 배경(사람 규칙): **모든 화면 배경은 `bg/default`로 통일하고, 흰색(`bg/surface`)은 카드와 입력 영역에만 쓴다.** 목록 · 상세 · 확인 · 신청 · 완료 5개 화면 모두 최상위 컨테이너 `bg/default`. 요약 · 안내 · 내역 박스는 흰 카드(`bg/surface`)로 만든다. 하단 고정 CTA 틀 · BottomSheet · Input 같은 입력/카드 영역만 흰색.

### 화면 폴더 조합 (Figma에 변형 없는 레이아웃 — components/ui에 넣지 않음)

모두 "화면 폴더에서 조합(토큰 클래스 div + 기존 components/ui)"으로 만든다. hex · 임의 값 없이 토큰 클래스만. 파일 이름은 기존 화면 폴더 규칙(kebab-case, `*-view.tsx` 옆)에 맞춘 제안.

| 결정 | 조합 내용 | 제안 파일 |
|---|---|---|
| A2 목록 카드 | 흰 카드 틀(`bg/surface` · `radius/16` · p `spacing/20` · 1px `border/default`) = Card/Plan과 같은 틀, 카드 전체 `<Link>`. 안: Tag(유형) → Tag(추천) → 이름 → 구분선(`border/subtle`) → 기본 데이터/소진 후 속도 2줄 → 구분선 → 매달 내는 돈 금액 / `24개월 후 월 OO원` → 한 줄 설명 | `app/plans/plan-list-card.tsx` |
| 흰 요약 카드 | 흰 카드(`bg/surface` · `radius/12` · p `spacing/20` — Figma Card/Price 컨테이너 치수, 색만 흰색). 안에 ListRow 여러 줄(마지막 줄 구분선 없음) 또는 문장. 선택 제목(`body/strong`). 카드 안에서 구분이 필요한 보조 박스(상세 데이터 조건 안내 문장)만 `bg/default` · `radius/12` 박스로 둘 수 있다 | 각 화면 폴더에 하나씩: `app/plans/[planId]/summary-box.tsx`(상세 데이터 조건 카드 — 안내 문장은 카드 안 보조 박스), `app/plans/[planId]/confirm/confirm-summary.tsx`, `app/plans/[planId]/apply/apply-summary.tsx`, `app/subscriptions/complete/receipt-box.tsx` |
| A8 확인 하단 세로 2버튼 | BottomCTA와 같은 하단 고정 틀(폭 390 · `bg/surface` · 위 1px `border/subtle` · 좌우 16 · 위 12 · 아래 32 · 버튼 사이 12) 안에 Button `Primary` `xl` 전체 폭 → Button `Secondary` `xl` 전체 폭. 본문 아래 같은 높이의 빈 칸(Spacer) | `app/plans/[planId]/confirm/confirm-actions.tsx` |
| A10 동의 행 | 테두리 · 배경 없는 한 줄: Checkbox(실제 input, 라벨 연결) + 문구 + 오른쪽 `보기` 글자 버튼(`text/accent` · 밑줄 · `<button type="button">`). OptionItem 안 씀 | `app/plans/[planId]/apply/privacy-agree-row.tsx` |
| A12 신청 Header `취소` | 테두리 · 배경 없는 회색 글자 버튼(`text/secondary` · `body/medium`, 터치 영역 최소 40×40), Header `right` 슬롯에 넣음 | `app/plans/[planId]/apply/cancel-text-button.tsx` |

### 라이브러리 컴포넌트 (Design.md 4장)

| 컴포넌트 | 파일 | 필요한 Variant · 상태 | 쓰는 화면 |
|---|---|---|---|
| Header | `components/ui/Header.tsx` | `Type = default`(왼쪽 icon/arrowLeft 뒤로) · `root`(뒤로 없음). `subtitle`(목록), `right` 슬롯(신청 화면 `취소` 글자 버튼 — 화면 폴더 조합), `onBack`/`backHref` | 전 화면 |
| FilterChip | `components/ui/FilterChip.tsx` | `State = default · selected`, `Label`. 선택 시 icon/check 표시. `disabled`(로딩 중 조작 막기). 단일 선택 그룹(role=radiogroup 수준 접근성) | 목록 |
| Tag | `components/ui/Tag.tsx` | 변형 없음, 텍스트만. 유형 라벨 · `추천` · `접수 완료` 표시(분홍 변형 만들지 않음, C6) | 목록(카드 조합 안) · 상세 · 완료 |
| Card/Plan | `components/ui/CardPlan.tsx` | `State = default`(selected 미사용). `Original` · `Discount` · `Sale` 끔. **목록 카드에는 쓰지 않는다**(A2 — 순서 · 구분선 불가, 화면 폴더 조합). 상세 맨 위 요약에만 사용 | 상세 |
| Card/Price | `components/ui/CardPrice.tsx` | 3줄 고정(`정가 월 OO원` / `24개월 할인 −OO원` / `매달 내는 돈 월 OO원`), 강조 = `매달 내는 돈` 1개. `title` = `요금 구성`(B5). Figma 원본의 "월 요금" · 할인율 · 취소선은 PRD 4-2와 충돌해 쓰지 않음 | 상세 |
| List/Row | `components/ui/ListRow.tsx` | `Type = default`(라벨+값 한 줄, `Value`에 노드 허용 — 복사 Button · Tag) · `desc`(라벨 위 · 설명 아래, 변경 전 안내 3항목) · `check`(미사용) | 상세 · 확인 · 신청 · 완료 |
| Checkbox | `components/ui/Checkbox.tsx` | `State = default · active`. 실제 `<input type="checkbox">`, 라벨 연결 | 신청(동의 행 조합 안) |
| Input | `components/ui/Input.tsx` | `State = default · focus · filled · caution · disabled`, `errorMessage`(caution일 때만). `maxLength` · `inputMode="numeric"`. **`showLabel`로 라벨 화면 표시**(B9) | 신청 |
| Button | `components/ui/Button.tsx` | `Type = Primary · Secondary`, `Size = sm · lg · xl`, `State = Default · Hover · Disabled`, `loading`, 링크형(`href`) | 전 화면 |
| BottomCTA | `components/ui/BottomCTA.tsx` | `Layout = single · price`(`double` 이번 화면 미사용 — 확인 화면은 세로 2버튼 조합). `price`: `amountLabel` · `amount`. 하단 고정 · 32px 안전 여백 · `BottomCTASpacer` | 상세(price) · 신청 · 완료(single) |
| OptionItem | `components/ui/OptionItem.tsx` | **이번 화면 미사용**(A10). 파일 유지 | — |
| icon/arrowLeft | `components/ui/IconArrowLeft.tsx` | 24px, 터치 영역 최소 40×40 (Header 안에서) | 상세 · 확인 |
| icon/check | `components/ui/IconCheck.tsx` | 24px. 선택된 FilterChip | 목록 |
| icon/doneMark | `components/ui/IconDoneMark.tsx` | 64px | 완료 |

### 신규 컴포넌트 (screens.md "신규:" — 확정 15: 토큰만으로 components/ui에 만든다, 이번 결정으로 그대로 둠)

| 신규 컴포넌트 | 파일 | 필요한 Variant · 상태 | 쓰는 화면 |
|---|---|---|---|
| 신규: Skeleton (Plan Card · Detail · Confirm · Application · Completion Skeleton 5종을 한 파일로) | `components/ui/Skeleton.tsx` | `variant = planCard · detail · confirm · application · completion`, `count`(planCard 4개). 색 · 모서리는 토큰만, `aria-busy` | 전 화면 |
| 신규: Empty State | `components/ui/EmptyState.tsx` | `message`(문구), `action` 슬롯(Button) 선택 | 목록 · 상세 · 확인 · 신청 · 완료 |
| 신규: Inline Error | `components/ui/InlineError.tsx` | `message`, `action` 슬롯(다시 불러오기 Button) 선택. `role="alert"` | 전 화면 |
| 신규: Bottom Sheet (Privacy Bottom Sheet의 틀) | `components/ui/BottomSheet.tsx` | `open` · `onClose` · `title` · children. 딤 배경 탭/닫기 버튼으로 닫힘, 포커스 가두기. 개인정보 내용 · 맨 아래 `확인` Button은 신청 화면 폴더(`privacy-sheet.tsx`)에서 children으로 채운다 | 신청 |
| 신규: Caution Notice | `components/ui/CautionNotice.tsx` | `message` 1줄~2줄 안내 박스(아이콘 선택). info 변형 만들지 않음(C7) | 완료 |
| 신규: Toast | `components/ui/Toast.tsx` | `open` · `message` · `duration`(기본 2000ms) 후 자동 닫힘, `role="status"` | 완료 |

### 이번 결정으로 바뀐 점 (컴포넌트 목록 기준)

- components/ui 새 파일 추가 없음 · 기존 파일 수정 없음. 필요한 속성(`Header.right` · `Input.showLabel` · `CardPrice.title` · `BottomCTA layout="price"` · `BottomSheet children`)은 이미 있음.
- Card/Plan: 목록 · 확인 · 신청 · 완료에서 빠지고 상세에만 남음. 목록 카드 → `plan-list-card.tsx` 조합, 확인 · 신청 · 완료 → 흰 요약 카드 조합.
- OptionItem: 미사용으로 바뀜(동의 행 → `privacy-agree-row.tsx`).
- BottomCTA: 상세 `single` → `price`. 확인 `double` → 화면 폴더 세로 2버튼(`confirm-actions.tsx`). `double`은 이번 화면 미사용.
- Button: 신청 `취소` · `보기`는 Button 컴포넌트가 아니라 글자 버튼 조합. 완료 `복사`는 Button `Secondary` `sm` 그대로(작은 복사 칩 만들지 않음, C8).

## 요금제 목록

### 라우트
`/plans`

### 파일
`app/plans/page.tsx` (쿼리 `?type=` 읽기 — `useSearchParams`는 Suspense 경계 안에서, fallback = 로딩 상태). 화면 폴더 전용 파일: `app/plans/plans-view.tsx`(기존) · `app/plans/plan-list-card.tsx`(신규 제안, A2)

### 컴포넌트
위 → 아래 배치 순서. 화면 배경 `bg/default`. 앱바 제목 "요금제 찾기"는 넣지 않음(A1).
1. Header `Type = root` — Title `나에게 맞는 요금제 찾기`, subtitle `무제한 유형과 매달 내는 돈을 비교해 보세요.`
2. FilterChip ×4 (단일 선택 그룹, 가로 스크롤 가능) — `전체` / `기본형` / `무제한 · 속도 제한 있음` / `완전 무제한`. 선택된 칩 `State = selected` + icon/check.
3. 개수 줄(B2, 화면 폴더 조합 — `caption/medium` · `text/tertiary`) — `매달 내는 돈 낮은 순 · {N}개` (N = 필터 결과 개수)
4. 목록 카드 ×N — **화면 폴더 조합 `plan-list-card.tsx`**(Card/Plan 쓰지 않음, A2). `PLANS`를 `promo_price` 낮은 순 = p01 → p02 → p03 → p04, 필터 후에도 순서 유지. 카드 전체가 링크. 카드 안 위 → 아래:
   1. Tag = 유형 라벨(`type`) → Tag `추천`(`is_recommended`일 때만, p03만) — 한 줄
   2. 이름 = `name`
   3. 구분선(`border/subtle`)
   4. `기본 데이터` : `data_gb`(`7GB` / `제한 없음`)
   5. `소진 후 속도` : `speed_after`(`400kbps` / `제한 없음`)
   6. 구분선(`border/subtle`)
   7. `매달 내는 돈` 라벨 + `promo_price` 금액(예 `32,000원`, 큰 글자)
   8. `24개월 후 월 {regular_price}원`
   9. 한 줄 설명 = `description` (맨 아래)
   - 카드 금액은 `매달 내는 돈`과 `24개월 후 월 요금` 2개만(PRD 3). 정가 · 할인 · 할인율 · 취소선 없음.

### 상태
- 기본: `전체` 선택, 개수 줄 `매달 내는 돈 낮은 순 · 4개`, 목록 카드 4개(p01 → p02 → p03 → p04), p03에만 `추천` Tag. 칩 탭 → 해당 `type` 카드만 남고 개수 줄 숫자도 바뀜. 필터로 p03이 숨으면 `추천`도 사라짐.
- 로딩: FilterChip 전부 `disabled`, 개수 줄 숨김, Skeleton `variant = planCard` ×4. (Suspense fallback)
- 빈: 필터 결과 0개 → 개수 줄 `매달 내는 돈 낮은 순 · 0개` + Empty State `이 유형의 요금제가 없어요.` (FilterChip은 그대로 조작 가능)
- 에러: 요금제 읽기에서 예외 → 개수 줄 숨김, Inline Error `요금제를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.` + Button `Type = Secondary` `다시 불러오기`(다시 읽기 시도)

### 이동
- 들어오는 곳: 최초 진입(`/` → `/plans` redirect), 요금제 상세(뒤로), 변경 전 확인(`다른 요금제 보기`), 신청 완료(`처음으로` / 브라우저 뒤로).
- FilterChip 탭 → `/plans?type=<type>` (`전체`는 `/plans`). **기록 교체(`router.replace`)**, 스크롤 유지 — 브라우저 뒤로 가기가 칩 선택을 하나씩 되감지 않게.
- 목록 카드 탭 → `/plans/:planId` + 현재 `?type=` 유지(예: `/plans/p03?type=limited_unlimited`). 기록 추가(push).

## 요금제 상세

### 라우트
`/plans/:planId`

### 파일
`app/plans/[planId]/page.tsx`. 화면 폴더 전용 파일: `app/plans/[planId]/detail-view.tsx`(기존) · `app/plans/[planId]/summary-box.tsx`(신규 제안, 데이터 조건 흰 카드)

### 컴포넌트
위 → 아래 배치 순서. 화면 배경 `bg/default`.
1. Header `Type = default` — Title = 요금제 `name`(확정 1 · A3 유지), 왼쪽 icon/arrowLeft(뒤로)
2. Card/Plan (탭 불가) — `Name` = `name`, `typeLabel` Tag = 유형 라벨, `Badge` = `is_recommended`일 때만 `추천`, `Price` = `promo_price`(라벨 `매달 내는 돈`), `promoText` = `가입 후 24개월 동안`, `priceCaption` = `24개월 후 월 {regular_price}원`. 끔: `Original` · `Discount` · `Sale`. "월 요금" · 할인율 · 취소선 없음(A4).
3. 섹션 "요금 구성" — Card/Price `title` = `요금 구성`(B5), 3줄 고정: `정가 월 {regular_price}원` / `24개월 할인 −{regular_price − promo_price}원` / `매달 내는 돈 월 {promo_price}원` (강조 = 매달 내는 돈)
4. 섹션 "데이터 조건"(B6) — 흰 카드(`bg/surface` · `radius/12` · p `spacing/20`, 화면 폴더 조합 `summary-box.tsx`) 하나에 제목 `데이터 조건`(`body/strong`) + 아래 내용
   1. List/Row `Type = default` — `기본 데이터` : `data_gb`(`7GB` / `제한 없음`)
   2. List/Row `Type = default` — `소진 후 속도` : `speed_after`(`400kbps` / `제한 없음`) (마지막 줄)
   3. 카드 안 보조 박스(`bg/default` · `radius/12`, 구분용) 안 유형별 안내 문장(PRD 4-2 원문)
      - basic: `기본 데이터 {data}를 다 쓰면 이번 달 남은 기간 동안 최대 {speed_after}로 느려져요.`
      - limited_unlimited: `이름에 '무제한'이 있지만 기본 데이터 {data}를 다 쓰면 이번 달 남은 기간 동안 최대 {speed_after}로 느려져요.`
      - full_unlimited: `기본 데이터 한도와 속도 제한이 없어요.`
5. BottomCTA `Layout = price`(A5) — `amountLabel` = `매달 내는 돈`, `amount` = `월 {promo_price}원`, Button `Primary` `xl` `이 요금제로 변경하기`. 본문 맨 아래 `BottomCTASpacer layout="price"`.

### 상태
- 기본: 위 1~5 표시, 변경 Button 활성.
- 로딩: Skeleton `variant = detail`, BottomCTA price 금액 자리 비움, 변경 Button `Disabled`.
- 빈: `planId`가 `PLANS`에 없음 → Header(Title 없음 또는 빈 값) + Empty State `요금제를 찾을 수 없어요.` + Button `처음으로`(목록 이동, 문구는 PRD 4-5 버튼 재사용 — screens.md에 라벨 없음, 제안). BottomCTA 숨김.
- 에러: 읽기 예외 → Inline Error `요금제 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.` + Button `Secondary` `다시 불러오기`. 변경 Button `Disabled`.

### 이동
- 들어오는 곳: 요금제 목록, 변경 전 확인(뒤로), 변경 신청(`취소`).
- 뒤로(icon/arrowLeft) → `/plans` + 받은 `?type=` 그대로(필터 유지, PRD 4-2). **기록 교체(`router.replace`)**. 브라우저 뒤로 가기는 기록상 이전 목록 URL(같은 `?type=`)로 돌아가므로 필터가 유지된다.
- `이 요금제로 변경하기` → `/plans/:planId/confirm` + `?type=` 유지. push.
- 빈 상태 `처음으로` → `/plans`(필터 없음). replace.

## 변경 전 확인

### 라우트
`/plans/:planId/confirm`

### 파일
`app/plans/[planId]/confirm/page.tsx`. 화면 폴더 전용 파일: `app/plans/[planId]/confirm/confirm-view.tsx`(기존) · `confirm-summary.tsx`(신규 제안, 흰 요약 카드) · `confirm-actions.tsx`(신규 제안, A8 세로 2버튼)

### 컴포넌트
위 → 아래 배치 순서. 화면 배경 `bg/default`.
1. Header `Type = default` — Title `변경 전 확인`(확정 1), 왼쪽 icon/arrowLeft
2. 흰 요약 카드(A7, 화면 폴더 조합 `confirm-summary.tsx` — `bg/surface` · `radius/12` · p `spacing/20`) — Card/Plan 쓰지 않음. 안에 List/Row `Type = default` ×3:
   - `선택한 요금제` : `name`
   - `매달 내는 돈` : `{promo_price}원`
   - `24개월 후 월 요금` : `{regular_price}원` (마지막 줄)
3. 섹션 제목 `변경 전 안내`(B7, `body/strong`, 화면에 보이게)
4. List/Row `Type = desc` ×3 — 모두 펼친 상태, 접기 없음, 숫자 금액 없음(PRD 5). PRD 초안 문구 그대로(확정 3).
   - `이번 달 요금` : `이번 달 요금은 변경이 처리되는 날짜에 따라 달라질 수 있어요. 정확한 금액은 다음 달 청구서에서 확인할 수 있어요.`
   - `위약금` : `약정 기간 중에 요금제를 바꾸면 위약금이 생길 수 있어요. 약정이 끝났다면 위약금 없이 바꿀 수 있어요.`
   - `유심 교체` : `요금제만 바꾸는 경우 지금 쓰는 유심을 그대로 쓸 수 있어요.`
5. 하단 세로 2버튼(A8, 화면 폴더 조합 `confirm-actions.tsx` — BottomCTA와 같은 하단 고정 틀, BottomCTA 컴포넌트 `double`은 쓰지 않음):
   - 위: Button `Primary` `xl` 전체 폭 `신청하기`
   - 아래: Button `Secondary` `xl` 전체 폭 `다른 요금제 보기`
   - 본문 맨 아래 같은 높이의 빈 칸(Spacer)으로 내용 가림 방지.

### 상태
- 기본: 위 1~5 표시, 두 Button 활성.
- 로딩: Skeleton `variant = confirm`, 하단 두 Button `Disabled`.
- 빈: `planId`가 `PLANS`에 없음 → Empty State `선택한 요금제 정보가 없어요.` + Button `처음으로`(목록 이동, 제안 라벨 — 상세와 같음). 하단 2버튼 숨김.
- 에러: 읽기 예외 → Inline Error `변경 전 안내를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.` + Button `Secondary` `다시 불러오기`. 하단 두 Button `Disabled`.

### 이동
- 들어오는 곳: 요금제 상세.
- 뒤로(icon/arrowLeft) → `/plans/:planId` + `?type=` 유지. replace.
- `신청하기`(위) → `/plans/:planId/apply` + `?type=` 유지. push.
- `다른 요금제 보기`(아래) → `/plans` + `?type=` 유지(필터 유지). push.
- 빈 상태 `처음으로` → `/plans`. replace.

## 변경 신청

### 라우트
`/plans/:planId/apply`

### 파일
`app/plans/[planId]/apply/page.tsx`. 화면 폴더 전용 파일: `apply-view.tsx`(기존) · `privacy-sheet.tsx`(기존, 바텀시트 내용) · `apply-summary.tsx`(신규 제안, 흰 요약 카드) · `privacy-agree-row.tsx`(신규 제안, A10) · `cancel-text-button.tsx`(신규 제안, A12)

### 컴포넌트
위 → 아래 배치 순서. 화면 배경 `bg/default`.
1. Header `Type = default`(뒤로 아이콘 없음) — Title `변경 신청`(확정 1), `right` = `취소` 글자 버튼(A12, 화면 폴더 조합 `cancel-text-button.tsx` — 테두리 · 배경 없는 `text/secondary` 글자, Button 컴포넌트 아님)
2. 큰 제목(B8, `heading/h3`, 화면 폴더 조합) — `신청 정보를 입력해 주세요` (줄바꿈 허용: `신청 정보를` / `입력해 주세요`)
3. 흰 요약 카드(A9, 화면 폴더 조합 `apply-summary.tsx` — `bg/surface` · `radius/12` · p `spacing/20`) — Card/Plan 쓰지 않음. 안에 List/Row `Type = default` ×2:
   - `선택한 요금제` : `name`
   - `매달 내는 돈` : `{promo_price}원` (마지막 줄)
4. Input — `label` `이름` + `showLabel`(B9, 화면에 표시), placeholder `이름`, `maxLength` 20(21번째 글자부터 입력 막음), 오류 문구 아래
5. Input — `label` `휴대폰 번호` + `showLabel`(B9), placeholder `010-0000-0000`, `inputMode="numeric"`, 입력 중 하이픈 자동 삽입(확정 10), 오류 문구 아래
6. 동의 행(A10, 화면 폴더 조합 `privacy-agree-row.tsx`, **OptionItem 쓰지 않음**) — 테두리 없는 한 줄: Checkbox(`State = default · active`) + 문구 `[필수] 개인정보 수집·이용에 동의합니다`(Checkbox 라벨로 연결) + 오른쪽 `보기` 글자 링크(`text/accent` · 밑줄, `<button type="button">`)
7. BottomSheet(Privacy, `privacy-sheet.tsx`) — 닫힌 상태 기본. `title` = `개인정보 수집·이용 동의`(B10). 내용: 수집 항목 `이름, 휴대폰 번호` · 이용 목적 `요금제 변경 신청 처리` · 보관 기간 `신청 처리 완료 후 파기`(확정 2 · A11 유지). 맨 아래 Button `Primary` `xl` 전체 폭 `확인`(B10 — 시트 닫기, 체크 상태 그대로).
8. Inline Error — 저장 실패 시에만, BottomCTA 바로 위
9. BottomCTA `Layout = single` — Button `Primary` `xl` `신청 완료하기` (`Disabled` · Default · `loading`)

입력 요소는 이름 Input · 휴대폰 Input · 동의 Checkbox 3개뿐(PRD 6). `취소` · `보기` · 시트 `확인`은 버튼이며 입력 요소를 추가로 렌더링하지 않는다.

### 상태
- 기본: Input 2개 빈 값(`State = default`), Checkbox 해제, `신청 완료하기` `Disabled`. 활성 조건 = 이름(trim 후 1자 이상, 확정 9) AND 휴대폰 `010`으로 시작하는 숫자 11자리 AND 동의 체크(PRD 7).
- 로딩: 탭 → Button `loading` + `Disabled`(중복 제출 방지), Input · Checkbox 그대로. `submitSubscription()`으로 `Subscription`(status `received`) 생성 → sessionStorage 저장. 페이지 첫 표시 전에는 Skeleton `variant = application`.
- 빈: 비어 있거나 미동의. 포커스가 빠질 때 이름 빈 값 → Input `caution` + `이름을 입력해 주세요.` / 휴대폰 빈 값 또는 형식 오류 → Input `caution` + `휴대폰 번호 11자리를 정확히 입력해 주세요.`(A13 — 빈 값도 blur 시 오류, PRD 4-4). Button `Disabled` 유지.
- 에러:
  - 이름 21자 입력 시도 → 입력 막고 Input `caution` + `이름은 20자까지 입력할 수 있어요.`
  - 저장 실패(`submitSubscription()` 또는 sessionStorage 쓰기 예외, 확정 11) → Inline Error `신청을 완료하지 못했어요. 잠시 후 다시 시도해 주세요.`, 입력값 유지, Button 다시 활성.
  - `planId`가 `PLANS`에 없음 → Empty State `선택한 요금제 정보가 없어요.` + Button `처음으로`(screens.md에 이 화면용 문구 없음 — 변경 전 확인 문구 재사용, 제안). 큰 제목 · 요약 박스 · 입력 폼 · BottomCTA 숨김.

### 이동
- 들어오는 곳: 변경 전 확인.
- 저장 성공 → `/subscriptions/complete`. **기록 교체(`router.replace`)** — 완료 화면에서 뒤로 가도 신청 화면으로 돌아가지 않게(PRD 4-5).
- `취소`(Header 오른쪽 글자 버튼) → 입력값 지우고(상태 초기화, 이동으로 언마운트) `/plans/:planId` + `?type=` 유지. replace.
- 브라우저 뒤로 → 기록상 변경 전 확인(입력값은 저장하지 않으므로 사라짐).
- `보기` → 이동 없음, BottomSheet 열기. 시트 `확인` · 딤 탭 · 닫기 → 시트 닫힘, 이동 없음.

## 신청 완료

### 라우트
`/subscriptions/complete`

### 파일
`app/subscriptions/complete/page.tsx` (클라이언트에서 sessionStorage `uplus:lastSubscription` 읽기). 화면 폴더 전용 파일: `complete-view.tsx`(기존) · `receipt-box.tsx`(신규 제안, "신청 내역" 흰 카드)

### 컴포넌트
위 → 아래 배치 순서. 화면 배경 `bg/default`. 앱바 제목 "신청 완료"는 넣지 않음(A14).
1. icon/doneMark
2. Header `Type = root` — Title `요금제 변경 신청이 접수됐어요` (보조 문구 "개통 안내는 문자로 보내드려요" 없음, A15)
3. "신청 내역" 흰 카드(A16, 화면 폴더 조합 `receipt-box.tsx` — `bg/surface` · `radius/12` · p `spacing/20`) — 카드 하나에 제목 `신청 내역`(`body/strong`) + List/Row `Type = default` ×7, 위 → 아래:
   1. `신청 번호` : `application_no`(예: `SUB-482913`) + Value 옆 Button `Secondary` `sm` `복사`
   2. `요금제` : `plan_id`로 찾은 `name`
   3. `매달 내는 돈` : `{promo_price}원`
   4. `이름` : 마스킹(확정 4 · A17 — 3글자 이상 첫 · 끝 글자 외 `*`, 예 `홍*동` / 2글자는 끝 글자 `*`, 예 `김*`)
   5. `휴대폰 번호` : `010-****-1234` 형식(가운데 4자리 `****`)
   6. `신청 일시` : `created_at` → `YYYY.MM.DD HH:mm`
   7. `처리 상태` : Tag `접수 완료` (마지막 줄)
   - Card/Plan 쓰지 않음. 신청 번호는 박스 안 1개뿐(PRD 9).
4. Caution Notice — `이 화면을 닫으면 신청 내용을 다시 조회할 수 없어요. 신청 번호를 복사해 두세요.`
5. Toast — `신청 번호를 복사했어요.` (복사 후 2초)
6. BottomCTA `Layout = single` — Button `Primary` `xl` `처음으로`

### 상태
- 기본: 신청 번호 1개 + 방금 신청한 1건만(PRD 9). 목록 · 검색 · 다른 내역 없음. `복사` 탭 → 클립보드 복사 → Toast 2초.
- 로딩: sessionStorage를 읽기 전(첫 렌더) Skeleton `variant = completion`, `복사` · `처음으로` Button `Disabled`.
- 빈: sessionStorage에 값 없음 → Empty State `확인할 신청 정보가 없어요.` + BottomCTA `처음으로`만(신청 내역 박스 · Caution Notice 숨김).
- 에러: 값은 있으나 JSON 파싱 실패 · `plan_id`가 `PLANS`에 없음 · 필드 누락 → Inline Error `신청은 접수됐지만 내용을 표시하지 못했어요. 처음 화면으로 이동해 주세요.` + BottomCTA `처음으로`. 재저장 · 다시 불러오기 없음.

### 이동
- 들어오는 곳: 변경 신청 저장 성공 직후(replace로 진입).
- `처음으로` → `/plans`(필터 없음). replace. 이동 전 sessionStorage `uplus:lastSubscription` 삭제.
- 브라우저 뒤로 → `/plans`. 신청 화면이 replace로 기록에서 빠져 있어도 그 앞(변경 전 확인)이 남으므로, 진입 시 `history.pushState`로 한 칸 쌓고 `popstate`에서 `router.replace('/plans')` 한다. 다시 저장하지 않는다(PRD 4-5).
