// 스타일 규칙 (훅과 gen-tokens --check가 함께 쓴다)
// 1) hex 색은 app/tokens.css에만 있을 수 있다
// 2) Tailwind 임의 값([13px] 등)은 토큰에 있는 값만 허용한다
//    - p*/m*/gap*/space-*  → spacing 토큰 값 (tokens.json)
//    - rounded*            → radius 토큰 값 (tokens.json)
//    - text-[..px]         → 글자 크기 (tokens.json font-size + Design.md 2장 타이포 스케일)
//    - 그 밖의 크기(w-[358px], h-[56px] 등 레이아웃 치수)는 허용
import fs from "node:fs";
import path from "node:path";

export const STYLE_DIRS = ["app", "components", "lib"];
export const STYLE_EXTS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"];
export const TOKENS_CSS = "app/tokens.css";

// Design.md "## 2. 타이포 스케일" 표 → [{ name, size, lineHeight, weight }]
// 글자 크기 변수만 담긴 tokens.json에 없는 스타일(예: caption/small 12px)과 줄높이·굵기를 여기서 얻는다
export function parseTypeScale(root) {
  const md = fs.readFileSync(path.join(root, "docs/Design.md"), "utf8");
  const section = (md.split(/^## 2\. 타이포 스케일\s*$/m)[1] ?? "").split(/^## /m)[0];
  const rows = [];
  for (const m of section.matchAll(/^\|\s*`([\w/-]+)`\s*\|\s*(\d+)\s*\/\s*(\d+)px\s*\|[^|(]*\((\d{3})\)\s*\|/gm)) {
    rows.push({ name: m[1], size: Number(m[2]), lineHeight: Number(m[3]), weight: Number(m[4]) });
  }
  if (rows.length === 0) throw new Error('docs/Design.md에서 "## 2. 타이포 스케일" 표를 읽지 못함');
  return rows;
}

export function loadTokenSets(root) {
  const json = JSON.parse(fs.readFileSync(path.join(root, "docs/tokens.json"), "utf8"));
  const sets = { spacing: new Set([0]), radius: new Set([0]), font: new Set() };
  for (const t of json.tokens) {
    const v = t.values?.Default;
    if (typeof v !== "number") continue;
    if (t.collection === "spacing") sets.spacing.add(v);
    if (t.collection === "radius") sets.radius.add(v);
    if (t.collection === "typography" && t.name.startsWith("font-size/")) sets.font.add(v);
  }
  for (const s of parseTypeScale(root)) sets.font.add(s.size);
  return sets;
}

// root 기준 상대 경로(슬래시)로 바꾼다
export function toRel(root, file) {
  return path.relative(root, path.resolve(root, file)).split(path.sep).join("/");
}

export function isStyleTarget(rel) {
  if (rel === TOKENS_CSS) return false;
  if (!STYLE_DIRS.some((d) => rel.startsWith(d + "/"))) return false;
  return STYLE_EXTS.includes(path.extname(rel));
}

const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![0-9a-zA-Z_-])/g;
const ARBITRARY = /(?<![\w-])-?([a-z]+(?:-[a-z]+)*)-\[(-?\d*\.?\d+)(px|rem)\]/g;

function groupOf(prefix) {
  if (/^(p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y)$/.test(prefix)) return "spacing";
  if (prefix.startsWith("rounded")) return "radius";
  if (prefix === "text") return "font";
  return null;
}

export function findViolations(text, sets) {
  const out = [];
  for (const m of text.matchAll(HEX)) out.push(`hex 색 직접 입력: ${m[0]} → app/tokens.css의 토큰 클래스/변수를 쓰세요`);
  for (const m of text.matchAll(ARBITRARY)) {
    const group = groupOf(m[1]);
    if (!group) continue;
    const px = Math.abs(Number(m[2])) * (m[3] === "rem" ? 16 : 1);
    if (!sets[group].has(px)) {
      out.push(`토큰에 없는 임의 값: ${m[0]} (${group} 허용값: ${[...sets[group]].sort((a, b) => a - b).join("/")})`);
    }
  }
  return out;
}

// 폴더 전체를 훑어 위반을 모은다 (gen-tokens --check용)
export function scanProject(root, sets) {
  const results = [];
  const walk = (dir) => {
    const abs = path.join(root, dir);
    if (!fs.existsSync(abs)) return;
    for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
      const rel = dir + "/" + e.name;
      if (e.isDirectory()) walk(rel);
      else if (isStyleTarget(rel)) {
        for (const v of findViolations(fs.readFileSync(path.join(root, rel), "utf8"), sets)) results.push(`${rel}: ${v}`);
      }
    }
  };
  STYLE_DIRS.forEach(walk);
  return results;
}
