# 공통

출처: docs/screens.md(화면 · 라우트 · 구성 요소) · harness/01-prd.md(문구 원문 · 확정 1~16) · docs/Design.md 4장(컴포넌트 이름 · Variant).
우선순위: PRD > screens.md > flow.png. 문구는 PRD 원문, PRD에 없으면 screens.md 원문. 둘 다 없는 것은 "(제안)"으로 표시.

### 전역 약속

- 라우트는 5개뿐이다. `app/page.tsx`(`/`)를 만들지 않는다(routes.mjs가 목록 밖 라우트로 막음). 서비스 최초 진입 `/` → `/plans`는 `next.config.ts`의 `redirects()`로 처리한다(페이즈 3 뼈대).
- 필터 유지(확정 14): URL 쿼리 `?type=basic | limited_unlimited | full_unlimited`. `전체`는 쿼리 없음(`/plans`). 그 밖의 값은 `전체`로 본다.
  - 목록 → 상세 → 확인 → 신청 경로에 같은 `?type=`을 그대로 붙여 넘긴다(예: `/plans/p03?type=limited_unlimited`). 되돌아가는 링크는 이 값을 써서 만든다.
- 요금제 데이터: `lib/plans.ts`의 `PLANS`(PRD 5장 필드 이름). 상세 · 확인 · 신청은 경로의 `planId`로 `PLANS`에서 찾는다. 없으면 각 화면의 "빈" 상태.
- 신청 저장: `lib/subscription.ts`의 `submitSubscription()`이 `Subscription`(status `received`, `application_no` = `SUB-`+무작위 6자리, phone은 하이픈 없는 숫자 11자리)을 돌려준다. 결과 1건을 sessionStorage 키 `uplus:lastSubscription`(JSON)에 쓴 뒤 완료 화면으로 간다.
- 표시 형식(확정 8): 금액 `32,000원`(쉼표+원), 데이터 `7GB`, p04 데이터 · 속도는 `제한 없음`. 신청 일시 `YYYY.MM.DD HH:mm`.
- 유형 라벨(PRD 4-1): basic `기본형` / limited_unlimited `무제한 · 속도 제한 있음` / full_unlimited `완전 무제한`.
- 금지 단어(PRD 4): "할인가", "프로모션가"는 어느 화면 · 코드 문구에도 쓰지 않는다. 금액 이름은 "정가", "24개월 할인", "매달 내는 돈"만.
- 범위 밖: 로그인 · 본인 인증 · 결제 · 저장(Supabase) · 신청 재조회 화면 · 버튼을 만들지 않는다.
- 미사용 라이브러리 컴포넌트: StepProgress · Chip · Logo — screens.md 구성 요소에 없으므로 이번 화면에서 쓰지 않는다(페이즈 3에서 만들 필요 없음).

### 라이브러리 컴포넌트 (Design.md 4장)

