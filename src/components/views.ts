export const VIEWS = ["home", "work", "journey", "contact"] as const;
export type View = (typeof VIEWS)[number];

/** 게이트를 포함한 화면 단계. 3D 씬은 게이트에서도 계속 돌아간다. */
export type Stage = View | "hello";

export const VIEW_LABELS: Record<Exclude<View, "home">, string> = {
  work: "Work",
  journey: "Journey",
  contact: "Contact",
};

export function isView(v: unknown): v is View {
  return typeof v === "string" && (VIEWS as readonly string[]).includes(v);
}
