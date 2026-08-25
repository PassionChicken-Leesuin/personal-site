/**
 * 나무. 서버 컴포넌트 — JS 를 내려보내지 않는다.
 *
 * 하나의 큰 SVG 대신 세 조각으로 나눴다. 챕터마다 본문 길이가 다르기 때문에
 * 균등 간격으로 가지를 배치하면 정렬이 어긋난다. 가지를 각 <li> 안에 넣으면
 * 정렬이 레이아웃에서 자동으로 따라오고, journey 항목 수에도 영향받지 않는다.
 *
 *   TreeSpine  수관 + 줄기 — 목록 전체 높이에 걸쳐 늘어난다
 *   Branch     가지 하나 — 각 챕터 안에 놓인다
 *   TreeRoots  뿌리 — 목록 맨 끝
 *
 * 그리는 방식이 둘로 나뉜다:
 *   줄기는 세로로 늘어나므로 stroke 가 왜곡된다 → clip-path 로 위에서부터 드러낸다
 *   가지·뿌리는 고정 비율이라 왜곡이 없다     → stroke-dashoffset 으로 그린다
 *
 * 모든 좌표는 폭 72 기준 viewBox 로 통일하고, 실제 크기는 --spine 에 비례시킨다.
 * 덕분에 좁은 화면에서 --spine 만 줄이면 나무 전체가 같은 비율로 작아진다.
 */

const VB_W = 72; // 모든 조각이 공유하는 viewBox 폭
const TRUNK_X = 22; // viewBox 안에서 줄기의 x

/** viewBox 좌표를 실제 px 로 — --spine 에 비례 */
const scaled = (v: number) => `calc(var(--spine) * ${v} / ${VB_W})`;

export function TreeSpine() {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 left-0"
      style={{ width: "var(--spine)" }}
      aria-hidden="true"
    >
      {/* 수관 — 가장 먼저 그려진다 */}
      <svg
        viewBox={`0 0 ${VB_W} 40`}
        className="absolute left-0 top-0"
        style={{ width: "var(--spine)", height: scaled(40) }}
        fill="none"
      >
        {[
          { d: "M22 40 Q 16 22 8 10", at: 0, w: 1.4, o: 1 },
          { d: "M22 40 Q 28 20 36 6", at: 0.02, w: 1.4, o: 1 },
          { d: "M22 40 Q 23 24 24 14", at: 0.04, w: 1.1, o: 0.7 },
        ].map((c, i) => (
          <path
            key={i}
            d={c.d}
            className="branch"
            pathLength={1}
            stroke="var(--leaf)"
            strokeWidth={c.w}
            strokeLinecap="round"
            strokeOpacity={c.o}
            style={{ ["--at" as string]: c.at, ["--span" as string]: 0.08 }}
          />
        ))}
      </svg>

      {/* 줄기 — 목록 높이만큼 늘어난다. 채운 도형이라 세로로 늘려도 굵기가
          뭉개지지 않는다. SVG 는 대체 요소라 top+bottom 만으로는 늘어나지
          않으므로 높이를 명시해야 한다. */}
      <svg
        viewBox="0 0 6 100"
        preserveAspectRatio="none"
        className="trunk absolute"
        style={{
          left: scaled(TRUNK_X - 3),
          top: scaled(36),
          height: `calc(100% - ${scaled(36)})`,
          width: scaled(6),
        }}
        fill="var(--bark)"
      >
        {/* 위는 가늘고 아래로 갈수록 두꺼워지는 테이퍼 */}
        <path d="M2.5 0 L3.5 0 L4.4 100 L1.6 100 Z" />
      </svg>
    </div>
  );
}

/**
 * 챕터 하나에 붙는 가지. 줄기에서 갈라져 본문 쪽(오른쪽)으로 뻗는다.
 *
 * 그리는 시점은 전역 진행도가 아니라 감싸고 있는 Reveal 의 data-visible 에 묶인다.
 * 챕터마다 본문 길이가 달라 인덱스 기반 임계값으로는 줄기와 정렬이 어긋나기 때문이다.
 */
export function Branch({ index }: { index: number }) {
  const reach = 26 + (index % 3) * 6; // 길이를 달리해 규칙성을 깬다
  const rise = 14 + (index % 2) * 5;

  return (
    <svg
      viewBox={`0 0 ${VB_W} 40`}
      className="pointer-events-none absolute"
      style={{
        left: "calc(-1 * var(--spine))",
        top: "0.3rem",
        width: "var(--spine)",
        height: scaled(40),
      }}
      fill="none"
      aria-hidden="true"
    >
      <path
        d={`M${TRUNK_X} 30 Q ${TRUNK_X + reach * 0.6} ${30 - rise * 0.4} ${TRUNK_X + reach} ${30 - rise}`}
        className="branch-grow"
        pathLength={1}
        stroke="var(--bark)"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* 잎 */}
      <path
        d={`M${TRUNK_X + reach * 0.45} ${30 - rise * 0.28} q 10 -9 15 0 q -10 8 -15 0 z`}
        className="branch-grow"
        pathLength={1}
        stroke="var(--leaf)"
        strokeWidth={1.1}
        strokeLinejoin="round"
        style={{ ["--grow-delay" as string]: "260ms" }}
      />
      {/* 가지 끝 마디 — 이 시기의 표식 */}
      <circle
        cx={TRUNK_X + reach}
        cy={30 - rise}
        r={3.2}
        className="branch-grow"
        pathLength={1}
        stroke="var(--light)"
        strokeWidth={1.6}
        style={{ ["--grow-delay" as string]: "460ms" }}
      />
    </svg>
  );
}

/**
 * 뿌리. 목록 맨 끝에 놓인다.
 *
 * 전역 진행도에 묶으면 사용자가 바닥에 닿기도 전에 미리 나온다.
 * 목록 끝에서 화면에 들어올 때 그리는 편이 은유에 맞는다 — 2020년, 시작점.
 */
export function TreeRoots() {
  return (
    <svg
      viewBox={`0 0 ${VB_W} 56`}
      className="pointer-events-none absolute"
      style={{
        left: "calc(-1 * var(--spine))",
        top: 0,
        width: "var(--spine)",
        height: scaled(56),
      }}
      fill="none"
      aria-hidden="true"
    >
      {[
        { d: "M22 0 C 20 18 12 28 2 52", delay: "0ms", w: 1.4 },
        { d: "M22 0 C 24 20 34 30 42 50", delay: "180ms", w: 1.2 },
        { d: "M22 0 C 22 24 24 36 20 56", delay: "360ms", w: 1.1 },
      ].map((r, i) => (
        <path
          key={i}
          d={r.d}
          className="branch-grow"
          pathLength={1}
          stroke="var(--bark)"
          strokeWidth={r.w}
          strokeLinecap="round"
          strokeOpacity={0.7}
          style={{ ["--grow-delay" as string]: r.delay }}
        />
      ))}
    </svg>
  );
}
