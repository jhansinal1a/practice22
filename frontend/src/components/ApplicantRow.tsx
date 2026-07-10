import type { Applicant } from "@/lib/data";
import { Avatar, StatusBadge } from "./primitives";

export function ApplicantRow({
  applicant,
  selected,
  onSelect,
}: {
  applicant: Applicant;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full border-l-2 px-5 py-4 text-left transition ${
        selected
          ? "border-forest bg-cream/70"
          : "border-transparent hover:bg-cream/40"
      }`}
    >
      <div className="flex items-start gap-3">
        <Avatar name={applicant.name} ring={selected} />
        <div className="min-w-0">
          <div className="font-semibold text-ink">{applicant.name}</div>
          <div className="truncate text-sm text-muted">
            {applicant.posting} · Applied {applicant.appliedOn}
          </div>
          <div className="mt-1.5">
            <StatusBadge stage={applicant.stage} />
          </div>
        </div>
      </div>
    </button>
  );
}
