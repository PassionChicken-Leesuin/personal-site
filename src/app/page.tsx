import Reveal from "@/components/Reveal";
import ScrollProgress from "@/components/ScrollProgress";
import { site, works, journey, links } from "@/content";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display text-xs uppercase tracking-[0.28em] text-muted">
      {children}
    </p>
  );
}

export default function Home() {
  return (
    <>
      <ScrollProgress />

      <main className="mx-auto w-full max-w-3xl px-6 sm:px-8">
        {/* ── Intro ───────────────────────────────────────── */}
        <section className="flex min-h-svh flex-col justify-center py-24">
          <Reveal>
            <SectionLabel>{site.location}</SectionLabel>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
              {site.name}
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-3 font-display text-xl text-muted sm:text-2xl">
              {site.nameKo} · {site.role}
            </p>
          </Reveal>

          <Reveal delay={220}>
            <p className="mt-10 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {site.tagline}
            </p>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-16 flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-muted">
              <span>scroll</span>
              <span className="h-px w-12 bg-line" />
            </div>
          </Reveal>
        </section>

        {/* ── Work ────────────────────────────────────────── */}
        <section id="work" className="border-t border-line py-24 sm:py-32">
          <Reveal>
            <SectionLabel>Work</SectionLabel>
          </Reveal>

          <ul className="mt-12">
            {works.map((work, i) => {
              const inner = (
                <div className="flex flex-col gap-2 border-t border-line py-8 transition-colors duration-200 group-hover:border-accent sm:flex-row sm:items-baseline sm:gap-8">
                  <div className="flex w-28 shrink-0 items-baseline gap-3 font-display text-xs uppercase tracking-[0.18em] text-muted">
                    <span>{work.year}</span>
                    <span>{work.kind}</span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display text-xl font-medium tracking-tight transition-colors duration-200 group-hover:text-accent sm:text-2xl">
                      {work.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                      {work.description}
                    </p>
                  </div>
                </div>
              );

              return (
                <li key={work.title + i}>
                  <Reveal delay={i * 60}>
                    {work.href ? (
                      <a
                        href={work.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block cursor-pointer"
                      >
                        {inner}
                      </a>
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
        <section id="journey" className="border-t border-line py-24 sm:py-32">
          <Reveal>
            <SectionLabel>Journey</SectionLabel>
          </Reveal>

          <ol className="mt-12 space-y-14">
            {journey.map((chapter, i) => (
              <li key={chapter.period + i}>
                <Reveal delay={i * 60}>
                  <div className="sm:flex sm:gap-8">
                    <p className="w-28 shrink-0 font-display text-xs uppercase tracking-[0.18em] text-muted">
                      {chapter.period}
                    </p>
                    <div className="mt-2 min-w-0 sm:mt-0">
                      <h2 className="font-display text-xl font-medium tracking-tight sm:text-2xl">
                        {chapter.title}
                      </h2>
                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                        {chapter.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Contact ─────────────────────────────────────── */}
        <section id="contact" className="border-t border-line py-24 sm:py-32">
          <Reveal>
            <SectionLabel>Contact</SectionLabel>
          </Reveal>

          <Reveal delay={80}>
            <a
              href={`mailto:${site.email}`}
              className="mt-8 inline-block cursor-pointer font-display text-2xl font-medium tracking-tight underline decoration-line underline-offset-8 transition-colors duration-200 hover:text-accent hover:decoration-accent sm:text-4xl"
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
                    target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="cursor-pointer font-display text-xs uppercase tracking-[0.28em] text-muted transition-colors duration-200 hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <footer className="border-t border-line py-10">
          <p className="font-display text-xs uppercase tracking-[0.28em] text-muted">
            {site.name} · {new Date().getFullYear()}
          </p>
        </footer>
      </main>
    </>
  );
}
