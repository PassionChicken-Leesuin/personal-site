import Reveal from "@/components/Reveal";
import { TreeSpine, Branch, TreeRoots } from "@/components/Tree";
import { journey } from "@/content";
import { SectionLabel } from "./shared";

export default function Journey() {
  return (
    // id="journey" — ScrollDriver 가 이 섹션의 진행도로 --tree 를 계산한다
    <section id="journey">
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
  );
}