| 컴포넌트 | 파일 | 필요한 Variant · 상태 | 쓰는 화면 |
|---|---|---|---|
| Header | `components/ui/Header.tsx` | `Type = default`(왼쪽 icon/arrowLeft 뒤로) · `root`(뒤로 없음). 추가 필요: `subtitle`(보조 문구, 목록용), `right` 슬롯(신청 화면 상단 `취소` Button), `onBack`/`backHref` | 전 화면 |
| FilterChip | `components/ui/FilterChip.tsx` | `State = default · selected`, `Label`. 선택 시 icon/check 표시. 추가 필요: `disabled`(로딩 중 조작 막기). 단일 선택 그룹(role=radiogroup 수준 접근성) | 목록 |
| Tag | `components/ui/Tag.tsx` | 변형 없음, 텍스트만. 유형 라벨 · `추천` · `접수 완료` 표시 | 목록 · 상세 · 완료 |
| Card/Plan | `components/ui/CardPlan.tsx` | `State = default`(selected 미사용). Text: `Name`, `Desc`, `Price`. Boolean: `Badge`(추천 Tag), `Promo`, `Sale`. `Original` · `Discount` · `Sale`은 **이번 화면 전부 끈다**(목록 규칙 PRD 3). 추가 필요: `typeLabel`(유형 Tag), `priceCaption`(예: `24개월 후 월 39,000원`), `specs`(데이터 · 소진 후 속도 짧은 줄), `promoText`(`가입 후 24개월 동안`), 카드 전체를 링크로 감싸는 `href` | 전 화면 |
| Card/Price | `components/ui/CardPrice.tsx` | 변형 없음. 추가 필요: 행 3개 고정(`정가 월 OO원` / `24개월 할인 −OO원` / `매달 내는 돈 월 OO원`), 강조 값은 `매달 내는 돈` 1개만 | 상세 |
| List/Row | `components/ui/ListRow.tsx` | `Type = default`(라벨+값 한 줄) · `check`(미사용). 추가 필요: **`Type = desc`**(라벨 위 · 여러 줄 설명 아래 — 데이터 조건 문장, 변경 전 안내 3항목용. Design.md "정의되지 않은 상태는 Variant 추가" 규칙), `Value`에 노드 허용(복사 Button · Tag) | 상세 · 확인 · 완료 |
| OptionItem | `components/ui/OptionItem.tsx` | `State = default · selected`, `Title`, `Desc`(미사용). 동의 행 컨테이너로만 쓴다 — **자체 radio/input을 렌더링하지 않는다**(PRD 6: 입력 요소는 텍스트 2 + 체크박스 1). 왼쪽 슬롯(Checkbox) · 오른쪽 슬롯(`보기` Button) 필요. 체크되면 `selected` | 신청 |
| Checkbox | `components/ui/Checkbox.tsx` | `State = default · active`. 실제 `<input type="checkbox">`, 라벨 연결 | 신청 |
| Input | `components/ui/Input.tsx` | `State = default · focus · filled · caution · disabled`, `errorMessage`(caution일 때만 표시). `maxLength` · `inputMode="numeric"` 전달 가능해야 함 | 신청 |
| Button | `components/ui/Button.tsx` | `Type = Primary · Secondary`, `Size = sm · lg · xl`, `State = Default · Hover · Disabled`. 추가 필요: `loading`(로딩 중 비활성 + 표시), 링크형(`href`) | 전 화면 |
| BottomCTA | `components/ui/BottomCTA.tsx` | `Layout = single · double`(`price` 미사용). 하단 고정 · 32px 안전 여백 | 상세 · 확인 · 신청 · 완료 |
| icon/arrowLeft | `components/ui/IconArrowLeft.tsx` | 24px, 터치 영역 최소 40×40 (Header 안에서) | 상세 · 확인 |
| icon/check | `components/ui/IconCheck.tsx` | 24px. 선택된 FilterChip | 목록 |
| icon/doneMark | `components/ui/IconDoneMark.tsx` | 64px | 완료 |

### 신규 컴포넌트 (screens.md "신규:" — 확정 15: 토큰만으로 components/ui에 만든다)

| 신규 컴포넌트 | 파일 | 필요한 Variant · 상태 | 쓰는 화면 |
|---|---|---|---|
| 신규: Skeleton (Plan Card · Detail · Confirm · Application · Completion Skeleton 5종을 한 파일로) | `components/ui/Skeleton.tsx` | `variant = planCard · detail · confirm · application · completion`, `count`(planCard 4개). 색 · 모서리는 토큰만, `aria-busy` | 전 화면 |
| 신규: Empty State | `components/ui/EmptyState.tsx` | `message`(문구), `action` 슬롯(Button) 선택 | 목록 · 상세 · 확인 · 완료 |
| 신규: Inline Error | `components/ui/InlineError.tsx` | `message`, `action` 슬롯(다시 불러오기 Button) 선택. `role="alert"` | 전 화면 |
| 신규: Bottom Sheet (Privacy Bottom Sheet의 틀) | `components/ui/BottomSheet.tsx` | `open` · `onClose` · `title` · children. 딤 배경 탭/닫기 버튼으로 닫힘, 포커스 가두기. 개인정보 내용은 신청 화면 폴더에서 채운다 | 신청 |
| 신규: Caution Notice | `components/ui/CautionNotice.tsx` | `message` 1줄~2줄 안내 박스(아이콘 선택) | 완료 |
| 신규: Toast | `components/ui/Toast.tsx` | `open` · `message` · `duration`(기본 2000ms) 후 자동 닫힘, `role="status"` | 완료 |

## 요금제 목록

### 라우트
`/plans`

### 파일
`app/plans/page.tsx` (쿼리 `?type=` 읽기 — `useSearchParams`는 Suspense 경계 안에서, fallback = 로딩 상태)

