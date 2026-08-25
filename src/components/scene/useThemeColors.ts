"use client";

import { useSyncExternalStore } from "react";

/**
 * globals.css 의 디자인 토큰을 three 로 넘긴다.
 *
 * 3D 에 색을 따로 정의하지 않는 이유: 팔레트가 두 벌이 되면 반드시 어긋난다.
 * CSS 변수를 읽어 쓰면 다크모드 전환이 저절로 따라오고, 색을 바꿀 곳도 한 군데다.
 *
 * 빌드가 rgba() 를 8자리 hex 로 바꾸는 경우가 있어 6자리로 정규화한다 —
 * three 의 Color 는 알파를 모른다. 투명도는 머티리얼 쪽에서 준다.
 */

export type SceneColors = {
  ink: string;
  canvas: string;
  hairline: string;
  muted: string;
};

const FALLBACK: SceneColors = {
  ink: "#1c1b17",
  canvas: "#f2f0ea",
  hairline: "#d3cfc3",
  muted: "#6b6659",
};

function normalize(v: string, fallback: string): string {
  const s = v.trim();
  if (/^#[0-9a-f]{6}$/i.test(s)) return s;
  if (/^#[0-9a-f]{8}$/i.test(s)) return s.slice(0, 7);
  if (/^#[0-9a-f]{3}$/i.test(s)) {
    return "#" + [1, 2, 3].map((i) => s[i] + s[i]).join("");
  }
  const rgb = s.match(/rgba?\(([^)]+)\)/i);
  if (rgb) {
    const [r, g, b] = rgb[1]
      .split(/[\s,/]+/)
      .slice(0, 3)
      .map((n) => Math.max(0, Math.min(255, Math.round(parseFloat(n)))));
    if ([r, g, b].every((n) => Number.isFinite(n))) {
      return (
        "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")
      );
    }
  }
  return fallback;
}

function read(): SceneColors {
  const s = getComputedStyle(document.documentElement);
  const get = (name: keyof SceneColors) =>
    normalize(s.getPropertyValue(`--${name}`), FALLBACK[name]);
  return {
    ink: get("ink"),
    canvas: get("canvas"),
    hairline: get("hairline"),
    muted: get("muted"),
  };
}

/**
 * 읽은 값을 캐시한다. useSyncExternalStore 의 getSnapshot 은 렌더마다
 * 불리는데, 매번 새 객체를 돌려주면 참조가 달라져 무한 루프가 된다.
 */
let cache: SceneColors | null = null;
let scheme = "";

function getSnapshot(): SceneColors {
  const now = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  if (!cache || scheme !== now) {
    scheme = now;
    cache = read();
  }
  return cache;
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => {
    cache = null; // 다음 스냅샷에서 새 팔레트를 읽는다
    onChange();
  };
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}

export function useThemeColors(): SceneColors {
  return useSyncExternalStore(subscribe, getSnapshot, () => FALLBACK);
}
