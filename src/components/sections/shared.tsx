/**
 * 섹션 머리. 도면의 표제처럼 왼쪽에 이름, 오른쪽 끝에 번호,
 * 그 사이를 괘선이 메운다 — 빈칸을 선이 채우면 지면이 정돈돼 보인다.
 */
export function SectionHead({
  children,
  index,
}: {
  children: React.ReactNode;
  index: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <p className="label shrink-0">{children}</p>
      <span className="h-px flex-1 bg-hairline" aria-hidden="true" />
      <p className="label shrink-0" aria-hidden="true">
        {index}
      </p>
    </div>
  );
}

/** 바깥으로 나가는 링크 표시. 화살표 하나로 충분하다. */
export function Outbound() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="mt-[0.35em] h-3 w-3 shrink-0 -translate-x-1 opacity-0 transition duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <path d="M3 9 9 3M4.2 3H9v4.8" />
    </svg>
  );
}