### 컴포넌트
위 → 아래 배치 순서.
1. Header `Type = root` — Title `나에게 맞는 요금제 찾기`, subtitle `무제한 유형과 매달 내는 돈을 비교해 보세요.`
2. FilterChip ×4 (단일 선택 그룹, 가로 스크롤 가능) — `전체` / `기본형` / `무제한 · 속도 제한 있음` / `완전 무제한`. 선택된 칩 `State = selected` + icon/check.
3. Card/Plan ×N (`PLANS`를 `promo_price` 낮은 순 = p01 → p02 → p03 → p04, 필터 후에도 순서 유지), 카드 전체가 링크
   - `Name` = `name`
   - `typeLabel` Tag = 유형 라벨(`type`)
   - `Badge` = `is_recommended`일 때만 Tag `추천` (p03만)
   - `specs` = 데이터 `data_gb`(`7GB` / `제한 없음`), 소진 후 속도 `speed_after`(`400kbps` / `제한 없음`)
   - `Price` = `promo_price` (라벨 `매달 내는 돈`)
   - `priceCaption` = `24개월 후 월 {regular_price}원`
   - `Desc` = `description`
   - 끔: `Original` · `Discount` · `Sale` · `Promo` (카드 금액은 `매달 내는 돈`과 `24개월 후 월 요금` 2개만 — PRD 3)

### 상태
- 기본: `전체` 선택, Card/Plan 4개(p01 → p02 → p03 → p04), p03에만 `추천` Tag. 칩 탭 → 해당 `type` 카드만 남음. 필터로 p03이 숨으면 `추천`도 사라짐.
- 로딩: FilterChip 전부 `disabled`, Skeleton `variant = planCard` ×4. (Suspense fallback)
- 빈: 필터 결과 0개 → Empty State `이 유형의 요금제가 없어요.` (FilterChip은 그대로 조작 가능)
- 에러: 요금제 읽기에서 예외 → Inline Error `요금제를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.` + Button `Type = Secondary` `다시 불러오기`(다시 읽기 시도)

### 이동
- 들어오는 곳: 최초 진입(`/` → `/plans` redirect), 요금제 상세(뒤로), 변경 전 확인(`다른 요금제 보기`), 신청 완료(`처음으로` / 브라우저 뒤로).
- FilterChip 탭 → `/plans?type=<type>` (`전체`는 `/plans`). **기록 교체(`router.replace`)**, 스크롤 유지 — 브라우저 뒤로 가기가 칩 선택을 하나씩 되감지 않게.
- Card/Plan 탭 → `/plans/:planId` + 현재 `?type=` 유지(예: `/plans/p03?type=limited_unlimited`). 기록 추가(push).

## 요금제 상세

### 라우트
`/plans/:planId`

### 파일
`app/plans/[planId]/page.tsx`

### 컴포넌트
1. Header `Type = default` — Title = 요금제 `name`(확정 1), 왼쪽 icon/arrowLeft(뒤로)
2. Card/Plan (탭 불가) — `Name` = `name`, `typeLabel` Tag = 유형 라벨, `Badge` = `is_recommended`일 때만 `추천`, `Price` = `promo_price`(라벨 `매달 내는 돈`), `promoText` = `가입 후 24개월 동안`, `priceCaption` = `24개월 후 월 {regular_price}원`. 끔: `Original` · `Discount` · `Sale`.
3. Card/Price — 3줄 고정: `정가 월 {regular_price}원` / `24개월 할인 −{regular_price − promo_price}원` / `매달 내는 돈 월 {promo_price}원` (강조 = 매달 내는 돈)
4. List/Row `Type = default` — `기본 데이터` : `data_gb`(`7GB` / `제한 없음`)
5. List/Row `Type = default` — `소진 후 속도` : `speed_after`(`400kbps` / `제한 없음`)
6. List/Row `Type = desc` — 유형별 안내(PRD 4-2 원문)
   - basic: `기본 데이터 {data}를 다 쓰면 이번 달 남은 기간 동안 최대 {speed_after}로 느려져요.`
   - limited_unlimited: `이름에 '무제한'이 있지만 기본 데이터 {data}를 다 쓰면 이번 달 남은 기간 동안 최대 {speed_after}로 느려져요.`
   - full_unlimited: `기본 데이터 한도와 속도 제한이 없어요.`
7. BottomCTA `Layout = single` — Button `Primary` `xl` `이 요금제로 변경하기`

### 상태
- 기본: 위 1~7 표시, 변경 Button 활성.
- 로딩: Skeleton `variant = detail`, 변경 Button `Disabled`.
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
`app/plans/[planId]/confirm/page.tsx`

