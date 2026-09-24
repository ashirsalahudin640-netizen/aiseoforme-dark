import { LOGO_PATHS, LOGO_VIEWBOX } from "@/lib/logo";

type Props = {
  /** "light" = official navy + orange; "pearl" = single-colour mark for orange grounds. */
  tone?: "light" | "pearl";
  withWordmark?: boolean;
  className?: string;
};

export function Logo({ tone = "light", withWordmark = true, className }: Props) {
  const base = tone === "light" ? "var(--logo-base, var(--navy))" : "var(--pearl)";
  const accent = tone === "light" ? "var(--logo-accent, var(--orange))" : "var(--pearl)";
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <svg
        viewBox={LOGO_VIEWBOX}
        className="h-[1.35em] w-auto shrink-0"
        aria-hidden="true"
        focusable="false"
      >
        <path d={LOGO_PATHS.base} fill={base} style={{ transition: "fill 300ms ease" }} />
        <path d={LOGO_PATHS.arc} fill={accent} style={{ transition: "fill 300ms ease" }} />
        <path d={LOGO_PATHS.stem} fill={accent} style={{ transition: "fill 300ms ease" }} />
        <path d={LOGO_PATHS.dot} fill={accent} style={{ transition: "fill 300ms ease" }} />
      </svg>
      {withWordmark && (
        <span className="text-[0.95rem] font-semibold tracking-[-0.02em]">AI SEO For Me</span>
      )}
    </span>
  );
}
