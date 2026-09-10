import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70svh] flex-col justify-center py-32">
      <p className="label text-accent">404</p>
      <h1 className="display mt-6 text-[clamp(2.5rem,7vw,5rem)] text-ink">
        Nothing here.
      </h1>
      <p className="mt-6 max-w-md text-ink-dim">
        That page doesn&rsquo;t exist — or it moved while you weren&rsquo;t looking.
      </p>
      <Link
        href="/"
        className="group mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-line-2 px-5 py-2.5 text-sm text-ink-dim transition-colors hover:border-ink/30 hover:text-ink"
      >
        <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
        Back home
      </Link>
    </section>
  );
}
