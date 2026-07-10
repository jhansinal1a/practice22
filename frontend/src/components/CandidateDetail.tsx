import type { Applicant } from "@/lib/data";
import { Avatar, Stars, StatusBadge } from "./primitives";
import { PipelineBar } from "./PipelineBar";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-medium uppercase tracking-wide text-faint">
      {children}
    </div>
  );
}

export function CandidateDetail({
  applicant,
  busy,
  onViewResume,
  onMoveToSelected,
  onScheduleCall,
}: {
  applicant: Applicant;
  busy: boolean;
  onViewResume: () => void;
  onMoveToSelected: () => void;
  onScheduleCall: () => void;
}) {
  const isSelected = applicant.stage === "Selected";

  return (
    <section className="rounded-xl border border-line bg-surface p-8 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={applicant.name} size="lg" />
          <div>
            <h2 className="font-serif text-2xl text-ink">{applicant.name}</h2>
            <p className="text-sm text-muted">
              {applicant.posting} · Applied {applicant.appliedOn}
            </p>
          </div>
        </div>
        <StatusBadge stage={applicant.stage} />
      </div>

      <div className="mt-6">
        <PipelineBar stage={applicant.stage} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 border-t border-line pt-6 sm:grid-cols-3 sm:divide-x sm:divide-line">
        <div className="sm:pr-6">
          <Label>Resume</Label>
          <p className="mt-2 text-sm text-ink">📄 {applicant.resumeFile}</p>
        </div>
        <div className="sm:px-6">
          <Label>Resume score</Label>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 rounded-full bg-line">
              <div
                className="h-1.5 rounded-full bg-forest"
                style={{ width: `${applicant.resumeScore}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-ink">{applicant.resumeScore}</span>
          </div>
        </div>
        <div className="sm:pl-6">
          <Label>Call scheduled</Label>
          <p className="mt-2 text-sm text-ink">{applicant.callTime ?? "—"}</p>
        </div>
      </div>

      {applicant.review && (
        <div className="mt-6 rounded-lg border border-line bg-cream/50 p-5">
          <Stars rating={applicant.review.rating} />
          <p className="mt-3 text-sm text-ink">{applicant.review.text}</p>
          <p className="mt-2 text-xs text-muted">Review by {applicant.review.author}</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onViewResume}
          className="rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:bg-cream"
        >
          View resume
        </button>
        <button
          type="button"
          onClick={onScheduleCall}
          disabled={busy}
          className="rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50"
        >
          {applicant.callTime ? "Reschedule call" : "Schedule call"}
        </button>
        <button
          type="button"
          onClick={onMoveToSelected}
          disabled={isSelected || busy}
          className="rounded-md bg-forest px-4 py-2 text-sm font-medium text-white transition hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSelected ? "Selected" : "Move to Selected"}
        </button>
      </div>
    </section>
  );
}
