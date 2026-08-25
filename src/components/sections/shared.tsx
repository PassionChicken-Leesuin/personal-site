export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
      {children}
    </p>
  );
}

/** 가지 끝에 달리는 잎. Work 항목에 포인터가 올라가면 피어난다. */
export function Leaf() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 origin-bottom-left scale-0 text-leaf opacity-0 transition duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 20c0-8 5-14 16-16 1 11-5 17-16 16z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M4 20C8 15 12 12 18 9" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
