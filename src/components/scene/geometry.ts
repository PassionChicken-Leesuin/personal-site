import * as THREE from "three";

/**
 * 선으로만 그리는 도형들.
 *
 * 채운 면을 쓰지 않으므로 조명이 필요 없다 — 라이트도, 노멀도, 그림자도 없다.
 * 씬이 그만큼 싸지고, 무엇보다 색이 조명에 흔들리지 않아 CSS 토큰의 잉크색이
 * 화면에 그대로 나온다.
 */

/** 닫힌 사각형. lineLoop 이 마지막 점과 첫 점을 이어 준다. */
export function rectOutline(w: number, h: number): THREE.BufferGeometry {
  const x = w / 2;
  const y = h / 2;
  return new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-x, -y, 0),
    new THREE.Vector3(x, -y, 0),
    new THREE.Vector3(x, y, 0),
    new THREE.Vector3(-x, y, 0),
  ]);
}

/** 컴퍼스로 그은 원. 분할 수가 곧 매끄러움이다. */
export function circleOutline(r: number, segments = 96): THREE.BufferGeometry {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
  }
  return new THREE.BufferGeometry().setFromPoints(pts);
}

/**
 * 입체의 모서리만 남긴다.
 *
 * EdgesGeometry 는 원본을 참조하지 않고 좌표를 복사하므로, 만들고 나면
 * 원본 솔리드는 바로 버릴 수 있다. 남겨 두면 쓰지도 않을 면이 GPU 에 남는다.
 */
export function edgesOf(solid: THREE.BufferGeometry): THREE.BufferGeometry {
  const edges = new THREE.EdgesGeometry(solid);
  solid.dispose();
  return edges;
}
