// "## 제목" 섹션마다 "### 라우트" 아래 첫 `/경로`를 읽는다 (screens.md · 02-pages.md 공통 형식)
export function parseScreens(md) {
  const sections = md.split(/^## /m).slice(1);
  return sections.map((s) => {
    const title = s.split("\n")[0].trim();
    const after = s.split(/^### 라우트\s*$/m)[1] ?? "";
    const route = (after.split(/^### /m)[0].match(/`(\/[^`]*)`/) ?? [])[1] ?? null;
    return { title, route };
  });
}
