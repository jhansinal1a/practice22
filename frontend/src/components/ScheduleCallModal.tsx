"use client";

import { useState } from "react";

/** Formats a datetime-local value ("2026-07-12T14:00") as "Jul 12, 2:00 PM". */
export function formatCallTime(value: string): string {
  const d = new Date(value);
  const month = d.toLocaleString("en-US", { month: "short" });
  const day = d.getDate();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = d.getHours() >= 12 ? "PM" : "AM";
  const hour = d.getHours() % 12 || 12;
  return `${month} ${day}, ${hour}:${minutes} ${ampm}`;
}

export function ScheduleCallModal({
  applicantName,
  reschedule,
  busy,
  onCancel,
  onConfirm,
}: {
  applicantName: string;
  reschedule: boolean;
  busy: boolean;
  onCancel: () => void;
  onConfirm: (callTime: string) => void;
}) {
  const [value, setValue] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-xl border border-line bg-surface p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-serif text-xl text-ink">
          {reschedule ? "Reschedule call" : "Schedule call"}
        </h3>
        <p className="mt-1 text-sm text-muted">with {applicantName}</p>

        <label className="mt-5 block text-[11px] font-medium uppercase tracking-wide text-faint">
          Date &amp; time
        </label>
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition hover:bg-cream"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!value || busy}
            onClick={() => onConfirm(formatCallTime(value))}
            className="rounded-md bg-forest px-4 py-2 text-sm font-medium text-white transition hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Saving…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
