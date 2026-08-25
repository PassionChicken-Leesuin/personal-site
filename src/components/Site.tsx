"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Hello from "./Hello";
import Frame from "./Frame";
import TopNav from "./TopNav";
import ScrollProgress from "./ScrollProgress";
import Intro from "./sections/Intro";
import Work from "./sections/Work";
import Awards from "./sections/Awards";
import Teaching from "./sections/Teaching";
import Journey from "./sections/Journey";
import Social from "./sections/Social";
import Contact from "./sections/Contact";
import { isView, type Stage, type View } from "./views";

// three 는 SSR 이 불가능하다. 첫 페인트 이후에 붙는다 —
// HELLO 와 내비게이션은 3D 와 무관하게 즉시 뜬다.
const Scene = dynamic(() => import("./scene/Scene"), { ssr: false });

/** 게이트가 걷히는 데 걸리는 시간. globals.css 의 gate-out 과 맞춰 둔다. */
const GATE_OUT_MS = 620;

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

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type HistoryState = { entered?: boolean; view?: unknown };

export default function Site() {
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [view, setView] = useState<View>("home");
  const [active, setActive] = useState(true);
  const gateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show3d = useSyncExternalStore(
    noopSubscribe,
    webglAvailable,
    () => false, // 서버에서는 3D 를 그리지 않는다
  );

  /**
   * 주소는 '/' 하나로 두기로 했다. 그렇다고 뒤로가기가 사이트를 나가버리면
   * 곤란하다 — 같은 URL 로 pushState 하면 주소는 그대로 두고 히스토리 항목만
   * 쌓여서, 뒤로가기가 이전 화면(끝내는 HELLO)으로 돌아온다.
   */
  const push = useCallback((next: View) => {
    window.history.pushState({ entered: true, view: next }, "", window.location.href);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  /** 게이트를 열고 들어간다. 상단 내비를 게이트에서 바로 눌러도 여기로 온다. */
  const enter = useCallback(
    (next: View) => {
      setView(next);
      push(next);

      if (prefersReducedMotion()) {
        setEntered(true);
        return;
      }
      setLeaving(true);
      if (gateTimer.current) clearTimeout(gateTimer.current);
      gateTimer.current = setTimeout(() => setEntered(true), GATE_OUT_MS);
    },
    [push],
  );

  /** 들어온 뒤의 화면 전환. */
  const go = useCallback(
    (next: View) => {
      if (!entered) {
        enter(next);
        return;
      }
      setView((prev) => {
        if (prev === next) return prev;
        push(next);
        return next;
      });
    },
    [entered, enter, push],
  );

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = (e.state ?? null) as HistoryState | null;

      // 최초 항목에는 state 가 없다 — 거기가 게이트다.
      if (!s?.entered) {
        if (gateTimer.current) clearTimeout(gateTimer.current);
        setLeaving(false);
        setEntered(false);
        setView("home");
      } else {
        setEntered(true);
        setLeaving(false);
        setView(isView(s.view) ? s.view : "home");
      }
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      if (gateTimer.current) clearTimeout(gateTimer.current);
    };
  }, []);

  // 탭이 숨겨지면 렌더 루프를 멈춘다. 씬이 화면 전체에 고정돼 있으므로
  // 스크롤로 화면을 벗어나는 일은 없다.
  useEffect(() => {
    if (!show3d) return;
    const sync = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [show3d]);

  const stage: Stage = entered ? view : "hello";

  return (
    <>
      {entered && <ScrollProgress />}

      {show3d && (
        <>
          <div className="scene-layer">
            <Scene onNavigate={go} active={active} stage={stage} />
          </div>
          {/* 선으로 그린 배경 위에서도 글이 읽히도록 */}
          <div className="scene-scrim" data-view={stage} aria-hidden="true" />
        </>
      )}

      {/* DOM 순서 = 탭 순서다. 게이트에서 첫 번째로 닿아야 하는 것은
          HELLO 이므로 크롬보다 앞에 둔다 — 화면 배치는 z-index 가 맡는다. */}
      {!entered && <Hello onEnter={() => enter("home")} leaving={leaving} />}

      <TopNav view={view} onChange={go} />

      {entered && (
        // pointer-events-none — main 의 빈 영역이 캔버스를 덮어 노드 클릭을
        // 가로챈다. 실제로 누를 것이 있는 섹션 화면에서만 .view-enter 가 켠다.
        <main className="pointer-events-none relative z-10 mx-auto w-full max-w-3xl px-8 pb-28 sm:px-14">
          {/* key — 화면이 바뀔 때마다 다시 마운트돼 Reveal 이 새로 재생된다 */}
          <div key={view} className="view-enter" data-home={view === "home"}>
            {view === "home" && <Intro />}
            {view === "work" && <Work />}
            {view === "awards" && <Awards />}
            {view === "teaching" && <Teaching />}
            {view === "journey" && <Journey />}
            {view === "social" && <Social />}
            {view === "contact" && <Contact />}
          </div>
        </main>
      )}

      {/* 가장자리 괘선과 구석 연락처 — 보조 수단이라 본문 뒤에 둔다 */}
      <Frame />
    </>
  );
}
