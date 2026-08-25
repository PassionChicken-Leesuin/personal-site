"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Reveal from "@/components/Reveal";
import { site, skills } from "@/content";

// three 는 SSR 이 불가능하다. 첫 페인트 이후에 붙는다 —
// 이름과 소개 텍스트는 3D 와 무관하게 즉시 뜬다.
const Scene = dynamic(() => import("./scene/Scene"), { ssr: false });

const LINKS = [
  { id: "work", label: "Work" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];

/**
 * WebGL 컨텍스트를 실제로 만들어 본다. 실패하면 2D 히어로로 간다.
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

export default function Hero3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(true);
  const show3d = useSyncExternalStore(
    noopSubscribe,
    webglAvailable,
    () => false, // 서버에서는 3D 를 그리지 않는다
  );

  // 히어로가 화면 밖이거나 탭이 숨겨지면 렌더 루프를 멈춘다.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !show3d) return;

    let onScreen = true;
    const sync = () => setActive(onScreen && !document.hidden);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin: "120px" },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [show3d]);

  const navigate = useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }, []);

  return (
    <section
      ref={sectionRef}
      // 좁은 화면: 위는 섬, 아래는 글. 넓은 화면: 왼쪽 글, 오른쪽 섬.
      className="relative flex min-h-svh flex-col justify-end pb-16 pt-24 sm:justify-center sm:py-24"
    >
      {show3d && (
        <>
          <div className="hero-canvas">
            <Scene onNavigate={navigate} active={active} />
          </div>
          {/* 3D 배경 위에서도 글이 읽히도록 */}
          <div className="hero-scrim" aria-hidden="true" />
        </>
      )}

      {/* 3D 가 뜨든 안 뜨든 첫 화면은 이 텍스트만으로도 성립해야 한다. */}
      <div className="relative z-10 pointer-events-none">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
            {site.location}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-6 font-display text-6xl font-normal leading-[1.02] tracking-tight text-ink sm:text-8xl">
            {site.name}
          </h1>
        </Reveal>

        <Reveal delay={140}>
          <p className="mt-4 font-display text-xl italic text-bark-deep sm:text-2xl">
            {site.nameKo} · {site.role}
          </p>
        </Reveal>

        <Reveal delay={220}>
          <p className="mt-8 max-w-md text-sm leading-[1.75] text-body sm:text-base">
            {site.tagline}
          </p>
        </Reveal>

        <Reveal delay={280}>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {skills.map((s) => (
              <li
                key={s}
                className="text-xs font-medium uppercase tracking-[0.14em] text-muted"
              >
                {s}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* 공전 노드와 같은 목적지. 노드 클릭은 편의이고, 이 링크가 정식 경로다.
            키보드와 스크린리더는 여기로만 다닌다. */}
        <Reveal delay={340}>
          <nav
            aria-label="섹션 바로가기"
            className="pointer-events-auto mt-12 flex flex-wrap gap-x-8 gap-y-3"
          >
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className="cursor-pointer text-xs font-medium uppercase tracking-[0.18em] text-muted underline decoration-hairline underline-offset-8 transition-colors duration-300 hover:text-bark-deep hover:decoration-bark"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </Reveal>
      </div>
    </section>
  );
}
