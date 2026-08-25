import Reveal from "@/components/Reveal";
import { social } from "@/content";
import { SectionHead } from "./shared";

export default function Social() {
  return (
    <section id="social">
      <Reveal>
        <SectionHead index="04 / 05">Social</SectionHead>
      </Reveal>

      <ul className="mt-10">
        {social.map((item, i) => (
          <li key={item.title + i}>
            <Reveal delay={i * 60}>
              <div className="flex flex-col gap-3 border-t border-hairline-soft py-8 sm:flex-row sm:gap-10">
                {/* 왼쪽 칸은 기간과 맡은 역할 — Work 의 연도·종류 자리와 같다 */}
                <div className="flex w-28 shrink-0 flex-col gap-1.5 pt-1">
                  <span className="label">{item.period}</span>
                  <span className="label">{item.role}</span>
                </div>

                <div className="min-w-0">
                  <h2 className="font-display text-xl font-light leading-snug tracking-[0.01em] text-ink sm:text-2xl">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-[1.8] text-body">
                    {item.body}
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
