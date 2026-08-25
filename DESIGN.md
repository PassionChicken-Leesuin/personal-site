---
version: 1
name: suin-forest
description: >
  이수인의 개인 홈페이지 디자인 시스템. 하늘색 캔버스 위의 에디토리얼
  타이포그래피에, "구름과 나무" 라는 하나의 은유를 얹었다. 아래로 스크롤하는
  일이 시간을 거슬러 내려가는 일이 되고, 경력은 수관에서 뿌리로 자라 내려오는
  한 그루의 선(line) 나무가 된다. 논문·특허를 담은 연구자 포트폴리오이므로
  유치해지지 않는 것이 이 시스템의 첫 번째 제약이다.
provenance: >
  구조와 스페이싱 스케일은 VoltAgent/awesome-design-md (MIT) 의
  design-md/claude/DESIGN.md 에서 가져왔다. 팔레트는 원본의 웜 크림 대신
  하늘색으로 바꿨다 — 컨셉이 하늘과 구름이기 때문이다. 모션의 정량 상한은
  nextlevelbuilder/ui-ux-pro-max-skill 의 data/motion.csv 를 따랐다.
  안티패턴 검수는 pbakaus/impeccable (Apache-2.0) 로 했다.
---

## 은유

**아래로 스크롤한다 = 시간을 거슬러 내려간다 = 수관에서 뿌리로 내려간다.**

`content.ts` 의 `journey` 배열이 2026 → 2020 역순이라 이 은유가 데이터 구조와
그대로 맞아떨어진다. 뿌리(2020, 학부 입학)가 페이지 바닥에 있다.

색은 이 은유를 따른다. 위는 하늘, 아래로 내려갈수록 지면이다.

| 역할 | 라이트 | 다크 | 의미 |
|---|---|---|---|
| `--canvas` | `#e4eef7` | `#0d1520` | 하늘 |
| `--sky-top` | `rgba(174,209,236,.75)` | `rgba(28,46,70,.7)` | 문서 최상단, 하늘이 가장 진한 곳 |
| `--ground` | `rgba(224,212,190,.42)` | `rgba(48,42,34,.45)` | 문서 바닥, 지면 |
| `--ink` | `#0f1720` | `#eef4f9` | 제목 |
| `--body` | `#33414d` | `#cbd8e3` | 본문 |
| `--muted` | `#445766` | `#8fa3b5` | 레이블·연도 |
| `--bark` | `#b06a4e` | `#c9825f` | 나무껍질 — 줄기와 가지 |
| `--bark-deep` | `#7d4530` | `#d99570` | 본문 크기 링크·강조 |
| `--leaf` | `#4f9e73` | `#6bbd91` | 잎사귀 |
| `--light` | `#e8a55a` | `#edb679` | 가지 끝 마디 |
| `--hairline` | `#c8dcea` | `#24303f` | 구분선 |
| `--mist-1/2/3` | 흰색 0.92/0.7/0.5 | 청회색 0.6/0.45/0.5 | 구름 |

**대비는 최상단 기준으로 잰다.** 배경이 그라디언트라 `--canvas` 만 보고 재면
안 된다. 페이지에서 배경이 가장 진한 지점은 `--sky-top` 을 `--canvas` 위에
합성한 `rgb(188,216,239)` 이고, 모든 텍스트 색은 이 값 위에서 4.5:1 을 넘어야 한다.
현재 라이트 제목 12.2 / 본문 7.1 / muted 5.1 / 부제 5.1, 다크 13.6 / 10.4 / 5.8 / 6.1.

**`--bark` 를 본문 크기 텍스트에 쓰지 말 것.** 강조에는 `--bark-deep` 을 쓴다.
`--bark` 는 선·큰 제목·장식 전용이다.

**바탕 그라디언트는 `html` 에 건다.** `body` 에 걸면 캔버스로 전파되면서
`html` 의 높이(뷰포트 한 화면)를 기준으로 잡혀 화면마다 반복되고,
경계마다 하드한 가로 띠가 생긴다.

