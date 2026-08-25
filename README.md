# personal-site

이수인(Suin Lee)의 개인 홈페이지.

**Live:** https://personal-site-brown-iota.vercel.app

## 스택

- **Next.js 16** (App Router, Turbopack) — 완전 정적 생성
- **Tailwind CSS v4** — CSS 변수 기반 디자인 토큰
- **Space Grotesk / Archivo** (next/font로 셀프 호스팅)
- **Vercel** — `main` 브랜치 push 시 자동 배포

## 내용 수정

사이트의 모든 문구는 [`src/content.ts`](src/content.ts) 한 파일에 모여 있습니다.
이 파일만 고치면 됩니다 — 컴포넌트는 건드릴 필요 없습니다.

```ts
site     // 이름, 한 줄 소개, 자기소개, 이메일
works    // 프로젝트 / 논문 / 오픈소스 목록
journey  // 시기별 경력 서술
links    // 하단 소셜 링크
```

## 개발

```bash
npm run dev     # http://localhost:3000
npm run build   # 프로덕션 빌드 검증
npm run lint
```

## 구조

```
src/
├─ content.ts              # ← 내용은 전부 여기
├─ app/
│  ├─ layout.tsx           # 폰트, 메타데이터(OG/Twitter)
│  ├─ globals.css          # 디자인 토큰, 다크모드, 모션
│  └─ page.tsx             # Intro / Work / Journey / Contact
└─ components/
   ├─ Reveal.tsx           # 스크롤 등장 (IntersectionObserver)
   └─ ScrollProgress.tsx   # 상단 진행 바
```

## 접근성

다크모드 자동 대응, `prefers-reduced-motion` 존중, 키보드 포커스 표시,
본문 대비 4.5:1 이상을 기준으로 만들었습니다.
