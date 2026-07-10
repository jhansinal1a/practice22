import { initials, type Stage } from "@/lib/data";
import { stageStyle } from "@/lib/stage";

export function Avatar({
  name,
  size = "sm",
  ring = false,
}: {
  name: string;
  size?: "sm" | "lg";
  ring?: boolean;
}) {
  const dim = size === "lg" ? "h-11 w-11 text-sm" : "h-9 w-9 text-xs";
  const border = ring ? "ring-2 ring-forest-600" : "ring-1 ring-line";
  return (
    <span
      className={`grid ${dim} shrink-0 place-items-center rounded-full bg-cream font-medium text-forest ${border}`}
    >
      {initials(name)}
    </span>
  );
}

export function StatusBadge({ stage }: { stage: Stage }) {
  const s = stageStyle[stage];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {stage}
    </span>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-gold" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden>
          {i < rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}
