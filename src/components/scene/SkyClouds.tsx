"use client";

import { Cloud, Clouds } from "@react-three/drei";
import * as THREE from "three";
import type { SceneColors } from "./useThemeColors";

/**
 * 섬 주위를 떠다니는 볼류메트릭 구름.
 * 2D 히어로의 구름층을 3D 로 이어받는 것이라 사이트 전체가 같은 하늘 아래 있게 된다.
 *
 * segments 를 올리면 금방 무거워진다. 좁은 화면에서는 개수와 밀도를 함께 줄인다.
 */
export default function SkyClouds({
  colors,
  detail,
  animate,
}: {
  colors: SceneColors;
  detail: "low" | "high";
  animate: boolean;
}) {
  const high = detail === "high";
  const seg = high ? 26 : 12;
  const speed = animate ? 0.12 : 0;

  return (
    <Clouds material={THREE.MeshBasicMaterial} limit={high ? 220 : 100}>
      <Cloud
        seed={2}
        segments={seg}
        bounds={[9, 1.6, 4]}
        volume={7}
        opacity={0.42}
        color={colors.cloud}
        position={[-2.5, -3.4, -3]}
        speed={speed}
        growth={3}
      />
      <Cloud
        seed={5}
        segments={seg}
        bounds={[7, 1.2, 3]}
        volume={5.5}
        opacity={0.3}
        color={colors.cloud}
        position={[4, 2.6, -6]}
        speed={speed * 0.8}
        growth={2.4}
      />
      {high && (
        <Cloud
          seed={11}
          segments={seg}
          bounds={[6, 1, 3]}
          volume={4.5}
          opacity={0.24}
          color={colors.cloud}
          position={[-5, 3.2, -5]}
          speed={speed * 1.3}
          growth={2}
        />
      )}
    </Clouds>
  );
}
