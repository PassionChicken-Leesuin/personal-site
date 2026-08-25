"use client";

import { useSyncExternalStore } from "react";

/**
 * globals.css 의 디자인 토큰을 three 머티리얼로 넘긴다.
 *
 * 3D 씬에 색을 따로 정의하지 않는 이유: 팔레트가 두 벌이 되면 반드시 어긋난다.
 * CSS 변수를 읽어 쓰면 다크모드 전환이 저절로 따라오고, 색을 바꿀 곳도 한 군데로 남는다.
 *
 * 빌드가 rgba() 를 8자리 hex 로 바꾸므로 알파를 떼어내고 6자리로 정규화한다.
 * three 의 Color 는 알파를 모른다.
 */

export type SceneColors = {
  bark: string;
  leaf: string;
  light: string;
  canvas: string;
  sky: string;
  ink: string;
  cloud: string;
  /** 3D 표면용. 아래 mix 설명 참고. */
  barkSurface: string;
  leafSurface: string;
};

const FALLBACK: SceneColors = {
  bark: "#b06a4e",
  leaf: "#4f9e73",
  light: "#e8a55a",
  canvas: "#e4eef7",
  sky: "#aed1ec",
  ink: "#0f1720",
  cloud: "#ffffff",
  barkSurface: "#bd8168",
  leafSurface: "#6cae8b",
};

/**
 * 두 색을 섞는다.
 *
 * 팔레트의 --bark / --leaf 는 밝은 바탕 위의 가는 2D 선을 기준으로 고른 색이다.
 * 같은 색을 3D 의 큰 면에 그대로 쓰면 훨씬 무겁고 채도 높게 읽혀서
 * 사이트의 차분한 톤과 따로 논다. 캔버스 색을 조금 섞어 눌러준다.
 */
function mix(a: string, b: string, t: number): string {
  const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.substr(i, 2), 16));
  const [ar, ag, ab] = hex(a);
  const [br, bg, bb] = hex(b);
  const ch = (x: number, y: number) =>
    Math.round(x + (y - x) * t)
      .toString(16)
      .padStart(2, "0");
  return `#${ch(ar, br)}${ch(ag, bg)}${ch(ab, bb)}`;
}

/** 8자리 hex 나 rgb() 를 six-digit hex 로. three 는 알파를 모른다. */
function normalize(raw: string, fallback: string): string {
  const v = raw.trim();
  if (!v) return fallback;

  if (v.startsWith("#")) {
    const h = v.slice(1);
    if (h.length === 8 || h.length === 6) return `#${h.slice(0, 6)}`;
    if (h.length === 4 || h.length === 3) {
      const p = h.slice(0, 3);
      return `#${p[0]}${p[0]}${p[1]}${p[1]}${p[2]}${p[2]}`;
    }
    return fallback;
  }

  const open = v.indexOf("(");
  if (open > -1) {
    const parts = v
      .slice(open + 1, v.lastIndexOf(")"))
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map(Number);
    if (parts.length >= 3 && parts.every((n) => Number.isFinite(n))) {
      const hex = parts
        .slice(0, 3)
        .map((n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0"))
        .join("");
      return `#${hex}`;
    }
  }
  return fallback;
}

function read(): SceneColors {
  if (typeof window === "undefined") return FALLBACK;
  const cs = getComputedStyle(document.documentElement);
  const get = (name: keyof SceneColors, varName: string) =>
    normalize(cs.getPropertyValue(varName), FALLBACK[name]);

  const bark = get("bark", "--bark");
  const leaf = get("leaf", "--leaf");
  const canvas = get("canvas", "--canvas");

  return {
    bark,
    leaf,
    light: get("light", "--light"),
    canvas,
    sky: get("sky", "--sky-top"),
    ink: get("ink", "--ink"),
    cloud: get("cloud", "--cloud-3d"),
    barkSurface: mix(bark, canvas, 0.22),
    leafSurface: mix(leaf, canvas, 0.26),
  };
}

/**
 * 외부 저장소(matchMedia + CSS 변수) 구독이므로 useSyncExternalStore 가 맞다.
 * effect 안에서 setState 를 부르면 렌더 한 번을 더 쓰고, 그 사이 한 프레임 동안
 * 폴백 색이 보인다.
 *
 * getSnapshot 은 참조가 안정적이어야 한다 — 매번 새 객체를 만들면 React 가
 * 변경으로 보고 무한히 다시 렌더한다. 그래서 값을 캐시하고 미디어 변경 때만 버린다.
 */
let cache: SceneColors | null = null;
const listeners = new Set<() => void>();
let mq: MediaQueryList | null = null;

function invalidate() {
  cache = null;
  listeners.forEach((l) => l());
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  if (!mq) {
    mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", invalidate);
  }
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0 && mq) {
      mq.removeEventListener("change", invalidate);
      mq = null;
    }
  };
}

function getSnapshot(): SceneColors {
  if (!cache) cache = read();
  return cache;
}

function getServerSnapshot(): SceneColors {
  return FALLBACK;
}

export function useThemeColors(): SceneColors {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
