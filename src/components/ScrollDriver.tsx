"use client";

import { useEffect } from "react";

/**
 * 페이지 모션의 단일 진입점.
 *
 * requestAnimationFrame 으로 throttle 된 스크롤 리스너 "하나"가 :root 에
 * --scroll (0..1 문서 진행도) 을 쓰고, 상단 진행 괘선은 CSS 가 그 값을 직접
 * 읽어 처리한다. 컴포넌트마다 리스너를 붙이지 않는 게 핵심이다.
 */
export default function ScrollDriver() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = root.scrollHeight - window.innerHeight;
      root.style.setProperty(
        "--scroll",
        max > 0 ? String(Math.min(1, Math.max(0, window.scrollY / max))) : "0",
      );
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // 화면을 전환하면 본문이 통째로 바뀌지만 스크롤은 일어나지 않는다.
    // 문서 크기 변화를 보고 있으면 전환·폰트 로드가 모두 잡힌다.
    const ro = new ResizeObserver(onScroll);
    ro.observe(document.body);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
