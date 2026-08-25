import Reveal from "@/components/Reveal";
import { site, links } from "@/content";
import { SectionHead } from "./shared";

export default function Contact() {
  return (
    <section id="contact">
      <Reveal>
        <SectionHead index="05 / 05">Contact</SectionHead>
      </Reveal>

      <Reveal delay={80}>
        <a
          href={`mailto:${site.email}`}
          className="mt-12 inline-block cursor-pointer break-all font-display text-2xl font-extralight tracking-[0.04em] text-ink transition-[letter-spacing] duration-500 hover:tracking-[0.08em] sm:text-4xl"
        >
          {site.email}
        </a>
        <span className="mt-4 block h-px w-full bg-hairline" aria-hidden="true" />
      </Reveal>

      <Reveal delay={160}>
        <ul className="mt-12 border border-hairline-soft">
          {links.map((link, i) => (
            <li
              key={link.label}
              className={i > 0 ? "border-t border-hairline-soft" : undefined}
            >
              <a
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="group flex cursor-pointer items-center justify-between px-5 py-4 transition-colors duration-300 hover:bg-surface-soft"
              >
                <span className="label transition-colors duration-300 group-hover:text-ink">
                  {link.label}
                </span>
                <span
                  className="text-ink opacity-40 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 12 12"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  >
                    <path d="M3 9 9 3M4.2 3H9v4.8" />
                  </svg>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
