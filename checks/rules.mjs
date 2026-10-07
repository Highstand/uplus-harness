#!/usr/bin/env node
// lib/plans.ts 데이터로 셀 수 있는 규칙 3개 판정 (나머지 PRD 규칙은 페이즈 5에서 사람이 O/X)
//   node checks/rules.mjs
// 약속: lib/plans.ts는 `export const PLANS`를 PRD 5장 필드 이름 그대로 내보내고, 다른 파일을 import하지 않는다.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "lib/plans.ts");
if (!fs.existsSync(src)) {
  console.error("❌ lib/plans.ts 없음 (페이즈 4 미완료)");
  process.exit(1);
}

// typescript로 변환해 .next/cache에 두고 불러온다
const ts = createRequire(path.join(root, "package.json"))("typescript");
const code = ts.transpileModule(fs.readFileSync(src, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const out = path.join(root, ".next/cache/harness-rules/plans.mjs");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, code);

let PLANS;
try {
  ({ PLANS } = await import(pathToFileURL(out).href + "?t=" + Date.now()));
} catch (e) {
  console.error(`❌ lib/plans.ts를 불러오지 못함 (다른 파일 import 금지): ${e.message}`);
  process.exit(1);
}
if (!Array.isArray(PLANS) || PLANS.length === 0) {
  console.error("❌ lib/plans.ts에 `export const PLANS` 배열이 없음");
  process.exit(1);
}

const TYPES = ["basic", "limited_unlimited", "full_unlimited"];
const rules = [
  {
    id: "PRD 1",
    text: "추천 요금제는 정확히 1개",
    bad: () => {
      const rec = PLANS.filter((p) => p.is_recommended === true);
      return rec.length === 1 ? [] : [`추천 ${rec.length}개 (${rec.map((p) => p.id).join(", ") || "없음"})`];
    },
  },
  {
    id: "PRD 2",
    text: '이름에 "무제한"이 들어간 요금제는 type이 basic이 아님',
    bad: () => [
      ...PLANS.filter((p) => !TYPES.includes(p.type)).map((p) => `${p.id} type 값이 잘못됨: ${p.type}`),
      ...PLANS.filter((p) => p.name.includes("무제한") && p.type === "basic").map((p) => `${p.id} "${p.name}" type=basic`),
    ],
  },
  {
    id: "US2",
    text: "limited_unlimited는 speed_after 있음, full_unlimited는 data_gb·speed_after 모두 null",
    bad: () => [
      ...PLANS.filter((p) => p.type === "limited_unlimited" && !p.speed_after).map((p) => `${p.id} 속도 제한형인데 speed_after 없음`),
      ...PLANS.filter((p) => p.type === "full_unlimited" && (p.data_gb !== null || p.speed_after !== null)).map(
        (p) => `${p.id} 완전 무제한인데 data_gb=${p.data_gb}, speed_after=${p.speed_after}`,
      ),
    ],
  },
];

let failed = 0;
for (const r of rules) {
  const problems = r.bad();
  if (problems.length) {
    failed++;
    console.error(`❌ ${r.id} ${r.text}`);
    problems.forEach((p) => console.error("     " + p));
  } else console.log(`✅ ${r.id} ${r.text}`);
}
console.log("ℹ️  PRD 3~9는 페이즈 5에서 사람이 O/X로 확인");
if (failed) process.exit(1);
console.log("✅ rules 통과");
