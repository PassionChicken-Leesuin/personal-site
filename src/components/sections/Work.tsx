import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";
import { works } from "@/content";
import { Leaf, SectionLabel } from "./shared";

export default function Work() {
  return (
    <section id="work">
      <Reveal>
        <SectionLabel>Work</SectionLabel>
      </Reveal>

      <ul className="mt-12">
        {works.map((work, i) => {
          const inner = (
            <div className="flex flex-col gap-2 border-t border-hairline py-8 transition-colors duration-300 group-hover:border-leaf sm:flex-row sm:items-baseline sm:gap-8">
              <div className="flex w-28 shrink-0 flex-col gap-1 text-xs uppercase tracking-[0.12em] text-muted">
                <span>{work.year}</span>
                <span>{work.kind}</span>
              </div>
              <div className="min-w-0">
                <h2 className="flex items-start gap-2 font-display text-xl font-normal leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-bark-deep sm:text-2xl">
                  <span>{work.title}</span>
                  {work.href && <Leaf />}
                </h2>
                <p className="mt-2 text-sm leading-relaxed sm:text-base">
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
