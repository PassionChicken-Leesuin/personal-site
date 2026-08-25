import Reveal from "@/components/Reveal";
import { awards } from "@/content";
import { SectionHead } from "./shared";

export default function Awards() {
  return (
    <section id="awards">
      <Reveal>
        <SectionHead view="awards">Awards</SectionHead>
      </Reveal>

      {/* Work 과 같은 행 구조를 쓰되 제목을 한 급 낮춘다 — 수상 이력은
          목록으로 훑는 것이지 한 건씩 읽는 것이 아니다. */}
      <ul className="mt-10">
        {awards.map((award, i) => (
          <li key={award.title + award.year + i}>
            <Reveal delay={Math.min(i, 6) * 50}>
              <div className="flex flex-col gap-2 border-t border-hairline-soft py-6 sm:flex-row sm:gap-10">
                <div className="flex w-24 shrink-0 flex-col gap-1.5 pt-0.5">
                  <span className="label">{award.year}</span>
                  <span className="label">{award.kind}</span>
                </div>

                <div className="min-w-0">
                  <h2 className="font-display text-base font-light leading-snug tracking-[0.01em] text-ink sm:text-lg">
                    {award.title}
                  </h2>
                  <p className="mt-2 text-sm leading-[1.75] text-body">
                    {award.detail}
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
