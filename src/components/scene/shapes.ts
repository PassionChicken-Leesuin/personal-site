import * as THREE from "three";
import type { Stage } from "../views";

/**
 * 화면마다 다른 작도.
 *
 * 형태를 컴포넌트로 따로 만들지 않고 "선분 목록" 한 벌로 통일한다. 모든 형태가
 * 같은 개수의 선분을 가지면, 화면을 바꿀 때 정점을 목표 위치로 옮기는 것만으로
 * 하나가 다른 하나로 변한다 — 지우고 새로 그리는 것이 아니라 같은 선이
 * 자리를 옮긴다. 그게 '재조립' 으로 읽히는 이유다.
 */

/** 모든 형태가 맞춰야 하는 선분 수. 부족하면 앞에서부터 되풀이해 채운다. */
export const SEGMENTS = 240;

/** 결정론적 난수. Math.random 을 쓰면 새로고침마다 형태가 달라진다. */
function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Out = number[];

function line(out: Out, a: THREE.Vector3, b: THREE.Vector3) {
  out.push(a.x, a.y, a.z, b.x, b.y, b.z);
}

/**
 * 솔리드의 모서리를 선분으로 옮긴다.
 * EdgesGeometry 의 position 은 이미 두 점씩 짝지어져 있으므로 그대로 읽으면 된다.
 */
function edges(out: Out, solid: THREE.BufferGeometry, m: THREE.Matrix4) {
  const geo = new THREE.EdgesGeometry(solid);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).applyMatrix4(m);
    out.push(v.x, v.y, v.z);
  }
  geo.dispose();
  solid.dispose();
}

function loop(out: Out, pts: THREE.Vector3[], m: THREE.Matrix4) {
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i].clone().applyMatrix4(m);
    const b = pts[(i + 1) % pts.length].clone().applyMatrix4(m);
    line(out, a, b);
  }
}

function circlePts(r: number, n: number) {
  return Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(t) * r, Math.sin(t) * r, 0);
  });
}

function at(x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1) {
  return new THREE.Matrix4().compose(
    new THREE.Vector3(x, y, z),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)),
    new THREE.Vector3(s, s, s),
  );
}

// ── 형태들 ─────────────────────────────────────────────────────

/** 홈·게이트 — 지금까지의 작도. 이 사이트의 기본 얼굴이다. */
function drafting(): Out {
  const o: Out = [];
  edges(o, new THREE.BoxGeometry(3.4, 3.4, 3.4), at(1.7, 0.15, -1.6, 0.18, 0.5, 0.06));
  edges(o, new THREE.BoxGeometry(2.05, 2.05, 2.05), at(-2.3, -0.7, 0.6, 0, 0.78, 0));
  edges(o, new THREE.OctahedronGeometry(2.75), at(-0.2, 0.4, -0.4));
  edges(o, new THREE.TetrahedronGeometry(1.25), at(2.9, -1.7, 1.1, 0.34, 0, 0.2));
  loop(o, circlePts(2.5, 40), at(-1.4, 1.0, -1.1, 1.15, 0.2, 0));
  loop(o, circlePts(1.62, 28), at(2.4, 1.5, 0.3, 0.9, -0.4, 0));
  loop(o, [
    new THREE.Vector3(-0.58, -1.85, 0), new THREE.Vector3(0.58, -1.85, 0),
    new THREE.Vector3(0.58, 1.85, 0), new THREE.Vector3(-0.58, 1.85, 0),
  ], at(-3.1, 0.5, -0.9, 0, 0.35, 0.05));
  return o;
}

/** Work — 구조물. 겹치고 파고드는 상자들. */
function boxes(): Out {
  const o: Out = [];
  const spec: [number, number, number, number, number][] = [
    [3.6, 0, 0, 0, 0.4],
    [2.6, 1.4, 0.9, -0.9, 0.9],
    [2.0, -1.7, -1.0, 0.7, 0.25],
    [1.3, 0.6, 1.9, 1.4, 1.2],
    [1.0, -1.2, 1.6, -1.6, 0.6],
  ];
  for (const [s, x, y, z, r] of spec) {
    edges(o, new THREE.BoxGeometry(s, s, s), at(x, y, z, r * 0.6, r, r * 0.3));
  }
  return o;
}

/** Awards — 방사. 한 점에서 뻗어 나가 고리에 닿는다. */
function radial(): Out {
  const o: Out = [];
  const rand = prng(7);
  for (let i = 0; i < 64; i++) {
    const th = Math.acos(2 * rand() - 1);
    const ph = rand() * Math.PI * 2;
    const d = new THREE.Vector3(
      Math.sin(th) * Math.cos(ph),
      Math.sin(th) * Math.sin(ph),
      Math.cos(th),
    );
    line(o, d.clone().multiplyScalar(0.7), d.clone().multiplyScalar(2.2 + rand() * 1.5));
  }
  loop(o, circlePts(3.1, 48), at(0, 0, 0, 1.2, 0.3, 0));
  loop(o, circlePts(2.3, 36), at(0, 0, 0, 0.5, -0.6, 0));
  return o;
}

