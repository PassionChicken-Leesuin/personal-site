"use client";

import { useEffect, useRef } from "react";

/**
 * 포인터 쪽으로 살짝 끌려오는 래퍼.
 *
 * ui-ux-pro-max 의 motion.csv (Hover Micro-interaction / Complex) 제약을 따른다:
 *   - 당김 강도를 클램프해 요소가 자기 히트박스를 벗어나지 않게 한다
 *   - 화면당 1~2개 focal 요소에만 — 목록에서는 포인터가 올라간 하나만 반응하므로 실질 1개
 *   - 이름 붙인 핸들러를 유지해 removeEventListener 가 같은 함수를 지우도록 한다
 *   - 포인터가 없는 기기와 동작 줄이기에서는 리스너를 아예 붙이지 않는다
 */
const STRENGTH = 0.16;
const MAX = 8; // px

export default function Magnetic({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 마우스가 없는 기기(터치)나 동작 줄이기에서는 붙이지 않는다.
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!canHover.matches || reduced.matches) return;

    const clamp = (v: number) => Math.max(-MAX, Math.min(MAX, v));

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate3d(${clamp(dx * STRENGTH)}px, ${clamp(dy * STRENGTH)}px, 0)`;
    };

    const onEnter = () => {
      el.style.willChange = "transform";
    };

    const onLeave = () => {
      el.style.transform = "";
      // 스크롤이 멎은 뒤 GPU 메모리를 돌려준다
      el.style.willChange = "";
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)" }}
    >
      {children}
    </div>
  );
}
