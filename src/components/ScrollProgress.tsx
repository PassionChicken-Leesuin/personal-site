/**
 * 상단 진행 바. 서버 컴포넌트 — 자체 스크롤 리스너가 없다.
 * ScrollDriver 가 :root 에 쓰는 --scroll 을 CSS 가 직접 읽어 scaleX 로 쓴다.
 */
export default function ScrollProgress() {
  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-px">
      <div
        className="h-full origin-left"
        style={{
          transform: "scaleX(var(--scroll))",
          background: "var(--bark)",
        }}
      />
    </div>
  );
}
