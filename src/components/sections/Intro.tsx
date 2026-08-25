import Reveal from "@/components/Reveal";
import { site, skills } from "@/content";

export default function Intro() {
  return (
    <section id="home">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
          {site.location}
        </p>
      </Reveal>

      <Reveal delay={80}>
        <h1 className="mt-6 font-display text-6xl font-normal leading-[1.02] tracking-tight text-ink sm:text-8xl">
          {site.name}
        </h1>
      </Reveal>

      <Reveal delay={140}>
        <p className="mt-4 font-display text-xl italic text-bark-deep sm:text-2xl">
          {site.nameKo} · {site.role}
        </p>
      </Reveal>

      <Reveal delay={220}>
        <p className="mt-8 max-w-md text-sm leading-[1.75] text-body sm:text-base">
          {site.tagline}
        </p>
      </Reveal>

      <Reveal delay={280}>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {skills.map((s) => (
            <li
              key={s}
              className="text-xs font-medium uppercase tracking-[0.14em] text-muted"
            >
              {s}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
