"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DashboardData = {
  jobsPosted: number;
  applicants: number;
  upcomingEvents: number;
};

const DEFAULT_DATA: DashboardData = {
  jobsPosted: 5,
  applicants: 9,
  upcomingEvents: 2,
};

export default function EmployerHomePage() {
  const [dashboard, setDashboard] = useState<DashboardData>(DEFAULT_DATA);
  const [draft, setDraft] = useState<DashboardData>(DEFAULT_DATA);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [editDashboardOpen, setEditDashboardOpen] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const savedDashboard = localStorage.getItem("waypoint-dashboard");

    if (savedDashboard) {
      try {
        const parsedDashboard = JSON.parse(savedDashboard) as DashboardData;
        setDashboard(parsedDashboard);
        setDraft(parsedDashboard);
      } catch {
        setDashboard(DEFAULT_DATA);
        setDraft(DEFAULT_DATA);
      }
    }
  }, []);

  function openDashboardEditor() {
    setDraft(dashboard);
    setEditDashboardOpen(true);
    setSavedMessage("");
  }

  function saveDashboard() {
    const cleanData: DashboardData = {
      jobsPosted: Math.max(0, Number(draft.jobsPosted) || 0),
      applicants: Math.max(0, Number(draft.applicants) || 0),
      upcomingEvents: Math.max(0, Number(draft.upcomingEvents) || 0),
    };

    localStorage.setItem("waypoint-dashboard", JSON.stringify(cleanData));
    setDashboard(cleanData);
    setDraft(cleanData);
    setSavedMessage("Dashboard information saved successfully.");

    window.setTimeout(() => {
      setEditDashboardOpen(false);
      setSavedMessage("");
    }, 900);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-[#f4f2ec] text-[#17201e]">
      <header className="sticky top-0 z-40 border-b border-[#e2e5df] bg-white">
        <div className="mx-auto flex h-[86px] max-w-[1440px] items-center justify-between px-6 lg:px-12">
          <Link href="/home" className="flex items-center gap-3">
            <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-[#1f6b4f]">
              <span className="h-2 w-2 rounded-full bg-[#1f6b4f]" />
            </span>

            <span className="font-serif text-3xl font-semibold">Waypoint</span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/home"
              className="rounded-xl bg-[#e5efe9] px-6 py-3 font-medium text-[#155b42]"
            >
              Home
            </Link>

            <Link
              href="/jobs"
              className="rounded-xl px-5 py-3 font-medium hover:bg-[#f2f5f3]"
            >
              Job Posting
            </Link>

            <Link
              href="/events"
              className="rounded-xl px-5 py-3 font-medium hover:bg-[#f2f5f3]"
            >
              Event Scheduling
            </Link>
          </nav>

          <div className="relative flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                aria-label="Open notifications"
                onClick={() => {
                  setNotificationsOpen((current) => !current);
                  setProfileMenuOpen(false);
                }}
                className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-[#f2f5f3]"
              >
                <span className="text-2xl">♢</span>

                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#1f9d67]" />
              </button>

              {notificationsOpen && (
                <section className="absolute right-0 top-14 w-80 rounded-2xl border border-[#e0e4de] bg-white p-4 shadow-xl">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="font-semibold">Notifications</h2>

                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-sm text-[#5e6965]"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl bg-[#f4f8f5] p-3">
                      <p className="font-medium">New applicant received</p>
                      <p className="mt-1 text-sm text-[#66716d]">
                        A candidate applied for your recent job posting.
                      </p>
                    </div>

                    <div className="rounded-xl bg-[#f4f8f5] p-3">
                      <p className="font-medium">Upcoming hiring event</p>
                      <p className="mt-1 text-sm text-[#66716d]">
                        Review your scheduled event information.
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setProfileMenuOpen((current) => !current);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-3 rounded-xl p-2 text-left hover:bg-[#f2f5f3]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#0e1c22] font-semibold text-white">
                JH
              </span>

              <span className="hidden sm:block">
                <strong className="block">Jhansi</strong>
                <span className="text-sm text-[#68716e]">Employer</span>
              </span>

              <span aria-hidden="true">⌄</span>
            </button>

            {profileMenuOpen && (
              <section className="absolute right-0 top-16 w-64 overflow-hidden rounded-2xl border border-[#e0e4de] bg-white shadow-xl">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 border-b border-[#e7e9e5] px-5 py-4 hover:bg-[#f4f7f5]"
                >
                  <span>♙</span>
                  <span className="font-medium">Profile</span>
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center gap-3 border-b border-[#e7e9e5] px-5 py-4 hover:bg-[#f4f7f5]"
                >
                  <span>⚙</span>
                  <span className="font-medium">Settings</span>
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left font-medium text-red-600 hover:bg-red-50"
                >
                  <span>↪</span>
                  Logout
                </button>
              </section>
            )}
          </div>
        </div>
      </header>

      <section className="bg-[#101c21] text-white">
        <div className="mx-auto max-w-[1220px] px-6 py-20 lg:px-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row">
            <div>
              <p className="mb-5 text-sm font-bold tracking-[0.22em] text-[#69e4a5]">
                WELCOME BACK TO WAYPOINT
              </p>

              <h1 className="max-w-3xl font-serif text-5xl leading-tight md:text-6xl">
                Reach the right candidates,
                <br />
                not just more of them.
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-[#d4dcda]">
                Manage your company profile, publish jobs, schedule hiring
                events, and review employee applications in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={openDashboardEditor}
              className="h-fit rounded-xl border border-[#65d99e] px-5 py-3 font-semibold text-[#65d99e] hover:bg-[#17332a]"
            >
              Edit dashboard
            </button>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <DashboardCard
              number={dashboard.jobsPosted}
              label="Open postings"
              icon="▣"
            />

            <DashboardCard
              number={dashboard.applicants}
              label="Applicants"
              icon="♙"
            />

            <DashboardCard
              number={dashboard.upcomingEvents}
              label="Upcoming events"
              icon="□"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1220px] px-6 py-16 lg:px-8">
        <p className="text-sm font-bold tracking-[0.2em] text-[#728079]">
          ABOUT WAYPOINT FOR EMPLOYERS
        </p>

        <h2 className="mt-4 max-w-5xl font-serif text-4xl leading-tight">
          Post once, meet candidates who are actually qualified and actually
          nearby.
        </h2>

        <p className="mt-6 max-w-4xl text-lg leading-8 text-[#59645f]">
          Waypoint helps employers publish jobs, schedule hiring events, review
          applicants, and maintain company information from one workspace.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon="⌖"
            title="Local-first reach"
            description="Connect with qualified candidates who are available near your preferred hiring locations."
          />

          <FeatureCard
            icon="✓"
            title="Smarter hiring workflow"
            description="Manage job postings, applicants, events, and employer information from one organized portal."
          />

          <FeatureCard
            icon="▣"
            title="Employer tools"
            description="Use profile, notifications, settings, and hiring information to manage your recruitment activity."
          />
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <Link
            href="/profile"
            className="rounded-2xl border border-[#dde2dc] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm font-bold text-[#1f6b4f]">EMPLOYER PROFILE</p>
            <h3 className="mt-2 text-xl font-semibold">Manage company profile</h3>
            <p className="mt-3 text-[#69736f]">
              Update employer details, company information, hiring focus, and
              team members.
            </p>
          </Link>

          <Link
            href="/settings"
            className="rounded-2xl border border-[#dde2dc] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm font-bold text-[#1f6b4f]">SETTINGS</p>
            <h3 className="mt-2 text-xl font-semibold">Manage preferences</h3>
            <p className="mt-3 text-[#69736f]">
              Control notifications, account security, appearance, and advanced
              privacy features.
            </p>
          </Link>

          <button
            type="button"
            onClick={openDashboardEditor}
            className="rounded-2xl border border-[#dde2dc] bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm font-bold text-[#1f6b4f]">DASHBOARD</p>
            <h3 className="mt-2 text-xl font-semibold">Update summary</h3>
            <p className="mt-3 text-[#69736f]">
              Update jobs posted, applicants, and scheduled event totals.
            </p>
          </button>
        </div>
      </section>

      {editDashboardOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <section className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-serif text-3xl">Edit dashboard</h2>
                <p className="mt-2 text-[#69736f]">
                  These values are saved in this browser.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditDashboardOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full bg-[#f1f3f0] text-xl"
              >
                ×
              </button>
            </div>

            <div className="mt-7 space-y-5">
              <NumberField
                label="Open postings"
                value={draft.jobsPosted}
                onChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    jobsPosted: value,
                  }))
                }
              />

              <NumberField
                label="Applicants"
                value={draft.applicants}
                onChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    applicants: value,
                  }))
                }
              />

              <NumberField
                label="Upcoming events"
                value={draft.upcomingEvents}
                onChange={(value) =>
                  setDraft((current) => ({
                    ...current,
                    upcomingEvents: value,
                  }))
                }
              />
            </div>

            {savedMessage && (
              <p className="mt-5 rounded-xl bg-green-50 p-3 font-medium text-green-700">
                {savedMessage}
              </p>
            )}

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditDashboardOpen(false)}
                className="rounded-xl border border-[#d6dbd5] px-5 py-3 font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveDashboard}
                className="rounded-xl bg-[#176b4d] px-5 py-3 font-semibold text-white hover:bg-[#12573f]"
              >
                Save changes
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

function DashboardCard({
  number,
  label,
  icon,
}: {
  number: number;
  label: string;
  icon: string;
}) {
  return (
    <article className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 p-7">
      <div>
        <p className="font-serif text-5xl">{number}</p>
        <p className="mt-2 text-lg">{label}</p>
      </div>

      <span className="grid h-14 w-14 place-items-center rounded-full bg-[#173b30] text-2xl text-[#68e5a6]">
        {icon}
      </span>
    </article>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-[#dde2dc] bg-white p-6 shadow-sm">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#e8f2ec] text-xl text-[#176b4d]">
        {icon}
      </span>

      <h3 className="mt-5 text-xl font-semibold">{title}</h3>
      <p className="mt-3 leading-7 text-[#69736f]">{description}</p>
    </article>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-semibold">{label}</span>

      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-xl border border-[#d5dad4] px-4 py-3 outline-none focus:border-[#176b4d] focus:ring-2 focus:ring-[#176b4d]/15"
      />
    </label>
  );
}