### 컴포넌트
1. Header `Type = default` — Title `변경 전 확인`(확정 1), 왼쪽 icon/arrowLeft
2. Card/Plan (탭 불가) — `Name` = `name`, `Price` = `promo_price`(라벨 `매달 내는 돈`), `priceCaption` = `24개월 후 월 {regular_price}원`. 끔: `Original` · `Discount` · `Sale` · `Badge` · `Promo`.
3. List/Row `Type = desc` ×3 — 모두 펼친 상태, 접기 없음, 숫자 금액 없음(PRD 5). PRD 초안 문구 그대로(확정 3).
   - `이번 달 요금` : `이번 달 요금은 변경이 처리되는 날짜에 따라 달라질 수 있어요. 정확한 금액은 다음 달 청구서에서 확인할 수 있어요.`
   - `위약금` : `약정 기간 중에 요금제를 바꾸면 위약금이 생길 수 있어요. 약정이 끝났다면 위약금 없이 바꿀 수 있어요.`
   - `유심 교체` : `요금제만 바꾸는 경우 지금 쓰는 유심을 그대로 쓸 수 있어요.`
4. BottomCTA `Layout = double` — 왼쪽 Button `Secondary` `다른 요금제 보기`, 오른쪽 Button `Primary` `신청하기`

### 상태
- 기본: 위 1~4 표시, 두 Button 활성.
- 로딩: Skeleton `variant = confirm`, BottomCTA 두 Button `Disabled`.
- 빈: `planId`가 `PLANS`에 없음 → Empty State `선택한 요금제 정보가 없어요.` + Button `처음으로`(목록 이동, 제안 라벨 — 상세와 같음). BottomCTA 숨김.
- 에러: 읽기 예외 → Inline Error `변경 전 안내를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.` + Button `Secondary` `다시 불러오기`. BottomCTA Button `Disabled`.

### 이동
- 들어오는 곳: 요금제 상세.
- 뒤로(icon/arrowLeft) → `/plans/:planId` + `?type=` 유지. replace.
- `신청하기` → `/plans/:planId/apply` + `?type=` 유지. push.
- `다른 요금제 보기` → `/plans` + `?type=` 유지(필터 유지). push.
- 빈 상태 `처음으로` → `/plans`. replace.

## 변경 신청

### 라우트
`/plans/:planId/apply`

### 파일
`app/plans/[planId]/apply/page.tsx` (개인정보 바텀시트 내용은 같은 폴더 파일 허용)

### 컴포넌트
1. Header `Type = default`(뒤로 아이콘 없음) — Title `변경 신청`(확정 1), `right` = Button `Secondary` `sm` `취소`
2. Card/Plan (탭 불가) — `Name` = `name`, `Price` = `promo_price`(라벨 `매달 내는 돈`). 끔: `Original` · `Discount` · `Sale` · `Badge` · `Promo` · `priceCaption`.
3. Input — placeholder `이름`, `maxLength` 20(21번째 글자부터 입력 막음), 오류 문구 아래
4. Input — placeholder `010-0000-0000`, `inputMode="numeric"`, 입력 중 하이픈 자동 삽입(확정 10), 오류 문구 아래
5. OptionItem — 왼쪽 Checkbox, Title `[필수] 개인정보 수집·이용에 동의합니다`, 오른쪽 Button `Secondary` `sm` `보기`. 체크되면 `State = selected`, Checkbox `State = active`.
6. BottomSheet(Privacy) — 닫힌 상태 기본. 내용: 수집 항목 `이름, 휴대폰 번호` · 이용 목적 `요금제 변경 신청 처리` · 보관 기간 `신청 처리 완료 후 파기`(확정 2, 자리표시). 닫아도 체크 상태 그대로.
7. Inline Error — 저장 실패 시에만, BottomCTA 바로 위
8. BottomCTA `Layout = single` — Button `Primary` `xl` `신청 완료하기` (`Disabled` · Default · `loading`)

입력 요소는 Input 2개 + Checkbox 1개뿐(PRD 6). OptionItem · Button은 입력 요소를 추가로 렌더링하지 않는다.

