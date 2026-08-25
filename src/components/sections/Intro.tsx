import Reveal from "@/components/Reveal";
import { site, skills } from "@/content";

export default function Intro() {
  return (
    <section id="home">
      <Reveal>
        <div className="flex items-center gap-4">
          <p className="label shrink-0">{site.location}</p>
          <span className="h-px w-16 bg-hairline" aria-hidden="true" />
        </div>
      </Reveal>

      {/* 이름은 크게, 그러나 자간을 벌려 도면의 표기처럼 읽히게 한다.
          HELLO 만큼 벌리지는 않는다 — 이건 읽으라고 쓴 글자다. */}
      <Reveal delay={80}>
        <h1 className="mt-7 font-display text-[clamp(2.4rem,8.5vw,5.5rem)] font-extralight uppercase leading-[1.05] tracking-[0.1em] text-ink">
          {site.name}
        </h1>
      </Reveal>

      <Reveal delay={140}>
        <p className="label mt-5">
          {site.nameKo} · {site.role}
        </p>
      </Reveal>

      <Reveal delay={220}>
        <p className="mt-10 max-w-md text-sm leading-[1.85] text-body">
          {site.tagline}
        </p>
      </Reveal>

      <Reveal delay={280}>
        <ul className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
          {skills.map((s, i) => (
            <li key={s} className="flex items-center gap-4">
              {i > 0 && (
                <span className="h-px w-4 bg-hairline" aria-hidden="true" />
              )}
              <span className="label">{s}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
