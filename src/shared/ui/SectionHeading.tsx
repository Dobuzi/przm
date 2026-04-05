interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  body?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  body,
}: SectionHeadingProps) {
  return (
    <header className="space-y-1">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ocean/70">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {body ? <p className="text-sm leading-6 text-slate-600">{body}</p> : null}
    </header>
  );
}

