"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { teachingMarks, type Org } from "@/content";

/**
 * 출강한 기관 이름이 Teaching 화면의 배경을 천천히 돈다.
 *
 * 로고 이미지가 아니라 글자다. 남의 상표 이미지를 끌어다 쓰지 않아도 되고,
 * 무엇보다 이 사이트는 색을 쓰지 않는다 — 컬러 로고 여섯 개가 들어오면
 * 도면이 아니라 배너가 된다. 글자는 사이트의 잉크 한 색을 그대로 쓴다.
 *
 * Y축 궤도에 태워서 앞뒤로 지나가게 한다. 원근으로 크기가 달라지는 것이
 * 평면에서 흘리는 것보다 훨씬 '떠 있다'.
 */

type Orbit = {
  radius: number;
  height: number;
  speed: number;
  phase: number;
  opacity: number;
};

// 반지름과 높이를 서로 다르게 줘 한 평면에 줄 서지 않게 한다.
const ORBITS: Orbit[] = [
  { radius: 5.4, height: 2.4, speed: 0.055, phase: 0.0, opacity: 0.92 },
  { radius: 6.6, height: -1.1, speed: 0.041, phase: 1.05, opacity: 0.84 },
  { radius: 4.8, height: 0.9, speed: 0.066, phase: 2.1, opacity: 0.95 },
  { radius: 7.1, height: 2.9, speed: 0.035, phase: 3.15, opacity: 0.8 },
  { radius: 5.9, height: -2.6, speed: 0.05, phase: 4.2, opacity: 0.88 },
  { radius: 6.2, height: -0.2, speed: 0.045, phase: 5.25, opacity: 0.86 },
  { radius: 4.4, height: 3.4, speed: 0.06, phase: 2.7, opacity: 0.92 },
];

function Mark({
  org,
  orbit,
  animate,
}: {
  org: Org;
  orbit: Orbit;
  animate: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const el = useRef<HTMLSpanElement>(null);
  // 매 프레임 새 벡터를 만들면 GC 가 프레임마다 일한다. 한 개를 돌려 쓴다.
  const probe = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock, camera }) => {
    const g = group.current;
    if (!g) return;

    const t = animate ? clock.elapsedTime : 0;
    const a = orbit.phase + t * orbit.speed;
    g.position.set(
      Math.cos(a) * orbit.radius,
      orbit.height + (animate ? Math.sin(t * 0.35 + orbit.phase) * 0.22 : 0),
      Math.sin(a) * orbit.radius,
    );

    const span = el.current;
    if (!span) return;

    // Html 은 3D 가 아니라 DOM 이다. 어디에 찍힐지는 직접 투영해 봐야 안다.
    g.getWorldPosition(probe);
    probe.project(camera);

    // 카메라 뒤로 넘어간 점은 화면 엉뚱한 곳에 찍힌다.
    if (probe.z > 1) {
      span.style.opacity = "0";
      return;
    }

    // 본문은 화면 가운데 열을 쓴다. 표식이 그 위를 지나가면 글자와 섞이므로
    // 가운데로 들어올수록 옅어지게 한다 — 결과적으로 본문을 '돌아서' 지나간다.
    //
    // 가운데에서 0 으로 완전히 지우지는 않는다. 1440 폭에서 본문이 768 을 쓰면
    // 남는 여백이 양쪽 336 뿐이라, 완전히 지우면 다섯 개가 동시에 사라지는
    // 순간이 생긴다. 아주 옅게 남겨 두면 글 뒤로 지나가는 깊이가 된다.
    const edge = Math.abs(probe.x);
    const clear = 0.16 + 0.84 * THREE.MathUtils.smoothstep(edge, 0.42, 0.56);

    // 우상단 내비 상자 뒤는 완전히 비운다. 반투명 상자 위로 로고가 겹치면
    // 깊이가 아니라 고장으로 보인다.
    const underNav = probe.x > 0.76 && probe.y > 0.42 ? 0 : 1;

    // 화면 밖으로 나가면 완전히 지운다
    const inside = edge > 1.05 ? 0 : 1;

    span.style.opacity = String(orbit.opacity * clear * underNav * inside);
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
        {/* 로고가 있으면 로고, 없으면 이름. 투명도는 바깥 span 이 쥐고
            다크모드 반전은 안쪽 img 가 받는다 — 둘을 한 엘리먼트에 얹으면
            매 프레임 쓰는 opacity 가 filter 와 엉킨다. */}
        <span ref={el} className="wordmark" aria-hidden="true">
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
  return (
    <group>
      {teachingMarks.map((org, i) => (
        <Mark
          key={org.name}
          org={org}
          orbit={ORBITS[i % ORBITS.length]}
          animate={animate}
        />
      ))}
    </group>
  );
}
