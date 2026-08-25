---
version: 1
name: suin-forest
description: >
  이수인의 개인 홈페이지 디자인 시스템. 따뜻한 크림 캔버스 위의 에디토리얼
  타이포그래피에, "구름과 나무" 라는 하나의 은유를 얹었다. 아래로 스크롤하는
  일이 시간을 거슬러 내려가는 일이 되고, 경력은 수관에서 뿌리로 자라 내려오는
  한 그루의 선(line) 나무가 된다. 논문·특허를 담은 연구자 포트폴리오이므로
  유치해지지 않는 것이 이 시스템의 첫 번째 제약이다.
provenance: >
  팔레트와 스페이싱 스케일은 VoltAgent/awesome-design-md (MIT) 의
  design-md/claude/DESIGN.md 에서 각색했다. 모션의 정량 상한은
  nextlevelbuilder/ui-ux-pro-max-skill 의 data/motion.csv 를 따랐다.
  안티패턴 검수는 pbakaus/impeccable (Apache-2.0) 로 했다.
---

## 은유

**아래로 스크롤한다 = 시간을 거슬러 내려간다 = 수관에서 뿌리로 내려간다.**

`content.ts` 의 `journey` 배열이 2026 → 2020 역순이라 이 은유가 데이터 구조와
그대로 맞아떨어진다. 뿌리(2020, 학부 입학)가 페이지 바닥에 있다.

색은 이 은유를 따른다:

| 역할 | 라이트 | 다크 | 의미 |
|---|---|---|---|
| `--canvas` | `#faf9f5` | `#181715` | 안개 낀 하늘 |
| `--ink` | `#141413` | `#faf9f5` | 제목 |
| `--body` | `#3d3d3a` | `#e5e2db` | 본문 |
| `--muted` | `#6c6a64` | `#a09d96` | 레이블·연도 |
| `--bark` | `#cc785c` | `#d98e73` | 나무껍질 — 줄기와 가지 |
| `--bark-deep` | `#a9583e` | `#d98e73` | 본문 크기 링크·강조 |
| `--leaf` | `#5db8a6` | `#6fc9b7` | 잎사귀 |
| `--light` | `#e8a55a` | `#edb679` | 잎 사이로 든 빛 — 가지 끝 마디 |
| `--hairline` | `#e6dfd8` | `#2e2c28` | 구분선 |

**`--bark` 를 본문 크기 텍스트에 쓰지 말 것.** 크림 위 3.19:1 로 기준 미달이다.
그 자리엔 `--bark-deep`(4.9:1) 을 쓴다. `--bark` 는 선·큰 제목·장식 전용.

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

- **`radial-spotlight-glow`** — 안개층이 걸린다. 이 규칙은 "액센트색 반투명
  원형 그라디언트를 배경에 깐 반사적 AI 장식" 을 잡는 좋은 기본값이지만,
  구름은 이 사이트의 명시적 요구사항이다. 지적의 실질은 받아들여
  액센트색 스포트라이트를 중성 대기색으로 바꾸고, 단일 타원 대신 크기가
  제각각인 덩어리 넷을 겹쳐 실제 구름 윤곽으로 만들었다. 형태 자체는 유지한다.
- **`layout-transition: padding-left, width, width`** — 오탐. 정확히 `--spine`
  을 쓰는 세 곳이며, 애니메이션이 아니라 브레이크포인트에서 값이 달라지는
  것이다. 서빙 CSS·CSSOM·인라인 스타일 전부 확인했고 레이아웃 트랜지션은 없다.
- **`overused-font`** — Fraunces·Inter 둘 다 걸린다. 지적은 타당하나 현재 조합을
  유지하기로 결정했다.

## 접근성 기준

- 본문·muted 텍스트 대비 4.5:1 이상 (현재 라이트 10.3 / 5.1, 다크 13.9 / 6.6)
- 나무·안개는 전부 `aria-hidden="true"` — 순수 장식이다
- `:focus-visible` 은 `--bark-deep` 2px 아웃라인
- 포인터 없는 기기에서는 마그네틱 리스너를 아예 붙이지 않는다