### 상태
- 기본: Input 2개 빈 값(`State = default`), Checkbox 해제, `신청 완료하기` `Disabled`. 활성 조건 = 이름(trim 후 1자 이상, 확정 9) AND 휴대폰 `010`으로 시작하는 숫자 11자리 AND 동의 체크(PRD 7).
- 로딩: 탭 → Button `loading` + `Disabled`(중복 제출 방지), Input · Checkbox 그대로. `submitSubscription()`으로 `Subscription`(status `received`) 생성 → sessionStorage 저장. 페이지 첫 표시 전에는 Skeleton `variant = application`.
- 빈: 비어 있거나 미동의. 포커스가 빠질 때 이름 빈 값 → Input `caution` + `이름을 입력해 주세요.` / 휴대폰 형식 오류 → Input `caution` + `휴대폰 번호 11자리를 정확히 입력해 주세요.` Button `Disabled` 유지.
- 에러:
  - 이름 21자 입력 시도 → 입력 막고 Input `caution` + `이름은 20자까지 입력할 수 있어요.`
  - 저장 실패(`submitSubscription()` 또는 sessionStorage 쓰기 예외, 확정 11) → Inline Error `신청을 완료하지 못했어요. 잠시 후 다시 시도해 주세요.`, 입력값 유지, Button 다시 활성.
  - `planId`가 `PLANS`에 없음 → Empty State `선택한 요금제 정보가 없어요.` + Button `처음으로`(screens.md에 이 화면용 문구 없음 — 변경 전 확인 문구 재사용, 제안). 입력 폼 · BottomCTA 숨김.

### 이동
- 들어오는 곳: 변경 전 확인.
- 저장 성공 → `/subscriptions/complete`. **기록 교체(`router.replace`)** — 완료 화면에서 뒤로 가도 신청 화면으로 돌아가지 않게(PRD 4-5).
- `취소` → 입력값 지우고(상태 초기화, 이동으로 언마운트) `/plans/:planId` + `?type=` 유지. replace.
- 브라우저 뒤로 → 기록상 변경 전 확인(입력값은 저장하지 않으므로 사라짐).
- `보기` → 이동 없음, BottomSheet 열기.

## 신청 완료

### 라우트
`/subscriptions/complete`

### 파일
`app/subscriptions/complete/page.tsx` (클라이언트에서 sessionStorage `uplus:lastSubscription` 읽기)

### 컴포넌트
1. icon/doneMark
2. Header `Type = root` — Title `요금제 변경 신청이 접수됐어요`
3. List/Row `Type = default` — `신청 번호` : `application_no`(예: `SUB-482913`) + Value 옆 Button `Secondary` `sm` `복사`
4. Card/Plan (탭 불가) — `Name` = `plan_id`로 찾은 `name`, `Price` = `promo_price`(라벨 `매달 내는 돈`). 끔: `Original` · `Discount` · `Sale` · `Badge` · `Promo` · `priceCaption`.
5. List/Row `Type = default` ×4
   - `이름` : 마스킹(확정 4 — 3글자 이상 첫 · 끝 글자 외 `*`, 예 `홍*동` / 2글자는 끝 글자 `*`, 예 `김*`)
   - `휴대폰 번호` : `010-****-1234` 형식(가운데 4자리 `****`)
   - `신청 일시` : `created_at` → `YYYY.MM.DD HH:mm`
   - `처리 상태` : Tag `접수 완료`
6. Caution Notice — `이 화면을 닫으면 신청 내용을 다시 조회할 수 없어요. 신청 번호를 복사해 두세요.`
7. Toast — `신청 번호를 복사했어요.` (복사 후 2초)
8. BottomCTA `Layout = single` — Button `Primary` `xl` `처음으로`

### 상태
- 기본: 신청 번호 1개 + 방금 신청한 1건만(PRD 9). 목록 · 검색 · 다른 내역 없음. `복사` 탭 → 클립보드 복사 → Toast 2초.
- 로딩: sessionStorage를 읽기 전(첫 렌더) Skeleton `variant = completion`, `복사` · `처음으로` Button `Disabled`.
- 빈: sessionStorage에 값 없음 → Empty State `확인할 신청 정보가 없어요.` + BottomCTA `처음으로`만.
- 에러: 값은 있으나 JSON 파싱 실패 · `plan_id`가 `PLANS`에 없음 · 필드 누락 → Inline Error `신청은 접수됐지만 내용을 표시하지 못했어요. 처음 화면으로 이동해 주세요.` + BottomCTA `처음으로`. 재저장 · 다시 불러오기 없음.

### 이동
- 들어오는 곳: 변경 신청 저장 성공 직후(replace로 진입).
- `처음으로` → `/plans`(필터 없음). replace. 이동 전 sessionStorage `uplus:lastSubscription` 삭제.
- 브라우저 뒤로 → `/plans`. 신청 화면이 replace로 기록에서 빠져 있어도 그 앞(변경 전 확인)이 남으므로, 진입 시 `history.pushState`로 한 칸 쌓고 `popstate`에서 `router.replace('/plans')` 한다. 다시 저장하지 않는다(PRD 4-5).
