"use client";

import { Download } from "lucide-react";

/**
 * "Download PDF" is the browser's own print-to-PDF.
 *
 * A rasterising library would produce a picture of the CV — unselectable,
 * unsearchable, and soft at any zoom. Printing keeps the text as text and
 * the links live, and the @media print rules in globals.css turn the dark
 * screen document into a clean monochrome A4 page on the way out.
 */
export default function PrintButton({
  className = "",
  label = "Download PDF",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={
        className ||
        "group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[0.95rem] font-medium text-stage transition-colors duration-300 hover:bg-accent"
      }
    >
      <Download className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
      {label}
    </button>
  );
}
