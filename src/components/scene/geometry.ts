import * as THREE from "three";

/**
 * 결정론적 난수. Math.random 을 쓰면 리마운트마다 섬 모양이 바뀐다.
 * 같은 seed 는 항상 같은 지형을 만든다.
 */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * 정점을 흔들어 저폴리 지형의 불규칙함을 만든다.
 *
 * 위치를 키로 오프셋을 캐시하는 게 핵심이다. 원기둥은 이음새에서 같은 좌표의
 * 정점이 여러 벌 존재하는데, 정점마다 따로 흔들면 그 자리가 찢어져 벌어진다.
 */
export function jitter(geo: THREE.BufferGeometry, amount: number, seed: number) {
  const rand = mulberry32(seed);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const cache = new Map<string, [number, number, number]>();

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const key = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;

    let off = cache.get(key);
    if (!off) {
      off = [
        (rand() - 0.5) * amount,
        (rand() - 0.5) * amount,
        (rand() - 0.5) * amount,
      ];
      cache.set(key, off);
    }
    pos.setXYZ(i, x + off[0], y + off[1], z + off[2]);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}
