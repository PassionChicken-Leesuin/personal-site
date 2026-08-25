// ─────────────────────────────────────────────────────────────
//  이 파일만 고치면 사이트 내용이 전부 바뀝니다.
//  출처: Suin_Lee_Master_Profile_2026-08.md
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "Suin Lee",
  nameKo: "이수인",
  role: "Industrial Engineering Researcher",
  tagline:
    "서울대학교 산업공학과 석사과정, DDSI Lab에서 연구합니다. 에이전틱 AI와 " +
    "기술지능, 지식재산 분석, 산업 데이터 분석이 만나는 자리를 다룹니다. 흩어져 " +
    "있는 기술·운영·암묵적 지식을 의사결정에 쓸 수 있는 근거로 바꾸는 방법을 " +
    "만듭니다. AI가 답을 내놓는 데서 그치지 않고 판단의 과정을 설명할 수 있게 " +
    "하는 것, 그게 지금의 관심사입니다.",
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
      "기술의 친환경성을 함께 보는 텍스트 마이닝 기반 기술 트렌드 분석 프레임워크. " +
      "글로벌 정유 기업의 특허 데이터를 대상으로 검증했습니다. 한국혁신학회지(KCI) 게재, 제1저자.",
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
      "산업공학과 석사과정. Data-driven Service Innovation Lab(DDSI Lab)에서 " +
      "에이전틱 AI와 기술지능, 지식재산 분석, 산업 데이터 분석을 잇는 주제를 연구합니다.",
  },
  {
    period: "2026 —",
    title: "KT P&M · Genuine Energy System",
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

export type Award = {
  title: string;
  detail: string;
  year: string;
  /** Award / Scholarship — 왼쪽 칸에 종류로 찍힌다 */
  kind: string;
};

export const awards: Award[] = [
  {
    title: "2025 캠퍼스 특허 유니버시아드",
    detail: "한국발명진흥회장상. 빅데이터 분석을 이용한 유망 기술 발굴.",
    year: "2025",
    kind: "Award",
  },
  {
    title: "AI 서비스 경진대회 (KVP)",
    detail: "1위. 생성형 AI와 강화학습 기반 멘탈 헬스케어 서비스.",
    year: "2025",
    kind: "Award",
  },
  {
    title: "성적우수 장학금 1등",
    detail: "경희대학교 산업경영공학과.",
    year: "2025",
    kind: "Scholarship",
  },
  {
    title: "NH투자증권 생성형 AI 기반 ETF 큐레이션 서비스 기획·개발 공모전",
    detail: "4위.",
    year: "2024",
    kind: "Award",
  },
  {
    title: "밝은사회 장학금",
    detail: "경희대학교 공과대학. 학생회 활동 공로로 2024년 4월·10월 두 차례.",
    year: "2024",
    kind: "Scholarship",
  },
  {
    title: "성적우수 장학금 2등",
    detail: "경희대학교 산업경영공학과.",
    year: "2024",
    kind: "Scholarship",
  },
  {
    title: "AI 서비스 경진대회 (KVP)",
    detail: "1위. YOLOv5를 활용한 중고 도서 거래 플랫폼.",
    year: "2024",
    kind: "Award",
  },
  {
    title: "성적우수 장학금 3등",
    detail: "경희대학교 산업경영공학과.",
    year: "2024",
    kind: "Scholarship",
  },
  {
    title: "KT 빅데이터 기반 소상공인 컨설팅 공모전",
    detail: "우수상.",
    year: "2023",
    kind: "Award",
  },
  {
    title: "경기 청년 갭이어 프로젝트",
    detail: "공학 분야 우수사례. 데이터 기반 신규 작물 재배 제안.",
    year: "2023",
    kind: "Award",
  },
];

export type Activity = {
  period: string;
  title: string;
  role: string;
  body: string;
};

export const social: Activity[] = [
  {
    period: "2025 — 2026",
    title: "Bitamin",
    role: "Member",
    body:
      "대학생 AI/ML 연합동아리. 매주 딥러닝·머신러닝 스터디를 이어갔고, RAG 프로젝트 " +
      "둘을 포함해 네 건의 AI 프로젝트를 마쳤습니다. 학회 발표에도 참여했습니다.",
  },
  {
    period: "2024",
    title: "산업경영공학과 학생회",
    role: "President",
    body:
      "현대제철과의 협업을 포함해 학과 행사 아홉 건을 기획하고 운영했습니다. 학과 " +
      "이슈를 다루는 월간지를 발행했고, 특집으로 「산업공학 로드맵」을 실었습니다.",
  },
  {
    period: "2020 — 2025",
    title: "The Press Zone",
    role: "Member · President 2023",
    body:
      "학술 발표 동아리. 국제 이슈를 조사해 발표 자료를 만들고 연간 대회에서 " +
      "발표했습니다. 자료를 설계하고 사람 앞에서 말하는 법을 여기서 익혔습니다.",
  },
  {
    period: "2020 — 2025",
    title: "Halles · FL:ex · ADELEMI",
    role: "Team Lead",
    body:
      "댄스팀 운영과 일정 조율을 맡았습니다. 서로 다른 사람들을 한 무대에 세우는 일이 " +
      "곧 소통과 문제 해결이었습니다.",
  },
];

export type Lecture = {
  org: string;
  title: string;
  /** 메인강사 / 보조강사 / 기술 멘토 — 맡은 자리가 다르면 다르게 적는다 */
  role: string;
};

/** 출강 이력. 스코프랩스 강사로 진행한 기업 교육. */
export const teaching: Lecture[] = [
  {
    org: "NH투자증권",
    title: "생성형 AI를 활용한 업무 생산성 강화",
    role: "보조강사",
  },
  {
    org: "NH투자증권",
    title: "생성형 AI를 활용한 증권 데이터분석 및 인사이트 도출",
    role: "보조강사",
  },
  {
    org: "한국지역난방공사",
    title: "현장 실무자를 위한 AI 활용 교육",
    role: "보조강사",
  },
  {
    org: "SK플라즈마",
    title: "임원 대상 AI 활용 교육",
    role: "보조강사",
  },
  {
    org: "삼성물산",
    title: "사내보고서 기반 AI Agent 개발",
    role: "메인강사",
  },
  {
    org: "삼성물산",
    title: "안전뉴스 크롤링 및 요약 AI Agent 개발",
    role: "메인강사",
  },
  {
    org: "삼성전자",
    title: "LangChain과 LangGraph를 활용한 AI Agent 개발",
    role: "보조강사",
  },
  {
    org: "아주그룹",
    title: "사내 Agentic AI 개발 해커톤",
    role: "기술 멘토",
  },
];

/**
 * 기관 로고.
 *
 * 파일명을 ASCII 로 두는 이유: macOS 는 한글 파일명을 NFD(분해형)로 저장하는데
 * 배포되는 Linux 는 NFC 를 기대한다. 한글 파일명 그대로 올리면 로컬에서는
 * 보이고 배포에서만 404 가 난다.
 */
const LOGOS: Record<string, string> = {
  NH투자증권: "/logos/nh.svg",
  한국지역난방공사: "/logos/kdhc.svg",
  SK플라즈마: "/logos/sk-plasma.svg",
  삼성물산: "/logos/samsung.svg",
  삼성전자: "/logos/samsung.svg",
  아주그룹: "/logos/aju.svg",
};

export type Org = { name: string; logo?: string };

/**
 * 출강한 기관. Teaching 화면의 3D 위를 떠다닌다.
 * teaching 에서 중복을 걷어 만든다 — 목록을 두 벌 두면 반드시 어긋난다.
 */
export const teachingOrgs: Org[] = [
  ...new Set(teaching.map((l) => l.org)),
].map((name) => ({ name, logo: LOGOS[name] }));

/**
 * Teaching 화면에서 떠다니는 표식.
 *
 * 로고가 같은 기관은 하나로 묶는다 — 삼성물산과 삼성전자는 같은 로고를 쓰므로
 * 그대로 두면 똑같은 마크가 둘 떠다녀 오류처럼 보인다.
 */
export const teachingMarks: Org[] = teachingOrgs.filter(
  (o, i, all) =>
    all.findIndex((x) => (x.logo ?? x.name) === (o.logo ?? o.name)) === i,
);

export const links = [
  { label: "Email", href: "mailto:leesuin9209@gmail.com" },
  { label: "GitHub", href: "https://github.com/PassionChicken-Leesuin" },
];
