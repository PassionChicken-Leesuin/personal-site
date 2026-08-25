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

// 기본 카메라 배치. 노드로 날아갔다가 여기로 되돌아온다.
const HOME_POS: [number, number, number] = [0, 2.6, 11];

const HOME_TARGET: [number, number, number] = [0, 0.2, 0];

/**
 * 넓은 화면에서는 섬을 오른쪽으로 밀고 조금 줄인다. 왼쪽은 이름과 소개 텍스트
 * 자리다. 카메라 타깃을 옮기는 방법도 있지만, CameraControls 가 마운트 시점에
 * 준비돼 있지 않으면 setLookAt 이 조용히 무시돼 구도가 어긋난다.
 * 씬을 직접 옮기는 편이 결정적이다.
 */
const layout = (narrow: boolean) =>
  narrow
    ? // 좁은 화면은 좌우로 나눌 폭이 없다. 섬을 위로 올려 위아래로 나눈다.
      { x: 0, y: 2.45, scale: 0.46 }
    : { x: 3.3, y: 0, scale: 0.78 };

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

export default function Scene({
  onNavigate,
  active,
}: {
  onNavigate: (id: string) => void;
  /** 히어로가 화면 밖이거나 탭이 숨겨지면 false — 렌더 루프를 멈춘다. */
  active: boolean;
}) {
  const colors = useThemeColors();
  const controls = useRef<React.ComponentRef<typeof CameraControls>>(null);
  const returnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [animate, setAnimate] = useState(true);
  const [detail, setDetail] = useState<"low" | "high">("high");
  const [canDrag, setCanDrag] = useState(false);
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);
  const [narrow, setNarrow] = useState(false);
  const place = layout(narrow);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const narrow = window.matchMedia("(max-width: 767px)");

    const sync = () => {
      setAnimate(!reduced.matches);
      setDetail(narrow.matches ? "low" : "high");
      setNarrow(narrow.matches);
      // 터치 기기에서 드래그 회전을 켜면 페이지 스크롤을 가로챈다.
      setCanDrag(fine.matches);
      setDpr(narrow.matches ? [1, 1.5] : [1, 2]);
    };

    sync();
    reduced.addEventListener("change", sync);
    fine.addEventListener("change", sync);
    narrow.addEventListener("change", sync);
    return () => {
      reduced.removeEventListener("change", sync);
      fine.removeEventListener("change", sync);
      narrow.removeEventListener("change", sync);
      if (returnTimer.current) clearTimeout(returnTimer.current);
    };
  }, []);

  // 브레이크포인트가 바뀌면 구도를 다시 잡는다.
  /**
   * 노드 클릭 — 카메라가 그쪽으로 훅 다가갔다가 제자리로 돌아오고,
   * 그와 동시에 페이지가 해당 섹션으로 스크롤한다.
   * 카메라를 다 기다렸다 스크롤하면 굼뜨게 느껴진다.
   */
  const handleSelect = useCallback(
    (node: SectionNode, world: THREE.Vector3) => {
      onNavigate(node.id);

      if (!animate) return; // 동작 줄이기: 카메라는 가만히 둔다
      const c = controls.current;
      if (!c) return;

      const from = world.clone().multiplyScalar(1.7);
      from.y = world.y + 1.1;
      c.setLookAt(from.x, from.y, from.z, world.x, world.y, world.z, true);

      if (returnTimer.current) clearTimeout(returnTimer.current);
      returnTimer.current = setTimeout(() => {
        c.setLookAt(...HOME_POS, ...HOME_TARGET, true);
      }, 1400);
    },
    [animate, onNavigate],
  );

  return (
    <Canvas
      // 스크롤해서 Work 를 읽는 동안 GPU 가 계속 돌 이유가 없다.
      frameloop={active ? "always" : "never"}
      dpr={dpr}
      camera={{ position: HOME_POS, fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      // 캔버스는 장식이다. 내비게이션은 캔버스 밖의 실제 링크가 맡는다.
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

      <group position={[place.x, place.y, 0]} scale={place.scale}>
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

        <OrbitNodes colors={colors} animate={animate} onSelect={handleSelect} />
      </group>

      <SkyClouds colors={colors} detail={detail} animate={animate} />

      <CameraControls
        ref={controls}
        enabled={canDrag}
        // 확대·이동은 막는다. 구도가 깨지면 씬이 아니라 뷰어가 된다.
        dollySpeed={0}
        truckSpeed={0}
        minPolarAngle={Math.PI * 0.24}
        maxPolarAngle={Math.PI * 0.56}
      />
    </Canvas>
  );
}
