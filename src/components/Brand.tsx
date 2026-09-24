"use client";

import { scrollToId } from "@/lib/store";
import { contact } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { RollText } from "@/components/ui/RollText";

/** Fixed top bar: logo left, direct email right. Navigation lives in the dock. */
export function Brand() {
  return (
    <header className="frame pointer-events-none fixed inset-x-0 top-0 z-[60] flex items-center justify-between py-5">
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("top");
        }}
        className="press pointer-events-auto crystal rounded-full px-4 py-2.5 text-ink"
        aria-label="AI SEO For Me, back to top"
      >
        <Logo />
      </a>
      <a
        href={`mailto:${contact.email}`}
        className="roll-host pointer-events-auto hidden crystal rounded-full px-5 py-3 text-sm font-medium text-ink sm:block"
      >
        <RollText text={contact.email} />
      </a>
    </header>
  );
}
