import type { ReactNode } from "react";
import Reveal from "./Reveal";

/**
 * The masthead every interior page opens with. Keeps the eyebrow / title /
 * lede rhythm identical across Work, About, Stack and Contact.
 */
export default function PageHeader({
  index,
  label,
  title,
  lede,
  aside,
}: {
  index: string;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="shell pb-14 pt-36 sm:pt-44 lg:pb-20 lg:pt-52">
      <Reveal>
        <p className="label flex items-center gap-3">
          <span className="text-accent">{index}</span>
          <span className="h-px w-8 bg-line-2" />
          {label}
        </p>
      </Reveal>

      <Reveal delay={60}>
        <h1 className="display mt-8 max-w-[16ch] text-[clamp(2.6rem,7.5vw,5.6rem)] text-ink">
          {title}
        </h1>
      </Reveal>

      {lede ? (
        <Reveal delay={120}>
          <div className="mt-8 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-dim">{lede}</div>
        </Reveal>
      ) : null}

      {aside ? <Reveal delay={180}>{aside}</Reveal> : null}
    </header>
  );
}
