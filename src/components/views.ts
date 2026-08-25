export const VIEWS = ["home", "work", "journey", "contact"] as const;
export type View = (typeof VIEWS)[number];

export const VIEW_LABELS: Record<Exclude<View, "home">, string> = {
  work: "Work",
  journey: "Journey",
  contact: "Contact",
};

export function isView(v: unknown): v is View {
  return typeof v === "string" && (VIEWS as readonly string[]).includes(v);
}
