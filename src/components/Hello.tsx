"use client";

import { site } from "@/content";

/**
 * 첫 화면. 글자 하나만 놓고 나머지는 전부 비운다.
 *
 * HELLO 자체가 버튼이다 — 따로 둔 진입 버튼보다 의도가 분명하고,
 * <button> 이므로 Enter/Space 와 포커스 링이 저절로 따라온다.
 */
export default function Hello({
  onEnter,
  leaving,
}: {
  onEnter: () => void;
  leaving: boolean;
}) {
  return (
    <div className="gate" data-leaving={leaving}>
      <div className="flex flex-col items-center px-6">
        <button
          type="button"
          onClick={onEnter}
          className="gate-word"
          aria-label={`들어가기 — ${site.name} 소개`}
        >
          HELLO
        </button>

        {/* 안내는 한 번만, 작게. 큰 글자가 이미 눌러 달라고 말하고 있다. */}
        <p className="gate-hint label" aria-hidden="true">
          Click to enter
        </p>
      </div>
    </div>
  );
}
