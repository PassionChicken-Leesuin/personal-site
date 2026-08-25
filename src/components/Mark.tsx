/**
 * 좌상단 마크. 도면 한 장에 찍히는 도장 정도의 크기로 둔다.
 *
 * 이름 대신 기호를 쓰는 이유: 이 화면에서 이름은 본문의 주인공이다.
 * 같은 글자를 구석에서 한 번 더 부르면 본문의 무게가 깎인다.
 */
export default function Mark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      // 확대·축소해도 굵기가 1px 로 유지된다 — 괘선과 같은 무게를 지킨다
      vectorEffect="non-scaling-stroke"
      aria-hidden="true"
    >
      <rect x="1.5" y="1.5" width="21" height="21" strokeWidth="1.5" />
      <path d="M6.5 6v12M10.5 6v12M14.5 6v12M18.5 6v12" strokeWidth="1.5" />
    </svg>
  );
}
