#!/usr/bin/env node
// PreToolUse(Write|Edit|MultiEdit) 훅
// ① 보호 경로(docs/ · reference/ · app/tokens.css) 수정 차단
// ② app·components·lib 코드에 hex 색 / 토큰 밖 임의 값이 들어가면 차단
// 차단 = exit 2 + stderr (Claude에게 이유가 전달된다)
import path from "node:path";
import { loadTokenSets, findViolations, isStyleTarget, toRel } from "../../checks/lib/style-rules.mjs";

const PROTECTED = ["docs/", "reference/", "app/tokens.css"];

const input = JSON.parse(await new Promise((r) => {
  let s = "";
  process.stdin.on("data", (d) => (s += d)).on("end", () => r(s || "{}"));
}));
const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const ti = input.tool_input ?? {};
if (!ti.file_path) process.exit(0);

const rel = toRel(root, path.resolve(input.cwd || root, ti.file_path));
if (rel.startsWith("..")) process.exit(0);

const hit = PROTECTED.find((p) => (p.endsWith("/") ? rel.startsWith(p) : rel === p));
if (hit) {
  const why = rel === "app/tokens.css" ? "자동 생성 파일이에요. node checks/gen-tokens.mjs로만 만들어요." : "읽기 전용 경로라 고칠 수 없어요.";
  console.error(`⛔ ${rel}: ${why}`);
  process.exit(2);
}

if (isStyleTarget(rel)) {
  const text = [ti.content, ti.new_string, ...(ti.edits ?? []).map((e) => e.new_string)].filter(Boolean).join("\n");
  const v = findViolations(text, loadTokenSets(root));
  if (v.length) {
    console.error(`⛔ ${rel}: 스타일 규칙 위반\n` + v.map((x) => "  - " + x).join("\n"));
    process.exit(2);
  }
}
process.exit(0);
