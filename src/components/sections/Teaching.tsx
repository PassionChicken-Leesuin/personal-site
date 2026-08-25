import Reveal from "@/components/Reveal";
import { teaching } from "@/content";
import { SectionHead } from "./shared";

export default function Teaching() {
  return (
    <section id="teaching">
      <Reveal>
        <SectionHead view="teaching">Teaching</SectionHead>
      </Reveal>

      {/* 기관이 왼쪽 칸에 온다 — 같은 곳에 두 번 간 이력이 세로로 붙어
          한눈에 보인다. Work 의 연도 자리와 같은 폭을 쓴다. */}
      <ul className="mt-10">
        {teaching.map((lecture, i) => (
          <li key={lecture.org + lecture.title}>
            <Reveal delay={Math.min(i, 6) * 50}>
              <div className="flex flex-col gap-2 border-t border-hairline-soft py-6 sm:flex-row sm:gap-10">
                <div className="w-28 shrink-0 pt-0.5">
                  <span className="label">{lecture.org}</span>
                </div>

                <div className="min-w-0">
                  <h2 className="font-display text-base font-light leading-snug tracking-[0.01em] text-ink sm:text-lg">
                    {lecture.title}
                  </h2>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal delay={320}>
        <p className="mt-10 text-sm leading-[1.8] text-muted">
          스코프랩스 강사로 진행한 기업 교육입니다.
        </p>
      </Reveal>
    </section>
  );
}
