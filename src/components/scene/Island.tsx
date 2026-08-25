"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { jitter, mulberry32 } from "./geometry";
import type { SceneColors } from "./useThemeColors";

/**
 * 하늘에 뜬 저폴리 섬. 외부 에셋 없이 코드로만 만든다.
 *   상판  — 낮은 원기둥, 잎 색. 풀밭.
 *   아랫돌 — 뒤집힌 원뿔, 나무껍질 색을 어둡게. 뜯겨나온 바위.
 * 세그먼트를 적게 주고 flatShading 을 켜서 각진 면이 그대로 보이게 한다.
 */
export default function Island({
  colors,
  detail,
}: {
  colors: SceneColors;
  detail: "low" | "high";
}) {
  const seg = detail === "high" ? 11 : 8;

  const top = useMemo(
    () => jitter(new THREE.CylinderGeometry(2.15, 2.0, 0.45, seg, 1), 0.12, 7),
    [seg],
  );
  const rock = useMemo(
    () => jitter(new THREE.ConeGeometry(2.0, 3.6, seg, 2), 0.22, 13),
    [seg],
  );

  // 섬 주위를 함께 떠다니는 부스러기 바위들
  const debris = useMemo(() => {
    const rand = mulberry32(29);
    const count = detail === "high" ? 7 : 4;
    return Array.from({ length: count }, () => ({
      pos: [
        (rand() - 0.5) * 4.6,
        -1.8 - rand() * 2.2,
        (rand() - 0.5) * 4.6,
      ] as [number, number, number],
      scale: 0.12 + rand() * 0.22,
      rot: [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI] as [
        number,
        number,
        number,
      ],
    }));
  }, [detail]);

  return (
    <group>
      <mesh geometry={top} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={colors.leafSurface} flatShading roughness={0.95} />
      </mesh>

      {/* 뒤집힌 원뿔 — 섬 아래로 뻗은 바위 */}
      <mesh geometry={rock} position={[0, -2.0, 0]} rotation={[Math.PI, 0, 0]}>
        <meshStandardMaterial
          color={colors.barkSurface}
          flatShading
          roughness={1}
        />
      </mesh>

      {debris.map((d, i) => (
        <mesh key={i} position={d.pos} rotation={d.rot} scale={d.scale}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
          color={colors.barkSurface}
          flatShading
          roughness={1}
        />
        </mesh>
      ))}
    </group>
  );
}
