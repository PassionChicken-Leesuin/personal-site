import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";
import { works } from "@/content";
import { Outbound, SectionHead } from "./shared";

export default function Work() {
  return (
    <section id="work">
      <Reveal>
        <SectionHead index="01 / 05">Work</SectionHead>
      </Reveal>

      <ul className="mt-10">
        {works.map((work, i) => {
          const inner = (
            <div className="flex flex-col gap-3 border-t border-hairline-soft py-8 transition-colors duration-300 group-hover:border-ink sm:flex-row sm:gap-10">
              {/* 왼쪽 칸은 도면의 치수 기입란 — 폭을 고정해 행끼리 줄이 맞는다 */}
              <div className="flex w-24 shrink-0 flex-col gap-1.5 pt-1">
                <span className="label">{work.year}</span>
                <span className="label">{work.kind}</span>
              </div>

              <div className="min-w-0">
                <h2 className="flex items-start gap-1.5 font-display text-xl font-light leading-snug tracking-[0.01em] text-ink sm:text-2xl">
                  <span>{work.title}</span>
                  {work.href && <Outbound />}
                </h2>
                <p className="mt-3 text-sm leading-[1.8] text-body">
                  {work.description}
                </p>
              </div>
            </div>
          );

          return (
            <li key={work.title + i}>
              <Reveal delay={i * 60}>
                {work.href ? (
                  <Magnetic>
                    <a
                      href={work.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block cursor-pointer"
                    >
                      {inner}
                    </a>
                  </Magnetic>
                ) : (
                  <div className="group">{inner}</div>
                )}
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
