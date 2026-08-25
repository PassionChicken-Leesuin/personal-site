"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { circleOutline, edgesOf, rectOutline } from "./geometry";
import type { SceneColors } from "./useThemeColors";

/**
 * 화면 한가운데 떠 있는 작도(作圖).
 *
 * 정육면체·팔면체·원·사각틀이 서로 다른 속도로 돌면서 겹친다. 어느 한 순간도
 * 같은 그림이 아니지만 어느 순간을 잘라도 도면처럼 보이도록, 축은 전부
 * 아주 느리게만 돌린다 — 한 바퀴에 1분에서 3분.
 */

/**
 * 도형 한 벌을 모듈 수준에서 만들어 공유한다.
 *
 * 컴포넌트 안에서 만들고 unmount 에 dispose 하면 개발 모드의 StrictMode
 * 이중 마운트에서 첫 번째 정리가 memo 된 지오메트리를 버리고, 두 번째 마운트가
 * 이미 버려진 것을 그린다 — 화면에 아무것도 나오지 않는다. 어차피 모양이
 * 고정된 도형이고 씬은 페이지 수명 내내 떠 있으므로, 수명을 모듈에 맡긴다.
 */
let shared: Record<string, THREE.BufferGeometry> | null = null;

function geometries() {
  if (!shared) {
    shared = {
      cube: edgesOf(new THREE.BoxGeometry(3.4, 3.4, 3.4)),
      innerCube: edgesOf(new THREE.BoxGeometry(2.05, 2.05, 2.05)),
      octa: edgesOf(new THREE.OctahedronGeometry(2.75)),
      tetra: edgesOf(new THREE.TetrahedronGeometry(1.25)),
      ring: circleOutline(2.5),
      ringInner: circleOutline(1.62),
      tall: rectOutline(1.15, 3.7),
      wide: rectOutline(4.1, 1.35),
    };
  }
  return shared;
}

type SpinRate = [number, number, number];

function Spin({
  rate,
  animate,
  tilt,
  at,
  children,
}: {
  rate: SpinRate;
  animate: boolean;
  tilt?: SpinRate;
  /** 도형이 놓이는 자리. 회전은 자기 중심에서 일어난다. */
  at?: SpinRate;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g || !animate) return;
    g.rotation.x += rate[0] * delta;
    g.rotation.y += rate[1] * delta;
    g.rotation.z += rate[2] * delta;
  });

  return (
    <group position={at}>
      <group ref={ref} rotation={tilt}>
        {children}
      </group>
    </group>
  );
}

export default function Structure({
  colors,
  animate,
  detail,
}: {
  colors: SceneColors;
  animate: boolean;
  /** 좁은 화면·저성능에서는 겹치는 선을 덜 그린다. */
  detail: "low" | "high";
}) {
  const geo = geometries();

  const dense = detail === "high";

  /** 선 하나. 굵기는 어차피 1px 로 고정이라 농도로만 위계를 만든다. */
  const stroke = (opacity: number) => (
    <lineBasicMaterial
      color={colors.ink}
      transparent
      opacity={opacity}
      // 선끼리 겹칠 때 그리는 순서에 따라 뒤엣것이 지워지는 것을 막는다
      depthWrite={false}
    />
  );

  return (
    <group>
      {/* 큰 상자는 오른쪽 뒤. 글자 뒤를 정면으로 가로지르지 않게 비켜 세운다. */}
      <Spin
        rate={[0, 0.05, 0]}
        animate={animate}
        tilt={[0.18, 0.5, 0.06]}
        at={[1.7, 0.15, -1.6]}
      >
        <lineSegments geometry={geo.cube}>{stroke(0.26)}</lineSegments>
      </Spin>

      {/* 작은 상자는 왼쪽 앞에서 반대로 돈다 */}
      <Spin
        rate={[0.012, -0.037, 0]}
        animate={animate}
        tilt={[0, 0.78, 0]}
        at={[-2.3, -0.7, 0.6]}
      >
        <lineSegments geometry={geo.innerCube}>{stroke(0.22)}</lineSegments>
      </Spin>

      {/* 팔면체 — 레퍼런스의 마름모 자리. 모서리가 열두 개뿐이라
          한가운데 두어도 글자를 뭉개지 않는다. */}
      <Spin
        rate={[0.008, 0.03, 0.012]}
        animate={animate}
        at={[-0.2, 0.4, -0.4]}
      >
        <lineSegments geometry={geo.octa}>{stroke(0.2)}</lineSegments>
      </Spin>

      <Spin
        rate={[0, 0.09, 0]}
        animate={animate}
        tilt={[0.34, 0, 0.2]}
        at={[2.9, -1.7, 1.1]}
      >
        <lineSegments geometry={geo.tetra}>{stroke(0.3)}</lineSegments>
      </Spin>

      <Spin
        rate={[0.021, 0, 0]}
        animate={animate}
        tilt={[1.15, 0.2, 0]}
        at={[-1.4, 1.0, -1.1]}
      >
        <lineLoop geometry={geo.ring}>{stroke(0.2)}</lineLoop>
      </Spin>

      {dense && (
        <>
          <Spin
            rate={[-0.016, 0.02, 0]}
            animate={animate}
            tilt={[0.9, -0.4, 0]}
            at={[2.4, 1.5, 0.3]}
          >
            <lineLoop geometry={geo.ringInner}>{stroke(0.16)}</lineLoop>
          </Spin>

          {/* 얇은 사각틀 둘 — 레퍼런스 배경의 겹친 직사각형 자리 */}
          <Spin
            rate={[0, 0.026, 0]}
            animate={animate}
            tilt={[0, 0.35, 0.05]}
            at={[-3.1, 0.5, -0.9]}
          >
            <lineLoop geometry={geo.tall}>{stroke(0.16)}</lineLoop>
          </Spin>

          <Spin
            rate={[0, -0.019, 0]}
            animate={animate}
            tilt={[0, -0.28, -0.04]}
            at={[0.9, -2.1, 0.5]}
          >
            <lineLoop geometry={geo.wide}>{stroke(0.16)}</lineLoop>
          </Spin>
        </>
      )}
    </group>
  );
}
