#!/usr/bin/env node
// docs/tokens.json(색·간격·모서리·서체) + docs/Design.md 2장(텍스트 스타일) → app/tokens.css 자동 생성
//   node checks/gen-tokens.mjs          생성
//   node checks/gen-tokens.mjs --check  ① tokens.css가 docs 원본과 같은지 ② app·components·lib에 hex/토큰 밖 임의 값이 없는지
// semantic 색만 내보낸다 (Design.md: primitive 색 직접 적용 금지)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadTokenSets, parseTypeScale, scanProject, TOKENS_CSS } from "./lib/style-rules.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const json = JSON.parse(fs.readFileSync(path.join(root, "docs/tokens.json"), "utf8"));

const slug = (name) => name.replace(/\//g, "-");
const lines = [];
const byCol = (c) => json.tokens.filter((t) => t.collection === c);

lines.push("  /* 기본 테마 값을 지우고 토큰만 남긴다 */");
lines.push("  --color-*: initial;", "  --spacing-*: initial;", "  --radius-*: initial;", "  --text-*: initial;", "  --font-*: initial;");

lines.push("", "  /* color — semantic (bg-bg-surface, text-text-primary, border-border-default …) */");
for (const t of byCol("semantic")) {
  const v = t.values.Default;
  lines.push(`  --color-${slug(t.name)}: ${typeof v === "object" ? v.resolved : v};`);
}

lines.push("", "  /* spacing (p-16, gap-12 …) */");
for (const t of byCol("spacing").sort((a, b) => a.values.Default - b.values.Default)) {
  lines.push(`  --spacing-${t.name.split("/")[1]}: ${t.values.Default}px;`);
}

lines.push("", "  /* radius (rounded-16, rounded-full …) */");
for (const t of byCol("radius")) lines.push(`  --radius-${t.name.split("/")[1]}: ${t.values.Default}px;`);

// 글자: 서체는 tokens.json, 텍스트 스타일(크기·줄높이·굵기)은 Design.md 2장 표
// tokens.json에는 글자 크기 변수만 있어 caption/small(12px)과 줄높이·굵기가 빠져 있다
for (const t of byCol("typography")) {
  if (t.name.startsWith("font-family/")) lines.push("", `  --font-sans: "${t.values.Default}", system-ui, sans-serif;`);
}
const typeScale = parseTypeScale(root);
const tokenSizes = byCol("typography").filter((t) => t.name.startsWith("font-size/")).map((t) => t.values.Default);
const missing = tokenSizes.filter((v) => !typeScale.some((s) => s.size === v));
if (missing.length) {
  console.error(`❌ tokens.json 글자 크기 ${missing.join(", ")}px가 Design.md 2장 표에 없음`);
  process.exit(1);
}
lines.push("", "  /* typography — Design.md 2장 (text-heading-h1, text-body-medium, text-caption-small …: 크기+줄높이+굵기) */");
for (const s of typeScale) {
  const n = slug(s.name);
  lines.push(`  --text-${n}: ${s.size}px;`, `  --text-${n}--line-height: ${s.lineHeight}px;`, `  --text-${n}--font-weight: ${s.weight};`);
}

const css = [
  "/* 자동 생성 파일 — 직접 고치지 마세요.",
  " * 원본: docs/tokens.json(색·간격·모서리·서체) + docs/Design.md 2장(텍스트 스타일) → node checks/gen-tokens.mjs */",
  "@theme {",
  ...lines,
  "}",
  "",
].join("\n");

const target = path.join(root, TOKENS_CSS);

if (process.argv.includes("--check")) {
  let ok = true;
  if (!fs.existsSync(target)) {
    console.error(`❌ ${TOKENS_CSS} 없음 → node checks/gen-tokens.mjs 실행`);
    ok = false;
  } else if (fs.readFileSync(target, "utf8") !== css) {
    console.error(`❌ ${TOKENS_CSS}가 docs 원본과 다름 (직접 고쳤거나 tokens.json·Design.md가 바뀜) → node checks/gen-tokens.mjs 실행`);
    ok = false;
  } else console.log(`✅ ${TOKENS_CSS} = docs 원본`);

  const violations = scanProject(root, loadTokenSets(root));
  if (violations.length) {
    ok = false;
    console.error(`❌ 스타일 규칙 위반 ${violations.length}건`);
    violations.forEach((v) => console.error("   " + v));
  } else console.log("✅ app·components·lib: hex 색 0건, 토큰 밖 임의 값 0건");

  process.exit(ok ? 0 : 1);
}

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, css);
console.log(`✅ ${TOKENS_CSS} 생성 (토큰 ${json.tokens.length}개 중 primitive 제외)`);
