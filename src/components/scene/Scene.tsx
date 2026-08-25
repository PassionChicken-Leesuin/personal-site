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
import Island from "./Island";
import Tree3D from "./Tree3D";
import OrbitNodes, { type SectionNode } from "./OrbitNodes";
import SkyClouds from "./SkyClouds";
import { useThemeColors } from "./useThemeColors";
import type { View } from "../views";

// 기본 카메라 배치. 노드로 날아갔다가 여기로 되돌아온다.
const HOME_POS: [number, number, number] = [0, 2.6, 11];
const HOME_TARGET: [number, number, number] = [0, 0.2, 0];

type Place = { x: number; y: number; scale: number };

/**
 * 섬이 놓이는 자리.
 *
 * 홈에서는 크게 자리를 차지하고, 섹션을 볼 때는 작아져 구석으로 물러난다.
 * 좁은 화면은 좌우로 나눌 폭이 없어 위아래로 나눈다.
 */
function placement(narrow: boolean, view: View): Place {
  if (view === "home") {
    return narrow
      ? { x: 0, y: 2.45, scale: 0.46 }
      : { x: 3.3, y: 0, scale: 0.78 };
  }
  return narrow
    ? { x: 1.9, y: -3.5, scale: 0.24 }
    : { x: 5.4, y: -2.8, scale: 0.32 };
}

/** 섬 전체를 아주 느리게 돌린다 — 한 바퀴에 약 70초. */
function SlowSpin({
  children,
  animate,
}: {
  children: React.ReactNode;
  animate: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current && animate) ref.current.rotation.y += delta * 0.09;
  });
  return <group ref={ref}>{children}</group>;
}

/**
 * 목표 자리로 부드럽게 옮겨간다.
 *
 * 화면을 전환할 때 섬이 툭 순간이동하면 같은 섬이라는 느낌이 끊긴다.
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
  view,
}: {
  onNavigate: (id: View) => void;
  /** 탭이 숨겨지면 false — 렌더 루프를 멈춘다. */
  active: boolean;
  view: View;
}) {
  const colors = useThemeColors();
  const controls = useRef<React.ComponentRef<typeof CameraControls>>(null);
  const returnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [animate, setAnimate] = useState(true);
  const [detail, setDetail] = useState<"low" | "high">("high");
  const [canDrag, setCanDrag] = useState(false);
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const isNarrow = window.matchMedia("(max-width: 767px)");

    const sync = () => {
      setAnimate(!reduced.matches);
      setDetail(isNarrow.matches ? "low" : "high");
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

  const place = placement(narrow, view);
  const home = view === "home";

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
      <PerformanceMonitor
        onDecline={() => setDetail("low")}
        onIncline={() => setDetail("high")}
      />
      <AdaptiveDpr pixelated />

      {/* 부드럽게. 직사광을 세게 주면 저폴리 면의 대비가 과장돼
          사이트의 차분한 톤과 따로 논다. */}
      <hemisphereLight args={[colors.sky, colors.bark, 1.4]} />
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 8, 4]} intensity={0.75} />
      <directionalLight position={[-6, 2, -4]} intensity={0.35} color={colors.sky} />
      {/* 멀리 있는 것일수록 하늘색에 잠기게 — 씬이 배경에 앉는다 */}
      <fog attach="fog" args={[colors.canvas, 14, 34]} />

      <Placed place={place} animate={animate}>
        <Float
          speed={animate ? 1.1 : 0}
          rotationIntensity={animate ? 0.12 : 0}
          floatIntensity={animate ? 0.5 : 0}
        >
          <SlowSpin animate={animate}>
            <Island colors={colors} detail={detail} />
            <Tree3D colors={colors} detail={detail} animate={animate} />
          </SlowSpin>
        </Float>

        <OrbitNodes
          colors={colors}
          animate={animate}
          showLabels={home}
          onSelect={handleSelect}
        />
      </Placed>

      <SkyClouds colors={colors} detail={detail} animate={animate} />

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
