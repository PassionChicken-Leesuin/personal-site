"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import TopNav from "./TopNav";
import ScrollProgress from "./ScrollProgress";
import Intro from "./sections/Intro";
import Work from "./sections/Work";
import Journey from "./sections/Journey";
import Contact from "./sections/Contact";
import { isView, type View } from "./views";

// three 는 SSR 이 불가능하다. 첫 페인트 이후에 붙는다 —
// 이름과 소개 텍스트는 3D 와 무관하게 즉시 뜬다.
const Scene = dynamic(() => import("./scene/Scene"), { ssr: false });

/**
 * WebGL 컨텍스트를 실제로 만들어 본다. 실패하면 3D 없이 글만 간다.
 * 한 번만 검사하고 캐시한다 — 컨텍스트 생성은 싸지 않다.
 */
let webglCache: boolean | null = null;
function webglAvailable(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const canvas = document.createElement("canvas");
    webglCache = !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    webglCache = false;
  }
  return webglCache;
}

// 기기 능력은 렌더 중에 바뀌지 않는다. 구독할 것이 없다.
const noopSubscribe = () => () => {};

export default function Site() {
  const [view, setView] = useState<View>("home");
  const [active, setActive] = useState(true);
  const pushed = useRef(false);

  const show3d = useSyncExternalStore(
    noopSubscribe,
    webglAvailable,
    () => false, // 서버에서는 3D 를 그리지 않는다
  );

  /**
   * 화면 전환.
   *
   * 주소는 바꾸지 않기로 했지만, 그렇다고 뒤로가기가 사이트를 나가버리면 곤란하다.
   * 같은 URL 로 pushState 하면 주소는 그대로 두고 히스토리 항목만 쌓인다 —
   * 뒤로가기가 이전 화면으로 돌아온다.
   */
  const go = useCallback((next: View) => {
    setView((prev) => {
      if (prev === next) return prev;
      window.history.pushState({ view: next }, "", window.location.href);
      pushed.current = true;
      window.scrollTo({ top: 0, behavior: "auto" });
      return next;
    });
  }, []);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const v = (e.state as { view?: unknown } | null)?.view;
      setView(isView(v) ? v : "home");
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // 탭이 숨겨지면 렌더 루프를 멈춘다. 씬이 화면 전체에 고정돼 있으므로
  // 스크롤로 화면을 벗어나는 일은 없다.
  useEffect(() => {
    if (!show3d) return;
    const sync = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [show3d]);

  return (
    <>
      <ScrollProgress />

      {show3d && (
        <>
          <div className="scene-layer">
            <Scene onNavigate={go} active={active} view={view} />
          </div>
          {/* 3D 배경 위에서도 글이 읽히도록 */}
          <div className="scene-scrim" data-view={view} aria-hidden="true" />
        </>
      )}

      <TopNav view={view} onChange={go} />

      {/* pointer-events-none — main 의 빈 영역이 캔버스를 덮어 노드 클릭을
            가로챈다. 실제로 누를 것이 있는 섹션 화면에서만 .view-enter 가
            다시 켠다. */}
      <main className="pointer-events-none relative z-10 mx-auto w-full max-w-3xl px-6 pb-24 sm:px-8">
        {/* key — 화면이 바뀔 때마다 다시 마운트돼 Reveal 이 새로 재생된다 */}
        <div
          key={view}
          className="view-enter"
          data-home={view === "home"}
        >
          {view === "home" && <Intro />}
          {view === "work" && <Work />}
          {view === "journey" && <Journey />}
          {view === "contact" && <Contact />}
        </div>
      </main>
    </>
  );
}
