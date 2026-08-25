"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useCursor } from "@react-three/drei";
import * as THREE from "three";
import type { SceneColors } from "./useThemeColors";

export type SectionNode = {
  id: string; // 스크롤 대상 엘리먼트 id
  label: string;
  radius: number;
  height: number;
  speed: number;
  phase: number;
};

export const NODES: SectionNode[] = [
  { id: "work", label: "Work", radius: 2.55, height: 1.9, speed: 0.16, phase: 0 },
  {
    id: "journey",
    label: "Journey",
    radius: 2.9,
    height: -0.5,
    speed: 0.11,
    phase: 2.2,
  },
  {
    id: "contact",
    label: "Contact",
    radius: 2.3,
    height: 2.9,
    speed: 0.2,
    phase: 4.3,
  },
];

function Node({
  node,
  colors,
  animate,
  onSelect,
}: {
  node: SectionNode;
  colors: SceneColors;
  animate: boolean;
  onSelect: (node: SectionNode, world: THREE.Vector3) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // 동작 줄이기에서는 시간을 흘리지 않는다 — 초기 위상에 멈춘 채로 보인다.
    const t = animate ? clock.elapsedTime : 0;
    const a = node.phase + t * node.speed;
    ref.current.position.set(
      Math.cos(a) * node.radius,
      node.height + (animate ? Math.sin(t * 0.6 + node.phase) * 0.12 : 0),
      Math.sin(a) * node.radius,
    );
  });

  return (
    <group ref={ref}>
      {/* 보이는 구슬. 작게 둬야 예쁘다. */}
      <mesh scale={hovered ? 1.5 : 1}>
        <icosahedronGeometry args={[0.19, 1]} />
        <meshStandardMaterial
          color={colors.light}
          emissive={colors.light}
          emissiveIntensity={hovered ? 1.6 : 0.75}
          roughness={0.4}
        />
      </mesh>

      {/* 클릭 판정은 따로, 넉넉하게. 공전하는 작은 구슬을 정확히 맞히라고
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
        <sphereGeometry args={[0.52, 12, 12]} />
      </mesh>

      {/* 라벨은 편의용 표시다. 진짜 내비게이션은 캔버스 밖의 <a> 링크가 맡는다. */}
      {/* pointerEvents none — 라벨이 클릭을 가로채면 노드를 누를 수 없다. */}
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
    </group>
  );
}

export default function OrbitNodes({
  colors,
  animate,
  onSelect,
}: {
  colors: SceneColors;
  animate: boolean;
  onSelect: (node: SectionNode, world: THREE.Vector3) => void;
}) {
  return (
    <group>
      {NODES.map((n) => (
        <Node
          key={n.id}
          node={n}
          colors={colors}
          animate={animate}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
