"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SEGMENTS, shapes } from "./shapes";
import type { SceneColors } from "./useThemeColors";
import type { Stage } from "../views";

/**
 * 화면 한가운데 떠 있는 작도. 화면을 바꾸면 그 화면의 형태로 다시 조립된다.
 *
 * 형태마다 컴포넌트를 따로 두지 않는다. 선분 한 벌(SEGMENTS 개)을 두고 정점을
 * 목표 위치로 옮길 뿐이다 — 지우고 새로 그리는 게 아니라 같은 선이 자리를
 * 옮기는 것이라, 눈에는 '흩어졌다 다시 모이는' 것으로 읽힌다.
 *
 * 중간에 한 번 부풀렸다 오므리는 것이 핵심이다. 곧장 목표로 보간하면 형태가
 * 그냥 뭉개지며 바뀐다. 정점마다 정해진 방향으로 밀어 두었다가 되돌리면
 * 분해와 재조립처럼 보인다.
 *
 * 정점 버퍼는 매 프레임 고쳐 쓰는 값이라 전부 ref 에 둔다. React 는 렌더 결과가
 * 아닌 것을 ref 로 들라고 하고, 렌더 중에는 읽지 말라고 한다 — 그래서
 * 지오메트리도 JSX 가 아니라 이펙트에서 붙인다.
 */

const DURATION = 1.05; // 초
const BURST = 1.9; // 흩어지는 폭 (월드 단위)
const COUNT = SEGMENTS * 2;

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

type Buffers = {
  geometry: THREE.BufferGeometry;
  live: Float32Array;
  from: Float32Array;
  to: Float32Array;
  /** 정점마다 고정된 흩어짐 방향. 매번 새로 뽑으면 전환이 들쭉날쭉해진다. */
  dir: Float32Array;
  t: number;
};

function makeBuffers(start: Float32Array): Buffers {
  const dir = new Float32Array(COUNT * 3);
  let a = 0x9e3779b9;
  const rand = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = 0; i < COUNT; i++) {
    const th = Math.acos(2 * rand() - 1);
    const ph = rand() * Math.PI * 2;
    const m = 0.45 + rand() * 0.9;
    dir[i * 3] = Math.sin(th) * Math.cos(ph) * m;
    dir[i * 3 + 1] = Math.sin(th) * Math.sin(ph) * m;
    dir[i * 3 + 2] = Math.cos(th) * m;
  }

  const live = new Float32Array(start);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(live, 3));

  return { geometry, live, from: new Float32Array(start), to: new Float32Array(start), dir, t: 1 };
}

export default function Structure({
  colors,
  animate,
  stage,
}: {
  colors: SceneColors;
  animate: boolean;
  stage: Stage;
}) {
  const all = shapes();
  const spin = useRef<THREE.Group>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const buf = useRef<Buffers | null>(null);

  // 지오메트리를 붙인다. R3F 가 만들어 준 빈 것을 우리 버퍼로 갈아 끼운다.
  useEffect(() => {
    const b = (buf.current ??= makeBuffers(all[stage]));
    const l = lines.current;
    if (l && l.geometry !== b.geometry) {
      l.geometry.dispose();
      l.geometry = b.geometry;
    }
    return () => {
      b.geometry.dispose();
      buf.current = null;
    };
    // 마운트 때 한 번. 화면 전환은 아래 이펙트가 받는다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const b = buf.current;
    if (!b) return;
    const target = all[stage];

    if (!animate) {
      b.live.set(target);
      b.from.set(target);
      b.to.set(target);
      b.t = 1;
      b.geometry.attributes.position.needsUpdate = true;
      return;
    }

    b.from.set(b.live); // 지금 보이는 자리에서 출발한다
    b.to.set(target);
    b.t = 0;
  }, [stage, animate, all]);

  useFrame((_, delta) => {
    const g = spin.current;
    if (g && animate) {
      g.rotation.y += delta * 0.075;
      g.rotation.x = Math.sin(g.rotation.y * 0.4) * 0.1;
    }

    const b = buf.current;
    if (!b || b.t >= 1) return;

    b.t = Math.min(1, b.t + delta / DURATION);
    const e = easeInOut(b.t);
    // 가운데에서 가장 크게 부푼다
    const burst = Math.sin(Math.PI * b.t) * BURST;

    const { live, from, to, dir } = b;
    for (let i = 0; i < live.length; i++) {
      live[i] = from[i] + (to[i] - from[i]) * e + dir[i] * burst;
    }
    b.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={spin}>
      <lineSegments ref={lines}>
        <lineBasicMaterial
          color={colors.ink}
          transparent
          opacity={0.34}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
