import type { ReactNode } from "react";
import Reveal from "./Reveal";

export default function SectionHead({
  index,
  label,
  title,
  lede,
}: {
  index: string;
  label: string;
  title: ReactNode;
  lede?: string;
}) {
  return (
    <div className="mb-14 grid gap-8 border-t border-line pt-8 md:grid-cols-12 md:gap-10 lg:mb-20">
      <Reveal className="md:col-span-4">
        <p className="label flex items-center gap-3">
          <span className="text-accent">{index}</span>
          <span className="h-px w-8 bg-line-2" />
          {label}
        </p>
      </Reveal>
      <div className="md:col-span-8">
        <Reveal delay={60}>
          <h2 className="display text-[clamp(2rem,5.2vw,3.6rem)] text-ink">{title}</h2>
        </Reveal>
        {lede ? (
          <Reveal delay={120}>
            <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-dim">{lede}</p>
          </Reveal>
        ) : null}
      </div>
    </div>
  );
}
