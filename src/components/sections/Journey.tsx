import Reveal from "@/components/Reveal";
import { journey } from "@/content";
import { SectionHead } from "./shared";

export default function Journey() {
  return (
    <section id="journey">
      <Reveal>
        <SectionHead index="03 / 05">Journey</SectionHead>
      </Reveal>

      {/* 세로 괘선 하나가 전 구간을 관통하고, 각 항목이 거기에 눈금으로 걸린다.
          선은 목록 안쪽에 두어 본문 길이가 달라져도 저절로 같이 늘어난다. */}
      <ol className="relative mt-12 space-y-14 pl-8 sm:pl-12">
        <span
          className="absolute inset-y-0 left-0 w-px bg-hairline"
          aria-hidden="true"
        />

        {journey.map((chapter, i) => (
          <li key={chapter.period + i} className="relative">
            <Reveal delay={i * 60}>
              {/* 눈금 — 괘선에서 뻗어 나온 짧은 선과 그 끝의 네모 */}
              <span
                className="absolute -left-8 top-[0.55rem] flex items-center sm:-left-12"
                aria-hidden="true"
              >
                <span className="h-px w-5 bg-hairline sm:w-9" />
                <span className="h-[5px] w-[5px] -translate-x-[2.5px] border border-ink bg-canvas" />
              </span>

              <p className="label">{chapter.period}</p>
              <h2 className="mt-2.5 font-display text-xl font-light tracking-[0.01em] text-ink sm:text-2xl">
                {chapter.title}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-[1.85] text-body">
                {chapter.body}
              </p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
