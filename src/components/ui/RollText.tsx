/**
 * Letters roll up to an identical copy on hover of the nearest `.roll-host`.
 * Screen readers get the plain string once.
 */
export function RollText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`roll ${className ?? ""}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex">
        {Array.from(text).map((c, i) => (
          <span
            key={i}
            className="roll-char"
            data-c={c}
            style={{ "--i": i } as React.CSSProperties}
          >
            {c}
          </span>
        ))}
      </span>
    </span>
  );
}
