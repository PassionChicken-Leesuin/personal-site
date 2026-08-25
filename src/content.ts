// ─────────────────────────────────────────────────────────────
//  이 파일만 고치면 사이트 내용이 전부 바뀝니다.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "Suin Lee",
  nameKo: "이수인",
  role: "Data Science & AI Researcher",
  tagline:
    "서울대학교 산업공학과 DDSI Lab에서 기술경영 도메인의 AI 애플리케이션을 연구합니다. " +
    "학부 4년 동안 35건의 데이터 분석 프로젝트를 거치며 문제 정의에서 분석을 지나 " +
    "의사결정으로 이어지는 전 과정을 다뤄왔습니다. 잘 된 결과만이 아니라 아쉬웠던 " +
    "프로젝트와 거기서 얻은 개선 방향까지 함께 기록하려 합니다.",
  email: "leesuin9209@gmail.com",
  location: "Seoul, Korea",
  url: "https://personal-site-brown-iota.vercel.app",
};

export const skills = ["Python", "R", "JavaScript"];

export type Work = {
  title: string;
  kind: string;
  year: string;
  description: string;
  href?: string;
};

export const works: Work[] = [
  {
    title: "A Text Mining-Based Technology Trend Analysis Framework",
    kind: "Paper",
    year: "2026",
    description:
      "텍스트 마이닝으로 기술 트렌드를 포착하는 분석 프레임워크. 한국혁신학회지(KCI) 투고, 제1저자.",
  },
  {
    title: "Deciphering the Impact of COVID-19 on Korean Sector ETFs",
    kind: "Paper",
    year: "2025",
    description:
      "COVID-19가 국내 섹터 ETF에 남긴 충격을 계량적으로 해부한 연구. Systems(SSCI) 게재, 공동 제1저자.",
  },
  {
    title: "Energy Storage System and Its Operating Method",
    kind: "Patent",
    year: "2023",
    description: "에너지 저장 시스템 및 그 운용 방법. 등록번호 10-2574696.",
  },
  {
    title: "Undergraduate Project Archive",
    kind: "Archive",
    year: "2023 — 2026",
    description:
      "공모전 17건, 전공 9건, 동아리 5건, 연구 3건. 각 프로젝트의 목표와 수행 과정, 결과와 인사이트를 정리한 기록.",
    href: "https://www.notion.so/Suin-s-Portfolio-2f131bc3444c8092b242d8d35c5ce3b6",
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
    title: "Seoul National University",
    body:
      "산업공학과 석사과정. Data-driven Service Innovation Lab에서 기술경영 도메인의 " +
      "AI 애플리케이션을 연구하고 있습니다. 데이터 분석 외주도 병행합니다.",
  },
  {
    period: "2025 — 2026",
    title: "연구실과 강의실 사이",
    body:
      "가천대학교 Financial Data Intelligence Lab 학부연구원, Genuine Energy Strategy " +
      "데이터 분석 TF로 일했습니다. 동시에 삼성물산·엘리스 AI 에이전트 프로젝트 멘토와 " +
      "Scope Labs 생성형 AI 강의 조교로, 국내 대기업 임직원을 대상으로 한 강의에 참여했습니다.",
  },
  {
    period: "2024 — 2025",
    title: "Technology and Data Intelligence Lab",
    body:
      "경희대학교에서 학부연구원으로 지냈습니다. 텍스트 마이닝 기반 기술 트렌드 분석 연구가 " +
      "여기서 시작됐습니다.",
  },
  {
    period: "2020 — 2026",
    title: "Kyung Hee University",
    body:
      "산업경영공학과 학사. GPA 4.14/4.5, 130학점. 이 기간 동안 크고 작은 데이터 분석 " +
      "프로젝트 35건에 참여했습니다.",
  },
];

export const links = [
  { label: "Email", href: "mailto:leesuin9209@gmail.com" },
  { label: "GitHub", href: "https://github.com/PassionChicken-Leesuin" },
  {
    label: "Portfolio",
    href: "https://www.notion.so/Suin-s-Portfolio-2f131bc3444c8092b242d8d35c5ce3b6",
  },
];
