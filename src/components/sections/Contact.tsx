import Reveal from "@/components/Reveal";
import { site, links } from "@/content";
import { SectionLabel } from "./shared";

export default function Contact() {
  return (
    <section id="contact">
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
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
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
  );
}
