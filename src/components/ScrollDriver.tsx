"use client";

import { useEffect } from "react";

/**
 * 페이지 전체 모션의 단일 진입점.
 *
 * requestAnimationFrame 으로 throttle 된 스크롤 리스너 "하나"가
 * :root 에 CSS 변수를 쓰고, 나머지 모션은 전부 CSS 가 그 변수를 읽어 처리한다.
 * 컴포넌트마다 리스너를 붙이지 않는 게 핵심 — 레이어 수가 늘어도 비용이 늘지 않는다.
 *
 *   --scroll  0..1  문서 전체 진행도 (안개 패럴랙스, 상단 진행 바)
 *   --tree    0..1  Journey 섹션 진행도 (나무 성장)
 */
export default function ScrollDriver() {
  useEffect(() => {
    const root = document.documentElement;

    // 동작 줄이기가 켜져 있으면 나무를 완성 상태로 두고 아무것도 구독하지 않는다.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) {
      root.style.setProperty("--tree", "1");
      return;
    }

    let frame = 0;
    let journey: HTMLElement | null = null;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;

      const max = document.documentElement.scrollHeight - vh;
      root.style.setProperty(
        "--scroll",
        max > 0 ? String(Math.min(1, Math.max(0, window.scrollY / max))) : "0",
      );

      // 화면을 전환하면 #journey 가 통째로 다시 마운트된다.
      // 끊어진 참조를 붙들고 있으면 나무가 자라지 않는다.
      if (!journey || !journey.isConnected) {
        journey = document.getElementById("journey");
      }
      if (journey) {
        const rect = journey.getBoundingClientRect();
        // 섹션 상단이 뷰포트 85% 지점에 닿을 때 0,
        // 섹션 하단이 그 지점을 지날 때 1.
        const p = (vh * 0.85 - rect.top) / Math.max(1, rect.height);
        root.style.setProperty("--tree", String(Math.min(1, Math.max(0, p))));
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // 폰트 로드로 레이아웃이 바뀌면 Journey 섹션 높이가 달라진다.
    const onResize = () => {
      journey = null;
      onScroll();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.fonts?.ready.then(onResize).catch(() => {});

    // 화면을 전환하면 본문이 통째로 바뀐다. 스크롤은 일어나지 않으므로
    // 이것만으로는 다시 계산할 계기가 없다 — 나무가 자라지 않은 채로 멎는다.
    // 문서 크기 변화를 보고 있으면 전환·폰트 로드·내용 변경이 모두 잡힌다.
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
