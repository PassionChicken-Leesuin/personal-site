"use client";

import { site } from "@/content";
import { VIEW_LABELS, type View } from "./views";

/**
 * 항상 떠 있는 상단 바. 이름을 누르면 홈, 오른쪽에서 섹션을 고른다.
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
  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <nav
        aria-label="사이트"
        className="mx-auto flex w-full max-w-3xl items-baseline justify-between gap-6 px-6 py-5 sm:px-8"
      >
        <button
          type="button"
          onClick={() => onChange("home")}
          aria-current={view === "home" ? "page" : undefined}
          className="cursor-pointer font-display text-base font-normal tracking-tight text-ink transition-colors duration-300 hover:text-bark-deep"
        >
          {site.name}
        </button>

        <ul className="flex flex-wrap gap-x-5 gap-y-2 sm:gap-x-7">
          {(Object.keys(VIEW_LABELS) as Array<keyof typeof VIEW_LABELS>).map(
            (key) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => onChange(key)}
                  aria-current={view === key ? "page" : undefined}
                  data-active={view === key}
                  className="cursor-pointer text-xs font-medium uppercase tracking-[0.18em] text-muted transition-colors duration-300 hover:text-bark-deep data-[active=true]:text-bark-deep"
                >
                  {VIEW_LABELS[key]}
                </button>
              </li>
            ),
          )}
        </ul>
      </nav>
    </header>
  );
}
