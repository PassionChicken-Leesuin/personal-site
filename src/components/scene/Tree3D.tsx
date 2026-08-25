"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "./geometry";
import type { SceneColors } from "./useThemeColors";

/**
 * 섬 위의 나무. 2D 나무와 같은 은유를 3D 로 옮긴 것 —
 * 줄기 하나에 잎덩어리가 몇 개 얹힌 형태.
 *
 * 잎은 바람에 아주 미세하게 흔들린다. 정지한 나무는 죽은 것처럼 보인다.
 */
export default function Tree3D({
  colors,
  detail,
  animate,
}: {
  colors: SceneColors;
  detail: "low" | "high";
  animate: boolean;
}) {
  const canopy = useRef<THREE.Group>(null);
  const seg = detail === "high" ? 7 : 5;

  const blobs = useMemo(() => {
    const rand = mulberry32(41);
    const count = detail === "high" ? 5 : 3;
    return Array.from({ length: count }, (_, i) => ({
      pos: [
        (rand() - 0.5) * 0.85,
        1.55 + i * 0.16 + rand() * 0.3,
        (rand() - 0.5) * 0.85,
      ] as [number, number, number],
      scale: 0.42 + rand() * 0.34,
    }));
  }, [detail]);

  useFrame(({ clock }) => {
    if (!canopy.current || !animate) return;
    const t = clock.elapsedTime;
    // 아주 약한 흔들림. 크게 주면 나무가 아니라 젤리가 된다.
    canopy.current.rotation.z = Math.sin(t * 0.5) * 0.035;
    canopy.current.rotation.x = Math.cos(t * 0.37) * 0.025;
  });

  return (
    <group position={[0, 0.2, 0]}>
      {/* 줄기 — 아래가 굵고 위가 가늘다 */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.17, 1.7, seg]} />
        <meshStandardMaterial
          color={colors.barkSurface}
          flatShading
          roughness={0.95}
        />
      </mesh>

      <group ref={canopy}>
        {blobs.map((b, i) => (
          <mesh key={i} position={b.pos} scale={b.scale} castShadow>
            <icosahedronGeometry args={[1, detail === "high" ? 1 : 0]} />
            <meshStandardMaterial
              color={colors.leafSurface}
              flatShading
              roughness={0.9}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
