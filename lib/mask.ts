// 완료 화면 가리기 · 일시 형식 (확정 4 · PRD 4-5)

/** 3글자 이상: 첫 · 끝 글자 외 모두 * (홍길동 → 홍*동) / 2글자: 끝 글자 * (김이 → 김*) / 1글자: * */
export function maskName(name: string): string {
  const chars = Array.from(name.trim());
  if (chars.length === 0) return "";
  if (chars.length === 1) return "*";
  if (chars.length === 2) return `${chars[0]}*`;
  return `${chars[0]}${"*".repeat(chars.length - 2)}${chars[chars.length - 1]}`;
}

/** 01012345678 → 010-****-5678 */
export function maskPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length !== 11) return "***-****-****";
  return `${d.slice(0, 3)}-****-${d.slice(7)}`;
}

/** ISO 문자열 → YYYY.MM.DD HH:mm (사용자 기기 시간대). 잘못된 값이면 null */
export function formatDateTime(iso: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}.${p(date.getMonth() + 1)}.${p(date.getDate())} ${p(date.getHours())}:${p(date.getMinutes())}`;
}
