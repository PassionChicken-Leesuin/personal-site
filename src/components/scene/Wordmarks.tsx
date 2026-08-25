"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { teachingMarks, type Org } from "@/content";

/**
 * 출강한 기관 로고가 Teaching 화면의 좌우 여백에 떠 있다.
 *
 * 처음에는 Y축 궤도에 태워 앞뒤로 지나가게 했는데, 그러면 한 번에 한둘만
 * 보이고 나머지는 본문 뒤에 숨는다. 다섯이 늘 함께 보여야 해서 각자 자리를
 * 갖게 했다 — 대신 자리를 화면 좌표(NDC)로 잡고 매 프레임 월드 좌표로 푼다.
 * 월드 좌표에 고정하면 창 비율이 바뀔 때 본문 위로 올라온다.
 *
 * 떠 있는 느낌은 깊이가 만든다. 화면 위치는 그대로 둔 채 카메라와의 거리만
 * 아주 천천히 오가면 원근 때문에 크기가 숨 쉬듯 변한다.
 */

type Lane = {
  /** 본문 열 가장자리에서 여백 안쪽으로 얼마나 들어갈지 (0~1) */
  inset: number;
  side: -1 | 1;
  /** 화면 세로 위치 (NDC, +1 이 위) */
  y: number;
  depth: number;
  drift: number;
};

// 좌 3 · 우 2. 오른쪽 위는 내비 상자가, 오른쪽 아래는 작도가 쓰므로 비켜 둔다.
const LANES: Lane[] = [
  { inset: 0.34, side: -1, y: 0.5, depth: 10.4, drift: 0 },
  // 폭이 넓은 로고가 오는 자리라 너무 깊이 밀면 화면 끝에 붙는다
  { inset: 0.58, side: -1, y: -0.06, depth: 11.6, drift: 1.7 },
  { inset: 0.36, side: -1, y: -0.58, depth: 10.8, drift: 3.4 },
  // 오른쪽은 위를 내비 상자가, 아래를 작도가 쓴다. 그 사이에 둘을 넣는다.
  { inset: 0.35, side: 1, y: 0.3, depth: 11.2, drift: 5.1 },
  { inset: 0.56, side: 1, y: -0.05, depth: 10.6, drift: 2.5 },
];

/** 로고가 들어갈 최소 여백(px). 이보다 좁으면 본문을 침범한다. */
const MIN_MARGIN = 150;

type Column = { ndcEdge: number; margin: number };

/**
 * 본문 열의 실제 폭을 DOM 에서 읽는다.
 *
 * max-w-3xl 은 고정 폭이라 창이 좁아질수록 여백이 급격히 줄어든다. 상수로
 * 박아 두면 1600 에서 맞춘 자리가 1200 에서는 글자 위가 된다.
 */
function useColumn(): Column | null {
  const [col, setCol] = useState<Column | null>(null);

  useEffect(() => {
    const measure = () => {
      const main = document.querySelector("main");
      if (!main) return setCol(null);
      const r = main.getBoundingClientRect();
      const w = window.innerWidth;
      const margin = Math.min(r.left, w - r.right);
      if (margin < MIN_MARGIN) return setCol(null);
      setCol((prev) =>
        prev && Math.abs(prev.margin - margin) < 1 ? prev : { ndcEdge: (r.left / w) * 2 - 1, margin },
      );
    };

    measure();
    window.addEventListener("resize", measure);
    // 화면을 전환하면 main 이 통째로 다시 마운트된다
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  return col;
}

function Mark({
  org,
  lane,
  column,
  animate,
}: {
  org: Org;
  lane: Lane;
  column: Column;
  animate: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const local = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock, camera }) => {
    const g = group.current;
    if (!g) return;

    const cam = camera as THREE.PerspectiveCamera;
    const t = animate ? clock.elapsedTime : 0;

    // 본문 열 바깥으로 얼마나 나갈지. ndcEdge 는 왼쪽 가장자리라 음수다.
    const room = 1 + column.ndcEdge;
    const edge = lane.side < 0 ? column.ndcEdge : -column.ndcEdge;
    const x = edge + lane.side * room * lane.inset;

    // 아주 느린 표류. 자리를 못 박아 두면 죽은 그림이 된다.
    const nx = x + Math.sin(t * 0.11 + lane.drift) * 0.018;
    const ny = lane.y + Math.sin(t * 0.09 + lane.drift * 1.7) * 0.05;
    const dist = lane.depth + Math.sin(t * 0.07 + lane.drift) * 1.1;

    // NDC → 카메라 로컬 → 월드. 카메라가 기울어 있어도 화면 위치가 유지된다.
    const halfH = Math.tan(cam.fov * (Math.PI / 360)) * dist;
    const halfW = halfH * cam.aspect;
    local.set(nx * halfW, ny * halfH, -dist);
    g.position.copy(cam.localToWorld(local));
  });

  return (
    <group ref={group}>
      <Html
        center
        distanceFactor={12}
        zIndexRange={[6, 0]}
        prepend
        style={{ pointerEvents: "none" }}
      >
        <span className="wordmark" aria-hidden="true">
          {org.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="wordmark-logo" src={org.logo} alt="" />
          ) : (
            org.name
          )}
        </span>
      </Html>
    </group>
  );
}

export default function Wordmarks({ animate }: { animate: boolean }) {
  const column = useColumn();
  if (!column) return null; // 여백이 부족한 창에서는 띄우지 않는다

  return (
    <group>
      {teachingMarks.map((org, i) => (
        <Mark
          key={org.name}
          org={org}
          lane={LANES[i % LANES.length]}
          column={column}
          animate={animate}
        />
      ))}
    </group>
  );
}
