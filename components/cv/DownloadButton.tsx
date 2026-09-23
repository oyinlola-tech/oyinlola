import { Download } from "lucide-react";
import { CV_PDF } from "@/content/cv";

/**
 * "Download PDF" serves a PDF that was printed from this page ahead of time
 * by `npm run cv:pdf`, rather than opening the visitor's print dialog.
 *
 * The print dialog made the result depend on the visitor's browser: Safari
 * and Firefox drop page backgrounds, most mobile browsers mangle the layout,
 * and a "Background graphics" checkbox decided whether the design survived at
 * all. A file printed once by Chromium is the same A4 document for everyone —
 * and still real text, so it stays selectable, searchable and ATS-readable.
 */
export default function DownloadButton({ label = "Download PDF" }: { label?: string }) {
  return (
    <a
      href={CV_PDF.href}
      download={CV_PDF.filename}
      className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[0.95rem] font-medium text-stage transition-colors duration-300 hover:bg-accent"
    >
      <Download className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
      {label}
    </a>
  );
}