/** Teaching — 격자. 강의실의 판, 도면의 방안지. */
function grid(): Out {
  const o: Out = [];
  const n = 9;
  const half = 2.7;
  // 너무 눕히면 판이 옆에서 보여 선 하나로 뭉갠다. 격자로 읽힐 만큼만 기울인다.
  const m = at(0, 0, 0, -0.52, 0.42, 0.08);
  for (let i = 0; i < n; i++) {
    const t = -half + (i / (n - 1)) * half * 2;
    line(o, new THREE.Vector3(-half, t, 0).applyMatrix4(m), new THREE.Vector3(half, t, 0).applyMatrix4(m));
    line(o, new THREE.Vector3(t, -half, 0).applyMatrix4(m), new THREE.Vector3(t, half, 0).applyMatrix4(m));
  }
  // 판 위에 뜬 상자 하나 — 격자만 있으면 평면으로만 읽힌다
  edges(o, new THREE.BoxGeometry(1.6, 1.6, 1.6), at(0.5, 1.9, 0.9, 0.3, 0.6, 0));
  return o;
}

/** Journey — 시간축. 깊이로 뻗고 눈금이 걸린다. */
function axis(): Out {
  const o: Out = [];
  const m = at(0, 0, 0, 0.1, 0.55, 0);
  line(o, new THREE.Vector3(0, 0, -4.5).applyMatrix4(m), new THREE.Vector3(0, 0, 4.5).applyMatrix4(m));
  const stops = 9;
  for (let i = 0; i < stops; i++) {
    const z = -4 + (i / (stops - 1)) * 8;
    const h = i % 2 === 0 ? 1.5 : 0.85;
    line(o, new THREE.Vector3(-h, 0, z).applyMatrix4(m), new THREE.Vector3(h, 0, z).applyMatrix4(m));
    line(o, new THREE.Vector3(0, -h * 0.6, z).applyMatrix4(m), new THREE.Vector3(0, h * 0.6, z).applyMatrix4(m));
    if (i % 2 === 0) {
      loop(o, circlePts(0.42, 12), at(0, 0, z, 0, 0, 0).premultiply(m));
    }
  }
  return o;
}

/** Social — 연결망. 점들이 가까운 것끼리 이어진다. */
function network(): Out {
  const o: Out = [];
  const rand = prng(19);
  const n = 16;
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < n; i++) {
    const th = Math.acos(2 * rand() - 1);
    const ph = rand() * Math.PI * 2;
    const r = 1.5 + rand() * 1.8;
    pts.push(new THREE.Vector3(
      Math.sin(th) * Math.cos(ph) * r,
      Math.sin(th) * Math.sin(ph) * r * 0.8,
      Math.cos(th) * r,
    ));
  }
  // 각 점에서 가장 가까운 셋과 잇는다
  for (let i = 0; i < n; i++) {
    const order = pts
      .map((p, j) => ({ j, d: p.distanceTo(pts[i]) }))
      .filter((x) => x.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3);
    for (const { j } of order) line(o, pts[i], pts[j]);
  }
  for (const p of pts) {
    edges(o, new THREE.OctahedronGeometry(0.26), at(p.x, p.y, p.z));
  }
  return o;
}

/** Contact — 수렴. 사방에서 한 점으로 모인다. */
function converge(): Out {
  const o: Out = [];
  const rand = prng(31);
  for (let i = 0; i < 84; i++) {
    const th = Math.acos(2 * rand() - 1);
    const ph = rand() * Math.PI * 2;
    const d = new THREE.Vector3(
      Math.sin(th) * Math.cos(ph),
      Math.sin(th) * Math.sin(ph),
      Math.cos(th),
    );
    line(o, d.clone().multiplyScalar(3.4), d.clone().multiplyScalar(0.55));
  }
  loop(o, circlePts(0.5, 20), at(0, 0, 0, 0.9, 0.4, 0));
  return o;
}

// ── 선분 수 맞추기 ─────────────────────────────────────────────

/**
 * 형태마다 나오는 선분 수가 다르다. 모핑하려면 전부 같아야 하므로,
 * 모자라면 앞에서부터 되풀이해 채우고 넘치면 고르게 솎아 낸다.
 * (겹쳐 그려지는 선분은 화면에서 구별되지 않는다.)
 */
function fit(src: Out): Float32Array {
  const have = src.length / 6;
  const out = new Float32Array(SEGMENTS * 6);
  for (let i = 0; i < SEGMENTS; i++) {
    const k = have <= SEGMENTS ? i % have : Math.floor((i * have) / SEGMENTS);
    out.set(src.slice(k * 6, k * 6 + 6), i * 6);
  }
  return out;
}

const BUILD: Record<Stage, () => Out> = {
  hello: drafting,
  home: drafting,
  work: boxes,
  awards: radial,
  teaching: grid,
  journey: axis,
  social: network,
  contact: converge,
};

let cache: Record<Stage, Float32Array> | null = null;

/** 형태 한 벌. 모듈 수명으로 한 번만 만든다. */
export function shapes(): Record<Stage, Float32Array> {
  if (!cache) {
    cache = {} as Record<Stage, Float32Array>;
    for (const k of Object.keys(BUILD) as Stage[]) cache[k] = fit(BUILD[k]());
  }
  return cache;
}
