import { LOGO_PATHS, LOGO_VIEWBOX } from "@/lib/logo";

type Props = {
  /** "light" = navy + orange for pearl backgrounds, "dark" = pearl + orange for navy. */
  tone?: "light" | "dark";
  withWordmark?: boolean;
  className?: string;
};

export function Logo({ tone = "light", withWordmark = true, className }: Props) {
  const base = tone === "light" ? "var(--logo-base, var(--navy))" : "var(--pearl)";
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <svg
        viewBox={LOGO_VIEWBOX}
        className="h-[1.35em] w-auto shrink-0"
        aria-hidden="true"
        focusable="false"
      >
        <path d={LOGO_PATHS.base} fill={base} />
        <path d={LOGO_PATHS.arc} fill="var(--orange)" />
        <path d={LOGO_PATHS.stem} fill="var(--orange)" />
        <path d={LOGO_PATHS.dot} fill="var(--orange)" />
      </svg>
      {withWordmark && (
        <span className="meta !text-[0.72rem] !tracking-[0.14em] font-medium">
          AI SEO For Me
        </span>
      )}
    </span>
  );
}
