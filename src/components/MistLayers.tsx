/**
 * 구름/안개층. 서버 컴포넌트 — JS 를 전혀 내려보내지 않는다.
 *
 * 두 종류의 움직임이 합성된다:
 *   1. 주변 드리프트  CSS @keyframes, 층마다 다른 주기, 스크롤과 무관하게 항상 흐른다
 *   2. 패럴랙스      ScrollDriver 가 발행하는 --scroll 을 CSS 가 읽어 translate
 *
 * 형태에 대하여: 하나의 큰 타원 그라디언트는 "AI 스포트라이트 글로우"로 읽힌다.
 * 그래서 각 층을 위치가 어긋난 덩어리 셋을 겹쳐 만든다.
 *
 * 크기에 대하여: 각 층은 뷰포트보다 한참 크고 사방으로 넘치게 잡는다.
 * 층이 화면 안에서 끝나면 낮은 알파로 합성된 레이어의 가장자리가 옅은
 * 사각형 자국으로 드러난다. 넘치게 두면 .mist-wrap 의 overflow:hidden 이
 * 화면 밖에서 잘라내므로 경계가 보일 일이 없다.
 *
 * 층은 3장까지만. 그 이상은 시각적 이득 대비 합성 비용만 늘어난다.
 * 좁은 화면에서는 가장 앞 층을 빼서 2장으로 줄인다.
 */

/**
 * 덩어리 셋을 겹쳐 구름 하나를 만든다. puffs = [rx%, ry%, x%, y%]
 *
 * 반경을 명시하는 이유: closest-side 를 쓰면 이 큰 상자에서 반경이 뷰포트를
 * 통째로 덮어 변화가 사라진다. 상자 가장자리는 이미 화면 밖이므로
 * 작은 반경을 줘도 잘린 자국이 생기지 않는다.
 */
const cloud = (color: string, puffs: [number, number, number, number][]) =>
  puffs
    .map(
      ([rx, ry, x, y]) =>
        `radial-gradient(${rx}% ${ry}% at ${x}% ${y}%, ${color}, transparent)`,
    )
    .join(", ");

// 층 상자는 150vw × 150vh, 좌·상단을 25% 씩 당겨 사방으로 넘긴다.
// 따라서 화면에 보이는 영역은 상자 좌표로 대략 17%~83% 구간이다.
const BOX = { width: "150vw", height: "150vh" };

const LAYERS = [
  {
    // 가장 먼 층 — 느리고 가장 적게 움직인다
    offset: { left: "-25vw", top: "-28vh" },
    driftDur: "120s",
    parallax: "-40px",
    puffs: [
      [15, 11, 30, 30],
      [12, 8, 47, 24],
      [14, 10, 62, 33],
    ] as [number, number, number, number][],
    color: "var(--mist-1)",
  },
  {
    // 중간 층
    offset: { left: "-22vw", top: "-18vh" },
    driftDur: "95s",
    parallax: "-80px",
    puffs: [
      [13, 10, 60, 44],
      [10, 7, 74, 36],
      [11, 8, 50, 52],
    ] as [number, number, number, number][],
    color: "var(--mist-2)",
  },
  {
    // 가장 앞 층 — 좁은 화면에서는 생략
    offset: { left: "-30vw", top: "-14vh" },
    driftDur: "70s",
    parallax: "-120px",
    puffs: [
      [13, 10, 28, 62],
      [11, 8, 42, 70],
      [10, 7, 18, 54],
    ] as [number, number, number, number][],
    color: "var(--mist-3)",
    narrowHidden: true,
  },
];

export default function MistLayers() {
  return (
    <div className="mist-wrap" aria-hidden="true">
      {LAYERS.map((layer, i) => (
        <div
          key={i}
          className={`mist ${layer.narrowHidden ? "max-sm:hidden" : ""}`}
          style={{
            ...BOX,
            ...layer.offset,
            ["--drift-dur" as string]: layer.driftDur,
          }}
        >
          <div
            className="mist-inner"
            style={{
              ["--parallax" as string]: layer.parallax,
              backgroundImage: cloud(layer.color, layer.puffs),
            }}
          />
        </div>
      ))}
    </div>
  );
}
