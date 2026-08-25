"use client";

import Mark from "./Mark";
import { VIEW_LABELS, type View } from "./views";

/**
 * 상단 크롬. 왼쪽 마크는 홈, 오른쪽 상자에서 섹션을 고른다.
 *
 * 링크가 아니라 버튼인 이유: 주소를 바꾸지 않고 화면만 전환하기로 했다.
 * 가지 않는 곳을 가리키는 <a href> 는 스크린리더에 거짓말이 된다.
 */
export default function TopNav({
  view,
  onChange,
}: {
  view: View;
  onChange: (v: View) => void;
}) {
  const items = Object.keys(VIEW_LABELS) as Array<keyof typeof VIEW_LABELS>;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30">
      <nav
        aria-label="사이트"
        className="flex items-start justify-between px-5 py-5 sm:px-8 sm:py-7"
      >
        <button
          type="button"
          onClick={() => onChange("home")}
          aria-label="홈"
          aria-current={view === "home" ? "page" : undefined}
          className="pointer-events-auto cursor-pointer text-ink opacity-80 transition-opacity duration-300 hover:opacity-100"
        >
          <Mark className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>

        {/* 도면의 표제란 — 얇은 테두리 안에 항목을 쌓고 괘선으로 나눈다.
            좁은 화면에서는 두 열로 접는다. 섹션이 여섯이 되면서 한 줄로
            쌓으면 상자가 본문 첫 줄까지 내려와 덮었다. */}
        <ul className="pointer-events-auto grid grid-cols-2 border border-hairline bg-[color-mix(in_oklab,var(--canvas)_72%,transparent)] backdrop-blur-[2px] sm:grid-cols-1">
          {items.map((key, i) => (
            <li
              key={key}
              className={[
                "border-hairline-soft",
                i % 2 === 1 ? "border-l" : "",
                i >= 2 ? "border-t" : "",
                "sm:border-l-0",
                i > 0 ? "sm:border-t" : "sm:border-t-0",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => onChange(key)}
                aria-current={view === key ? "page" : undefined}
                data-active={view === key}
                className="label block w-full cursor-pointer px-4 py-2.5 text-center transition-colors duration-300 hover:text-ink data-[active=true]:text-ink sm:px-5"
              >
                {VIEW_LABELS[key]}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
