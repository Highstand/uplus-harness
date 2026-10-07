#!/usr/bin/env node
// 화면 수 = 라우트 수 판정
//   node checks/routes.mjs        ① screens.md "## " 수와 라우트 ② harness/02-pages.md와 1:1 일치 ③ app/에 목록 밖 라우트 없음
//   node checks/routes.mjs --all  ④ 위 + app/에 모든 화면의 page 파일이 있음 (페이즈 5)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseScreens } from "./lib/screens.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const all = process.argv.includes("--all");
const errors = [];
const info = [];

function appRoutes() {
  const found = [];
  const walk = (dir, segs) => {
    const abs = path.join(root, dir);
    if (!fs.existsSync(abs)) return;
    for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
      if (e.isDirectory()) {
        const n = e.name;
        if (n.startsWith("_") || n.startsWith("@")) continue;
        if (/^\(.*\)$/.test(n)) walk(path.join(dir, n), segs);
        else walk(path.join(dir, n), [...segs, n.replace(/^\[\.\.\.(.+)\]$/, ":$1*").replace(/^\[(.+)\]$/, ":$1")]);
      } else if (/^page\.(tsx|ts|jsx|js)$/.test(e.name)) {
        found.push({ route: "/" + segs.join("/"), file: path.join(dir, e.name) });
      }
    }
  };
  walk("app", []);
  return found;
}

const screensPath = path.join(root, "docs/screens.md");
const screens = parseScreens(fs.readFileSync(screensPath, "utf8"));
info.push(`screens.md "## " 개수 = ${screens.length}`);
for (const s of screens) if (!s.route) errors.push(`screens.md "${s.title}"에 ### 라우트 \`/경로\`가 없음`);
const routes = screens.map((s) => s.route).filter(Boolean);
if (new Set(routes).size !== routes.length) errors.push("screens.md에 같은 라우트가 2번 이상 있음");

const pagesPath = path.join(root, "harness/02-pages.md");
if (!fs.existsSync(pagesPath)) {
  errors.push("harness/02-pages.md 없음 (페이즈 2 미완료)");
} else {
  const pages = parseScreens(fs.readFileSync(pagesPath, "utf8"));
  info.push(`02-pages.md "## " 개수 = ${pages.length}`);
  if (pages.length !== screens.length) errors.push(`화면 수 불일치: screens.md ${screens.length}개 ≠ 02-pages.md ${pages.length}개`);
  screens.forEach((s, i) => {
    const p = pages[i];
    if (!p) return;
    if (p.title !== s.title) errors.push(`${i + 1}번째 화면 제목 불일치: "${s.title}" ≠ "${p.title}"`);
    if (p.route !== s.route) errors.push(`"${s.title}" 라우트 불일치: ${s.route} ≠ ${p.route ?? "(없음)"}`);
  });
}

const built = appRoutes();
for (const b of built) {
  if (!routes.includes(b.route)) errors.push(`목록에 없는 라우트: ${b.route} (${b.file})`);
}
const missing = routes.filter((r) => !built.some((b) => b.route === r));
info.push(`app/ 구현된 라우트 ${built.length}개 / 아직 없음: ${missing.length ? missing.join(", ") : "없음"}`);
if (all && missing.length) errors.push(`--all: 구현되지 않은 화면 ${missing.length}개 (${missing.join(", ")})`);

info.forEach((m) => console.log("ℹ️  " + m));
if (errors.length) {
  errors.forEach((m) => console.error("❌ " + m));
  process.exit(1);
}
console.log(`✅ routes 통과${all ? " (--all)" : ""}`);
