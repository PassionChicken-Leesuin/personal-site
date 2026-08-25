export const VIEWS = [
  "home",
  "work",
  "awards",
  "teaching",
  "journey",
  "social",
  "contact",
] as const;
export type View = (typeof VIEWS)[number];

/** 홈을 뺀 내용 화면들. 내비 순서이자 섹션 번호의 순서다. */
export type Section = Exclude<View, "home">;

/** 게이트를 포함한 화면 단계. 3D 씬은 게이트에서도 계속 돌아간다. */
export type Stage = View | "hello";

export const VIEW_LABELS: Record<Section, string> = {
  work: "Work",
  awards: "Awards",
  teaching: "Teaching",
  journey: "Journey",
  social: "Social",
  contact: "Contact",
};

export const SECTIONS = VIEWS.filter((v): v is Section => v !== "home");

/**
 * 표제란 오른쪽에 찍히는 '02 / 06'.
 *
 * 섹션마다 손으로 적어 두면 하나 추가할 때마다 전부 어긋난다.
 * 순서는 VIEWS 하나만 알고 있으면 되는 정보다.
 */
export function sectionIndex(v: Section): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(SECTIONS.indexOf(v) + 1)} / ${pad(SECTIONS.length)}`;
}

export function isView(v: unknown): v is View {
  return typeof v === "string" && (VIEWS as readonly string[]).includes(v);
}
