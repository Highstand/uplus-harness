// 변경 신청 입력 규칙 (PRD 4-4 · 확정 9 · 확정 10)

export const NAME_MAX = 20;

export const MESSAGES = {
  nameEmpty: "이름을 입력해 주세요.",
  nameTooLong: "이름은 20자까지 입력할 수 있어요.",
  phoneInvalid: "휴대폰 번호 11자리를 정확히 입력해 주세요.",
  submitFailed: "신청을 완료하지 못했어요. 잠시 후 다시 시도해 주세요.",
} as const;

/** 앞뒤 공백 제거 후 1~20자 */
export function isValidName(name: string): boolean {
  const n = name.trim();
  return n.length >= 1 && n.length <= NAME_MAX;
}

/** 입력값에서 숫자만 (최대 11자리) */
export function phoneDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

/** 010으로 시작하는 숫자 11자리 */
export function isValidPhone(value: string): boolean {
  return /^010\d{8}$/.test(value.replace(/\D/g, ""));
}

/** 입력 중 하이픈 자동 삽입: 010 → 010-1 → 010-1234-5 → 010-1234-5678 (뒤에 숫자가 있을 때만 하이픈) */
export function formatPhoneInput(value: string): string {
  const d = phoneDigits(value);
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

/** "신청 완료하기" 활성 조건: 이름 AND 휴대폰 형식 AND 동의 (PRD 7) */
export function canSubmit(input: { name: string; phone: string; agreed: boolean }): boolean {
  return isValidName(input.name) && isValidPhone(input.phone) && input.agreed;
}
