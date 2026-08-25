import Reveal from "@/components/Reveal";
import ScrollProgress from "@/components/ScrollProgress";
import { TreeSpine, Branch, TreeRoots } from "@/components/Tree";
import Magnetic from "@/components/Magnetic";
import { site, works, journey, links, skills } from "@/content";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
      {children}
    </p>
  );
}

/** 가지 끝에 달리는 잎. Work 항목에 포인터가 올라가면 피어난다. */
function Leaf() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 origin-bottom-left scale-0 text-leaf opacity-0 transition duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 20c0-8 5-14 16-16 1 11-5 17-16 16z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M4 20C8 15 12 12 18 9" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <ScrollProgress />

      {/* z-10 — 안개층(z-0) 위에 놓인다 */}
      <main className="relative z-10 mx-auto w-full max-w-3xl px-6 sm:px-8">
        {/* ── Intro ───────────────────────────────────────── */}
        <section className="flex min-h-svh flex-col justify-center py-24">
          <Reveal>
            <SectionLabel>{site.location}</SectionLabel>
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
            <p className="mt-10 max-w-xl text-base leading-[1.75] sm:text-lg">
              {site.tagline}
            </p>
          </Reveal>

          <Reveal delay={280}>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="text-xs font-medium uppercase tracking-[0.14em] text-muted"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={340}>
            <div className="mt-16 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted">
              <span>scroll</span>
              <span className="h-px w-12 bg-hairline" />
            </div>
          </Reveal>
        </section>

        {/* ── Work ────────────────────────────────────────── */}
        <section id="work" className="border-t border-hairline py-24 sm:py-32">
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

        {/* ── Journey ─────────────────────────────────────── */}
        {/* id="journey" — ScrollDriver 가 이 섹션의 진행도로 --tree 를 계산한다 */}
        <section
          id="journey"
          className="border-t border-hairline py-24 sm:py-32"
        >
          <Reveal>
            <SectionLabel>Journey</SectionLabel>
          </Reveal>

          {/* 나무가 설 자리만큼 왼쪽을 비운다. 가지는 각 챕터 안에 있으므로
              본문 길이가 달라져도 정렬이 저절로 맞는다. */}
          <div
            className="relative mt-12 sm:mt-16"
            style={{ paddingLeft: `var(--spine, 0px)` }}
          >
            <TreeSpine />

            <ol className="space-y-16">
              {journey.map((chapter, i) => (
                <li key={chapter.period + i} className="relative">
                  {/* Branch 는 Reveal 안에 있어야 data-visible 을 받는다 */}
                  <Reveal delay={i * 60}>
                    <Branch index={i} />
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                      {chapter.period}
                    </p>
                    <h2 className="mt-2 font-display text-xl font-normal tracking-tight text-ink sm:text-2xl">
                      {chapter.title}
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-[1.75] sm:text-base">
                      {chapter.body}
                    </p>
                  </Reveal>
                </li>
              ))}

              {/* 뿌리 — 목록 끝. 여기까지 내려와야 그려진다. */}
              <li className="relative h-14" aria-hidden="true">
                <Reveal>
                  <TreeRoots />
                </Reveal>
              </li>
            </ol>
          </div>
        </section>

        {/* ── Contact ─────────────────────────────────────── */}
        <section
          id="contact"
          className="border-t border-hairline py-24 sm:py-32"
        >
          <Reveal>
            <SectionLabel>Contact</SectionLabel>
          </Reveal>

          <Reveal delay={80}>
            <a
              href={`mailto:${site.email}`}
              className="mt-8 inline-block cursor-pointer font-display text-2xl font-normal tracking-tight text-ink underline decoration-hairline decoration-1 underline-offset-8 transition-colors duration-300 hover:text-bark-deep hover:decoration-bark sm:text-4xl"
            >
              {site.email}
            </a>
          </Reveal>

          <Reveal delay={160}>
            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={
                      link.href.startsWith("mailto:") ? undefined : "_blank"
                    }
                    rel="noopener noreferrer"
                    className="cursor-pointer text-xs font-medium uppercase tracking-[0.18em] text-muted transition-colors duration-300 hover:text-bark-deep"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <footer className="border-t border-hairline py-10">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            {site.name} · {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </>
  );
}
