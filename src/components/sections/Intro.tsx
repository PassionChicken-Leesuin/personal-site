import Reveal from "@/components/Reveal";
import { about, site, skills } from "@/content";

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

      {/* 소개는 두 문단이다. 첫 문단이 지금 하는 일, 둘째가 곁가지 —
          같은 크기로 나란히 두면 어느 쪽이 본론인지 알 수 없다.
          폭은 max-w-md 를 넘기지 않는다. 더 넓히면 오른쪽 작도와 겹친다. */}
      <Reveal delay={220}>
        <p className="mt-10 max-w-md text-[0.95rem] leading-[1.85] text-body">
          {about[0]}
        </p>
      </Reveal>

      {about[1] && (
        <Reveal delay={280}>
          <p className="mt-5 max-w-md text-sm leading-[1.85] text-muted">
            {about[1]}
          </p>
        </Reveal>
      )}

      <Reveal delay={340}>
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
