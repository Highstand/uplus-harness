import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// docs/tokens.json typography/font-family = "Pretendard Variable" (pretendard 패키지의 가변 글꼴 파일을 자체 호스팅)
const pretendard = localFont({
  src: "../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-pretendard",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = {
  title: "요금제 찾기",
  description: "무제한 유형과 매달 내는 돈을 비교해 보세요.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="bg-bg-default text-text-primary">
        {/* 390 × 844 모바일 기준: 넓은 화면에서는 390px 폭으로 가운데 정렬 */}
        <div className="relative mx-auto flex min-h-dvh w-full max-w-[390px] flex-col bg-bg-default">{children}</div>
      </body>
    </html>
  );
}
