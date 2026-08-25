// ─────────────────────────────────────────────────────────────
//  이 파일만 고치면 사이트 내용이 전부 바뀝니다.
//  출처: Suin_Lee_Master_Profile_2026-08.md
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "Suin Lee",
  nameKo: "이수인",
  role: "Industrial Engineering Researcher",
  tagline:
    "서울대학교 산업공학과 석사과정. 에이전틱 AI와 기술지능, 지식재산 분석, " +
    "산업 데이터 분석이 만나는 자리에서 연구합니다. 흩어져 있는 기술·운영·암묵적 " +
    "지식을 의사결정에 쓸 수 있는 근거로 바꾸는 방법을 만듭니다. AI가 답을 내놓는 " +
    "데서 그치지 않고 판단의 과정을 설명할 수 있게 하는 것, 그게 지금의 관심사입니다.",
  email: "leesuin9209@gmail.com",
  location: "Seoul, Korea",
  url: "https://personal-site-brown-iota.vercel.app",
};

export const skills = ["Python", "R", "SQL", "JavaScript"];

export type Work = {
  title: string;
  kind: string;
  year: string;
  description: string;
  href?: string;
};

export const works: Work[] = [
  {
    title: "Multi-AI-Agent Debate for Emerging Technology Discovery",
    kind: "Project",
    year: "2026",
    description:
      "여러 AI 에이전트가 각자 근거를 들고 서로 반박하게 해서 유망 기술을 추려내는 시스템. " +
      "기술 발굴을 한 모델의 예측이 아니라 근거를 따지는 토론 과정으로 다시 놓았습니다.",
  },
  {
    title: "Agentic AI for Tacit Knowledge Externalization",
    kind: "Project",
    year: "2026",
    description:
      "숙련자의 머릿속에만 있던 판단 기준을 다시 쓸 수 있는 의사결정 논리로 끄집어내는 " +
      "에이전틱 AI. 에이전트 설계부터 지식 구조화, 워크플로 오케스트레이션까지 다뤘습니다.",
  },
  {
    title: "Patent IPC–Trademark Linkage Algorithm",
    kind: "Project",
    year: "2026",
    description:
      "특허의 IPC 분류와 상표 데이터를 잇는 알고리즘. 기술 분류라는 공급 측 신호와 " +
      "상표라는 시장 측 신호를 한 축 위에서 보게 합니다.",
  },
  {
    title: "Patent Economic-Effect Estimation via Input–Output Analysis",
    kind: "Project",
    year: "2026",
    description:
      "산업 간 거래구조와 산업연관분석으로 특허의 경제적 파급효과를 추정하는 방법론. " +
      "기술의 변화가 산업 단위 성과로 이어지는 경로를 수치로 붙잡습니다.",
  },
  {
    title: "AI-Enabled Cooling Control Evaluation, KT Telecom Facilities",
    kind: "Project",
    year: "2026",
    description:
      "KT 기지국 HVAC의 AI 냉방 제어를 현장 데이터로 검증했습니다. 가동 상태와 가동 시간, " +
      "에너지 절감량을 실제 운영 결과로 확인한 분석입니다.",
  },
  {
    title: "A Text Mining-Based Technology Trend Analysis Framework",
    kind: "Paper",
    year: "2026",
    description:
      "텍스트 마이닝으로 기술 트렌드를 포착하는 분석 프레임워크. 한국혁신학회지(KCI) 게재, 제1저자.",
  },
  {
    title: "Deciphering the Impact of COVID-19 on Korean Sector ETFs",
    kind: "Paper",
    year: "2025",
    description:
      "COVID-19가 국내 섹터 ETF에 남긴 충격을 계량적으로 해부한 연구. Systems(SSCI) 게재, 공동 제1저자.",
  },
  {
    title: "Identifying Emerging Technologies Using Big Data Analytics",
    kind: "Award",
    year: "2025",
    description: "2025 캠퍼스 특허 유니버시아드 한국발명진흥회장상.",
  },
  {
    title: "Energy Storage System and Its Operating Method",
    kind: "Patent",
    year: "2023",
    description: "에너지 저장 시스템 및 그 운용 방법. 등록번호 10-2574696.",
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
      "산업공학과 석사과정. 에이전틱 AI와 기술지능, 지식재산 분석, 산업 데이터 분석을 " +
      "잇는 주제를 다룹니다.",
  },
  {
    period: "2026 —",
    title: "KT · Genuine Energy System",
    body:
      "데이터 분석 TF 연구원. 기지국 HVAC의 AI 냉방 제어를 현장에서 검증하고, 암묵지를 " +
      "구조화하는 에이전틱 AI와 다중 에이전트 토론 기반 기술 발굴 시스템, 특허 IPC–상표 " +
      "연계 알고리즘, 산업연관분석 기반 특허 경제효과 추정 방법론을 만들었습니다.",
  },
  {
    period: "2025 — 2026",
    title: "연구실과 강의실 사이",
    body:
      "가천대학교 Financial Data Intelligence Lab 학부연구원과 삼성물산 AI 아카데미 " +
      "프로젝트 멘토로 RAG 기반 AI 에이전트 프로젝트를 지도했습니다. Scope Labs 생성형 AI " +
      "조교로는 NH투자증권·SK플라즈마·GST·한국지역난방공사 임직원 교육에 참여했습니다.",
  },
  {
    period: "2024 — 2025",
    title: "Technology and Data Intelligence Lab",
    body:
      "경희대학교 학부연구원. LangChain과 BERTopic을 쓴 특허 분석 프로젝트에 참여했고, " +
      "텍스트 마이닝 기반 기술 트렌드 분석 연구가 여기서 시작됐습니다.",
  },
  {
    period: "2020 — 2026",
    title: "Kyung Hee University",
    body:
      "산업경영공학과 학사. GPA 4.14/4.5, 130학점. 학과 학생회장과 AI/ML 연합동아리 " +
      "비타민 활동을 병행했습니다.",
  },
];

export const links = [
  { label: "Email", href: "mailto:leesuin9209@gmail.com" },
  { label: "GitHub", href: "https://github.com/PassionChicken-Leesuin" },
];