## 타이포그래피

원본의 Copernicus·StyreneB 는 유료 서체라 대체했다.

- **Fraunces** — 제목. SOFT/WONK 축이 있어 유기적인 인상을 만든다
- **Inter** — 본문. 원본 DESIGN.md 가 스스로 명시한 fallback

한글에는 웹폰트를 얹지 않는다. 한글 웹폰트는 수백 KB라 이 정적 사이트의 이점을
깎는다. `Pretendard → Apple SD Gothic Neo → Malgun Gothic` 시스템 스택으로 간다.

## 모션

모든 모션의 진입점은 `ScrollDriver` **하나**다. rAF 로 throttle 된 스크롤
리스너가 `:root` 에 CSS 변수를 쓰고, 나머지는 전부 CSS 가 그 변수를 읽어
처리한다. 컴포넌트마다 리스너를 붙이지 않는다 — 레이어가 늘어도 비용이 늘지 않는다.

```
--scroll  0..1  문서 전체 진행도   → 안개 패럴랙스, 상단 진행 바
--tree    0..1  Journey 진행도     → 줄기·수관
```

### 지켜야 할 상한 (motion.csv)

- 패럴랙스 **3층까지**. 본문 텍스트에는 절대 걸지 않는다. 래퍼에 `overflow:hidden`
- 마그네틱 호버는 화면당 1~2개, 당김 `* 0.16` 에 `±8px` 클램프
- 섹션 핀 금지
- `prefers-reduced-motion` 에서 **최종 상태를 즉시 렌더** — 나무는 완성된 채로 보인다

### 나무를 그리는 두 가지 방식

세로로 늘어나는 **줄기**는 stroke 가 왜곡되므로 `clip-path` 로 위에서부터
드러낸다. 고정 비율인 **가지·뿌리**는 `stroke-dashoffset` 으로 그린다.

**가지의 타이밍은 전역 진행도에 묶지 않는다.** 챕터마다 본문 길이가 달라
인덱스 기반 임계값으로는 줄기와 정렬이 어긋난다. 각 가지는 자기 챕터를 감싼
`Reveal` 의 `data-visible` 에 묶여 있어 정렬이 레이아웃에서 자동으로 따라온다.
덕분에 `journey` 항목을 몇 개로 늘리든 손볼 것이 없다.

나무의 모든 좌표는 폭 72 기준 viewBox 로 통일하고 실제 크기는 `--spine` 에
비례시킨다. 좁은 화면에서는 `--spine` 만 40px 로 줄이면 나무 전체가 같은 비율로
작아진다.

## 검수

```bash
npx impeccable@latest install          # .claude/ 에 설치 (gitignore 됨)
node .claude/skills/impeccable/scripts/detect.mjs src/
PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  node .claude/skills/impeccable/scripts/detect.mjs http://localhost:3000 --viewport 1440x900
```

URL 스캔에는 puppeteer 가 필요하다. 프로젝트 의존성을 늘리지 않으려고
전역 설치본을 `node_modules/puppeteer` 로 심볼릭 링크해 두었다(gitignore 됨).

### 남겨둔 지적과 그 이유

- **`layout-transition: padding-left, width, width`** — 오탐. 정확히 `--spine`
  을 쓰는 세 곳이며, 애니메이션이 아니라 브레이크포인트에서 값이 달라지는
  것이다. 서빙 CSS·CSSOM·인라인 스타일 전부 확인했고 레이아웃 트랜지션은 없다.
- **`overused-font`** — Fraunces·Inter 둘 다 걸린다. 지적은 타당하나 현재 조합을
  유지하기로 결정했다.

## 접근성 기준

- 모든 텍스트 대비 4.5:1 이상 — 위의 최상단 기준으로 잰다
- 나무·안개는 전부 `aria-hidden="true"` — 순수 장식이다
- `:focus-visible` 은 `--bark-deep` 2px 아웃라인
- 포인터 없는 기기에서는 마그네틱 리스너를 아예 붙이지 않는다
