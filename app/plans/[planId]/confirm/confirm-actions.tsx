import type { ReactNode } from "react";

// 높이 = 위 테두리 1 + 위 12 + 버튼 52 + 사이 12 + 버튼 52 + 아래 32
const HEIGHT = "h-[161px]";

/**
 * 변경 전 확인 하단 세로 2버튼 (A8 — 화면 폴더 조합). BottomCTA와 같은 하단 고정 틀
 * (폭 390 · bg/surface · 위 1px border/subtle · 좌우 16 · 위 12 · 아래 32 · 버튼 사이 12).
 * children 순서: 위 Primary → 아래 Secondary (둘 다 전체 폭).
 */
export function ConfirmActions({ children }: { children: ReactNode }) {
  return (
    <div
      className={`fixed bottom-[0px] left-1/2 z-40 flex w-full max-w-[390px] -translate-x-1/2 flex-col gap-12 border-t border-border-subtle bg-bg-surface px-16 pt-12 pb-32 ${HEIGHT}`}
    >
      {children}
    </div>
  );
}

/** 하단 2버튼 높이만큼 본문 아래 빈 공간 */
export function ConfirmActionsSpacer() {
  return <div aria-hidden="true" className={`w-full shrink-0 ${HEIGHT}`} />;
}
