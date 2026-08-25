// ─────────────────────────────────────────────────────────────
//  이 파일만 고치면 사이트 내용이 전부 바뀝니다.
//  ※ TODO 표시된 곳을 본인 내용으로 채워주세요.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "Suin Lee",
  nameKo: "이수인",
  role: "TODO — 한 줄 소개 (예: Researcher & Builder)",
  tagline:
    "TODO — 두세 문장으로 본인을 설명하세요. 무엇을 만들고, 무엇에 관심이 있고, 지금 무엇을 하고 있는지.",
  email: "leesuin9209@gmail.com",
  location: "Seoul, Korea",
  url: "https://example.com", // 도메인 정해지면 교체
};

export type Work = {
  title: string;
  kind: string;
  year: string;
  description: string;
  href?: string;
};

export const works: Work[] = [
  {
    title: "TODO — 프로젝트 이름",
    kind: "Project",
    year: "2026",
    description: "TODO — 한 줄로 무엇인지, 왜 만들었는지.",
    href: "https://github.com/",
  },
  {
    title: "TODO — 두 번째 항목",
    kind: "Writing",
    year: "2025",
    description: "TODO — 논문이든 글이든 오픈소스든.",
  },
  {
    title: "TODO — 세 번째 항목",
    kind: "Open Source",
    year: "2025",
    description: "TODO — 설명.",
  },
];

export type Chapter = {
  period: string;
  title: string;
  body: string;
};

export const journey: Chapter[] = [
  {
    period: "2026 —",
    title: "TODO — 현재",
    body: "TODO — 지금 하고 있는 일에 대한 짧은 서술.",
  },
  {
    period: "2024 — 2026",
    title: "TODO — 그 전",
    body: "TODO — 어떤 시기였고 무엇을 배웠는지.",
  },
  {
    period: "2022 — 2024",
    title: "TODO — 시작",
    body: "TODO — 출발점.",
  },
];

export const links = [
  { label: "Email", href: "mailto:leesuin9209@gmail.com" },
  { label: "GitHub", href: "https://github.com/" }, // TODO
  { label: "LinkedIn", href: "https://linkedin.com/in/" }, // TODO
];
