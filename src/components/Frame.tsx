import { site } from "@/content";

/**
 * 용지의 가장자리. 세로 괘선 두 줄과 좌하단 연락처.
 *
 * 괘선은 화면을 가두지 않도록 일부러 어긋나게 끊어 둔다 — 위아래를 다 잇는
 * 테두리는 내용을 액자에 넣지만, 끊긴 선은 지면이 더 있다고 말한다.
 */
export default function Frame() {
  return (
    <>
      <div
        className="edge-rule left-5 sm:left-10"
        style={{ top: "24%", height: "44%", animationDelay: "300ms" }}
        aria-hidden="true"
      />
      <div
        className="edge-rule right-5 sm:right-10"
        style={{ top: "46%", bottom: 0, animationDelay: "500ms" }}
        aria-hidden="true"
      />

      <ul className="fixed bottom-6 left-5 z-30 flex flex-col gap-3 sm:bottom-9 sm:left-9">
        <li>
          <a
            href={`mailto:${site.email}`}
            aria-label={`메일 보내기 — ${site.email}`}
            className="block cursor-pointer text-muted transition-colors duration-300 hover:text-ink"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <rect x="2.5" y="5" width="19" height="14" />
              <path d="M2.5 6.5 12 13.5l9.5-7" />
            </svg>
          </a>
        </li>
        <li>
          <a
            href="https://github.com/PassionChicken-Leesuin"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="block cursor-pointer text-muted transition-colors duration-300 hover:text-ink"
          >
            {/* 획으로만 그린 마크 — 채운 로고는 이 화면에서 혼자 무겁다 */}
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
            </svg>
          </a>
        </li>
      </ul>
    </>
  );
}
