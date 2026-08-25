"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  AdaptiveDpr,
  CameraControls,
  Float,
  PerformanceMonitor,
} from "@react-three/drei";
import * as THREE from "three";
import Structure from "./Structure";
import OrbitNodes, { type SectionNode } from "./OrbitNodes";
import Wordmarks from "./Wordmarks";
import { useThemeColors } from "./useThemeColors";
import type { Stage, View } from "../views";

// 기본 카메라 배치. 노드로 날아갔다가 여기로 되돌아온다.
const HOME_POS: [number, number, number] = [0, 2.2, 11];
const HOME_TARGET: [number, number, number] = [0, 0.2, 0];

type Place = { x: number; y: number; scale: number };

/**
 * 작도가 놓이는 자리.
 *
 * 게이트에서는 화면 한가운데에서 글자 뒤를 채우고, 홈으로 들어오면 옆으로
 * 비켜서고, 섹션을 읽을 때는 구석까지 물러난다. 좁은 화면은 좌우로 나눌 폭이
 * 없어 위아래로 나눈다.
 */
function placement(narrow: boolean, stage: Stage): Place {
  if (stage === "hello") {
    return narrow
      ? { x: 0, y: 0.2, scale: 0.48 }
      : { x: 0, y: 0.2, scale: 0.95 };
  }
  if (stage === "home") {
    // 도형이 흩어져 있어 폭을 넓게 쓴다. 본문 오른쪽 끝보다 더 밀어야
    // 선이 문단 위를 가로지르지 않는다.
    return narrow
      ? { x: 0, y: 2.45, scale: 0.4 }
      : { x: 4.0, y: -0.5, scale: 0.74 };
  }
  // 섹션마다 형태가 달라지므로 너무 작으면 그 차이가 안 보인다. 본문 열
  // 오른쪽 끝(월드 x 3.6 언저리)을 넘지 않는 선에서 최대한 키운다.
  return narrow
    ? { x: 1.7, y: -3.4, scale: 0.32 }
    : { x: 5.8, y: -1.9, scale: 0.5 };
}

/**
 * 목표 자리로 부드럽게 옮겨간다.
 *
 * 화면을 전환할 때 도형이 툭 순간이동하면 같은 도형이라는 느낌이 끊긴다.
 * 프레임마다 목표를 향해 일정 비율로 다가가되, 그 비율을 delta 기반으로
 * 계산해 프레임률이 달라져도 속도가 같게 한다.
 */
function Placed({
  place,
  animate,
  children,
}: {
  place: Place;
  animate: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    if (!animate) {
      g.position.set(place.x, place.y, 0);
      g.scale.setScalar(place.scale);
      return;
    }
    const k = 1 - Math.pow(0.006, delta);
    g.position.x += (place.x - g.position.x) * k;
    g.position.y += (place.y - g.position.y) * k;
    const s = g.scale.x + (place.scale - g.scale.x) * k;
    g.scale.setScalar(s);
  });

  return <group ref={ref}>{children}</group>;
}

export default function Scene({
  onNavigate,
  active,
  stage,
}: {
  onNavigate: (id: View) => void;
  /** 탭이 숨겨지면 false — 렌더 루프를 멈춘다. */
  active: boolean;
  stage: Stage;
}) {
  const colors = useThemeColors();
  const controls = useRef<React.ComponentRef<typeof CameraControls>>(null);
  const returnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [animate, setAnimate] = useState(true);
  const [canDrag, setCanDrag] = useState(false);
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const isNarrow = window.matchMedia("(max-width: 767px)");

    const sync = () => {
      setAnimate(!reduced.matches);
      setNarrow(isNarrow.matches);
      // 터치 기기에서 드래그 회전을 켜면 페이지 스크롤을 가로챈다.
      setCanDrag(fine.matches);
      setDpr(isNarrow.matches ? [1, 1.5] : [1, 2]);
    };

    sync();
    reduced.addEventListener("change", sync);
    fine.addEventListener("change", sync);
    isNarrow.addEventListener("change", sync);
    return () => {
      reduced.removeEventListener("change", sync);
      fine.removeEventListener("change", sync);
      isNarrow.removeEventListener("change", sync);
      if (returnTimer.current) clearTimeout(returnTimer.current);
    };
  }, []);

  /**
   * 노드 클릭 — 카메라가 그쪽으로 훅 다가갔다가 제자리로 돌아오고,
   * 그와 동시에 화면이 해당 섹션으로 바뀐다.
   */
  const handleSelect = useCallback(
    (node: SectionNode, world: THREE.Vector3) => {
      onNavigate(node.id as View);

      if (!animate) return; // 동작 줄이기: 카메라는 가만히 둔다
      const c = controls.current;
      if (!c) return;

      const from = world.clone().multiplyScalar(1.7);
      from.y = world.y + 1.1;
      c.setLookAt(from.x, from.y, from.z, world.x, world.y, world.z, true);

      if (returnTimer.current) clearTimeout(returnTimer.current);
      returnTimer.current = setTimeout(() => {
        c.setLookAt(...HOME_POS, ...HOME_TARGET, true);
      }, 1200);
    },
    [animate, onNavigate],
  );

  const place = placement(narrow, stage);
  const gate = stage === "hello";
  const home = stage === "home";

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={dpr}
      camera={{ position: HOME_POS, fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      // 캔버스는 장식이다. 내비게이션은 상단 바가 맡는다.
      aria-hidden="true"
      style={{ touchAction: "pan-y" }}
    >
      {/* 성능 신호만 갱신한다. 아래 AdaptiveDpr 가 그 값을 읽어 해상도를 낮춘다. */}
      <PerformanceMonitor />
      <AdaptiveDpr pixelated />

      {/* 조명이 하나도 없다 — 선으로만 그리므로 전부 unlit 이다.
          멀리 있는 선일수록 용지색에 잠겨, 겹친 선이 뭉치지 않는다. */}
      <fog attach="fog" args={[colors.canvas, 12, 30]} />

      <Placed place={place} animate={animate}>
        <Float
          speed={animate ? 1 : 0}
          rotationIntensity={animate ? 0.1 : 0}
          floatIntensity={animate ? 0.45 : 0}
        >
          <Structure colors={colors} animate={animate} stage={stage} />
        </Float>

        {/* 게이트에서는 누를 것이 HELLO 하나뿐이어야 한다 */}
        {!gate && (
          <OrbitNodes
            colors={colors}
            animate={animate}
            showLabels={home && !narrow}
            onSelect={handleSelect}
          />
        )}
      </Placed>

      {/* 출강 기관 이름 — Teaching 화면에서만. Placed 바깥에 두어 구석으로
          물러난 작도와 달리 화면 전체를 쓴다. 좁은 화면에서는 글이 지면을
          다 쓰므로 띄우지 않는다. */}
      {stage === "teaching" && !narrow && <Wordmarks animate={animate} />}

      <CameraControls
        ref={controls}
        enabled={canDrag && home}
        // 확대·이동은 막는다. 구도가 깨지면 씬이 아니라 뷰어가 된다.
        dollySpeed={0}
        truckSpeed={0}
        minPolarAngle={Math.PI * 0.24}
        maxPolarAngle={Math.PI * 0.56}
      />
    </Canvas>
  );
}
