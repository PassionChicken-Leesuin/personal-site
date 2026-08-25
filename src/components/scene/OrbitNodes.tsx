"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useCursor } from "@react-three/drei";
import * as THREE from "three";
import { edgesOf } from "./geometry";
import type { SceneColors } from "./useThemeColors";

export type SectionNode = {
  id: string;
  label: string;
  radius: number;
  height: number;
  speed: number;
  phase: number;
};

export const NODES: SectionNode[] = [
  { id: "work", label: "Work", radius: 2.75, height: 1.85, speed: 0.16, phase: 0 },
  {
    id: "awards",
    label: "Awards",
    radius: 3.0,
    height: 0.75,
    speed: 0.13,
    phase: 1.05,
  },
  {
    id: "teaching",
    label: "Teaching",
    radius: 2.65,
    height: -0.35,
    speed: 0.15,
    phase: 2.1,
  },
  {
    id: "journey",
    label: "Journey",
    radius: 3.1,
    height: -1.4,
    speed: 0.11,
    phase: 3.15,
  },
  {
    id: "social",
    label: "Social",
    radius: 2.6,
    height: -2.3,
    speed: 0.18,
    phase: 4.2,
  },
  {
    id: "contact",
    label: "Contact",
    radius: 2.5,
    height: 2.45,
    speed: 0.2,
    phase: 5.25,
  },
];

/**
 * 표시 세 개가 같은 지오메트리를 공유한다. Structure 와 같은 이유로 수명은
 * 모듈이 갖는다 — StrictMode 의 이중 마운트에서 dispose 되지 않도록.
 */
let markerGeo: THREE.BufferGeometry | null = null;

function markerGeometry() {
  if (!markerGeo) markerGeo = edgesOf(new THREE.OctahedronGeometry(0.2));
  return markerGeo;
}

function Node({
  node,
  colors,
  geo,
  animate,
  showLabel,
  onSelect,
}: {
  node: SectionNode;
  colors: SceneColors;
  geo: THREE.BufferGeometry;
  animate: boolean;
  /** 도형이 구석으로 작아진 화면에서는 라벨이 어지럽다. */
  showLabel: boolean;
  onSelect: (node: SectionNode, world: THREE.Vector3) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const marker = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame(({ clock }, delta) => {
    const g = ref.current;
    if (!g) return;

    // 동작 줄이기에서는 시간을 흘리지 않는다 — 초기 위상에 멈춘 채로 보인다.
    const t = animate ? clock.elapsedTime : 0;
    const a = node.phase + t * node.speed;
    g.position.set(
      Math.cos(a) * node.radius,
      node.height + (animate ? Math.sin(t * 0.6 + node.phase) * 0.12 : 0),
      Math.sin(a) * node.radius,
    );

    const m = marker.current;
    if (!m) return;
    if (animate) m.rotation.y += delta * 0.5;
    // 커지고 작아지는 것도 끊기지 않게 — 프레임률과 무관한 감쇠
    const target = hovered ? 1.55 : 1;
    m.scale.setScalar(m.scale.x + (target - m.scale.x) * (1 - Math.pow(0.005, delta)));
  });

  return (
    <group ref={ref}>
      <group ref={marker}>
        {/* 표시는 선으로, 중심만 점 하나. 조명이 없으므로 둘 다 unlit 이다. */}
        <lineSegments geometry={geo}>
          <lineBasicMaterial
            color={colors.ink}
            transparent
            opacity={hovered ? 0.95 : 0.55}
            depthWrite={false}
          />
        </lineSegments>
        <mesh>
          <sphereGeometry args={[0.055, 10, 10]} />
          <meshBasicMaterial color={colors.ink} />
        </mesh>
      </group>

      {/* 클릭 판정은 따로, 넉넉하게. 공전하는 작은 표시를 정확히 맞히라고
          요구하면 인터랙션이 아니라 시험이 된다. */}
      <mesh
        visible={false}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          const world = new THREE.Vector3();
          ref.current?.getWorldPosition(world);
          onSelect(node, world);
        }}
      >
        <sphereGeometry args={[0.55, 12, 12]} />
      </mesh>

      {/* 라벨은 편의용 표시다. 진짜 내비게이션은 캔버스 밖의 상단 바가 맡는다. */}
      {/* pointerEvents none — 라벨이 클릭을 가로채면 노드를 누를 수 없다. */}
      {showLabel && (
        <Html
          center
          distanceFactor={9}
          zIndexRange={[10, 0]}
          prepend
          style={{ pointerEvents: "none" }}
        >
          <span className="node-label" data-hovered={hovered} aria-hidden="true">
            {node.label}
          </span>
        </Html>
      )}
    </group>
  );
}

export default function OrbitNodes({
  colors,
  animate,
  showLabels,
  onSelect,
}: {
  colors: SceneColors;
  animate: boolean;
  showLabels: boolean;
  onSelect: (node: SectionNode, world: THREE.Vector3) => void;
}) {
  const geo = markerGeometry();

  return (
    <group>
      {NODES.map((n) => (
        <Node
          key={n.id}
          node={n}
          colors={colors}
          geo={geo}
          animate={animate}
          showLabel={showLabels}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
