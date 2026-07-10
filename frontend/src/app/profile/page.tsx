"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type EmployerProfile = {
  employerName: string;
  companyName: string;
  role: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  industry: string;
  companySize: string;
  founded: string;
  timezone: string;
  aboutCompany: string;
  workTypes: string;
  preferredLocations: string;
  interviewMode: string;
  hiringVolume: string;
};

type TeamMember = {
  id: number;
  name: string;
  role: string;
  access: string;
};

const defaultProfile: EmployerProfile = {
  employerName: "Jhansi",
  companyName: "Waypoint Hiring Solutions",
  role: "Employer / Hiring Manager",
  email: "jhansi@waypointhire.com",
  phone: "+1 (512) 555-0148",
  website: "www.waypointhire.com",
  location: "Austin, Texas, USA",
  industry: "Technology, Information Services",
  companySize: "51–200 employees",
  founded: "2019",
  timezone: "Central Time (CT)",
  aboutCompany:
    "Waypoint Hiring Solutions helps organizations connect with top talent through smart hiring workflows, local reach, and event-driven engagement. We partner with companies to build high-performing teams and accelerate growth.",
  workTypes: "Remote, Hybrid, On-site",
  preferredLocations: "Austin, TX · Remote (US) · Bangalore, IN",
  interviewMode: "Video · In-person · On-site",
  hiringVolume: "11–25 hires per quarter",
};

const defaultTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Jhansi",
    role: "Employer / Owner",
    access: "Owner",
  },
  {
    id: 2,
    name: "Ramesh Kumar",
    role: "Recruiter",
    access: "Admin",
  },
  {
    id: 3,
    name: "Sneha Patel",
    role: "Talent Sourcer",
    access: "Member",
  },
];

export default function EmployerProfilePage() {
  const [profile, setProfile] = useState<EmployerProfile>(defaultProfile);
  const [draft, setDraft] = useState<EmployerProfile>(defaultProfile);
  const [teamMembers, setTeamMembers] =
    useState<TeamMember[]>(defaultTeamMembers);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [newMemberAccess, setNewMemberAccess] = useState("Member");

  useEffect(() => {
    const savedProfile = localStorage.getItem("waypoint-employer-profile");
    const savedTeamMembers = localStorage.getItem("waypoint-team-members");

    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile) as EmployerProfile;
        setProfile(parsed);
        setDraft(parsed);
      } catch {
        setProfile(defaultProfile);
      }
    }

    if (savedTeamMembers) {
      try {
        const parsed = JSON.parse(savedTeamMembers) as TeamMember[];
        setTeamMembers(parsed);
      } catch {
        setTeamMembers(defaultTeamMembers);
      }
    }
  }, []);

  function openEditProfile() {
    setDraft(profile);
    setSavedMessage("");
    setEditProfileOpen(true);
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    localStorage.setItem(
      "waypoint-employer-profile",
      JSON.stringify(draft),
    );

    setProfile(draft);
    setSavedMessage("Employer profile saved successfully.");

    window.setTimeout(() => {
      setEditProfileOpen(false);
      setSavedMessage("");
    }, 900);
  }

  function addTeamMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newMemberName.trim() || !newMemberRole.trim()) {
      return;
    }

    const member: TeamMember = {
      id: Date.now(),
      name: newMemberName.trim(),
      role: newMemberRole.trim(),
      access: newMemberAccess,
    };

    const updatedMembers = [...teamMembers, member];

    setTeamMembers(updatedMembers);
    localStorage.setItem(
      "waypoint-team-members",
      JSON.stringify(updatedMembers),
    );

    setNewMemberName("");
    setNewMemberRole("");
    setNewMemberAccess("Member");
    setInviteOpen(false);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-[#f4f2ec] text-[#15201e]">
      <Header
        profileMenuOpen={profileMenuOpen}
        notificationsOpen={notificationsOpen}
        setProfileMenuOpen={setProfileMenuOpen}
        setNotificationsOpen={setNotificationsOpen}
        logout={logout}
      />

      <section className="bg-[#101c22] px-6 pb-28 pt-12 text-white lg:px-12">
        <div className="mx-auto flex max-w-[1360px] items-start justify-between gap-8">
          <div>
            <h1 className="font-serif text-5xl md:text-6xl">
              Employer Profile
            </h1>

            <p className="mt-3 text-lg text-[#d4dcda]">
              Manage your company details, hiring presence, and employer
              information.
            </p>
          </div>

          <button
            type="button"
            onClick={openEditProfile}
            className="rounded-xl border border-[#5c766d] px-6 py-4 font-semibold text-[#61dfa0] transition hover:bg-[#17322a]"
          >
            ✎ Edit Profile
          </button>
        </div>
      </section>

      <div className="mx-auto -mt-20 max-w-[1360px] space-y-6 px-6 pb-12 lg:px-10">
        <section className="rounded-3xl border border-[#e0e4df] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <span className="text-2xl text-[#14704d]">▥</span>
            <h2 className="text-xl font-semibold">
              Hiring Performance Summary
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <SummaryCard
              icon="▣"
              value="24"
              label="Jobs Posted"
              iconClass="bg-[#e3f2e9] text-[#14704d]"
            />

            <SummaryCard
              icon="□"
              value="8"
              label="Events Scheduled"
              iconClass="bg-[#e8f2ff] text-[#1468d4]"
            />

            <SummaryCard
              icon="♙"
              value="16"
              label="Employees Hired"
              iconClass="bg-[#e5f2e9] text-[#14704d]"
            />
          </div>
        </section>

        <section className="grid gap-8 rounded-3xl border border-[#e0e4df] bg-white p-8 shadow-sm lg:grid-cols-[1.2fr_1fr_1fr]">
          <div className="flex gap-7">
            <div className="relative grid h-40 w-40 shrink-0 place-items-center rounded-full bg-[#10202a] text-6xl font-semibold text-white">
              JH

              <button
                type="button"
                onClick={openEditProfile}
                className="absolute bottom-2 right-2 grid h-11 w-11 place-items-center rounded-full border-4 border-white bg-[#14704d] text-white"
              >
                ✎
              </button>
            </div>

            <div>
              <h2 className="font-serif text-4xl">{profile.employerName}</h2>

              <p className="mt-1 text-lg font-semibold text-[#14704d]">
                {profile.companyName}
              </p>

              <span className="mt-3 inline-block rounded-lg bg-[#e7f1ea] px-3 py-1 text-sm font-medium text-[#216447]">
                {profile.role}
              </span>

              <div className="mt-5 space-y-2 text-[#5f6965]">
                <p>✉ {profile.email}</p>
                <p>☎ {profile.phone}</p>
                <p>◉ {profile.website}</p>
                <p>⌖ {profile.location}</p>
              </div>
            </div>
          </div>

          <div className="border-l border-[#e2e5e1] pl-8">
            <ProfileDetail label="Industry" value={profile.industry} />
            <ProfileDetail label="Company Size" value={profile.companySize} />
            <ProfileDetail label="Founded" value={profile.founded} />
            <ProfileDetail label="Timezone" value={profile.timezone} />
          </div>

          <div className="border-l border-[#e2e5e1] pl-8">
            <h3 className="text-lg font-semibold">About Company</h3>

            <p className="mt-4 leading-7 text-[#64706b]">
              {profile.aboutCompany}
            </p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <section className="rounded-2xl border border-[#e0e4df] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">◎ Hiring Focus</h3>

              <div className="mt-5 flex flex-wrap gap-3">
                {[
                  "Software Engineering",
                  "QA Automation",
                  "Data & AI",
                  "DevOps",
                  "Full Stack",
                  "Event Hiring",
                ].map((focus) => (
                  <span
                    key={focus}
                    className="rounded-lg bg-[#e8f2eb] px-4 py-2 text-sm font-medium text-[#176748]"
                  >
                    {focus}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e0e4df] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">
                ▣ Workplace & Hiring Details
              </h3>

              <div className="mt-5 space-y-3 text-sm">
                <DetailLine label="Work Types" value={profile.workTypes} />
                <DetailLine
                  label="Preferred Locations"
                  value={profile.preferredLocations}
                />
                <DetailLine
                  label="Interview Mode"
                  value={profile.interviewMode}
                />
                <DetailLine
                  label="Hiring Volume"
                  value={profile.hiringVolume}
                />
              </div>
            </section>
          </div>

          <section className="rounded-2xl border border-[#e0e4df] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">
              ◉ Social & Company Links
            </h3>

            <div className="mt-6 space-y-6">
              <SocialLink
                name="Website"
                value={profile.website}
                href={`https://${profile.website}`}
              />

              <SocialLink
                name="LinkedIn"
                value="linkedin.com/company/waypoint-hiring"
                href="https://linkedin.com"
              />

              <SocialLink
                name="Twitter / X"
                value="x.com/waypointhire"
                href="https://x.com"
              />

              <SocialLink
                name="Facebook"
                value="facebook.com/waypointhire"
                href="https://facebook.com"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-[#e0e4df] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">♙ Team Members</h3>

              <button
                type="button"
                onClick={() =>
                  alert(`Total team members: ${teamMembers.length}`)
                }
                className="font-semibold text-[#14704d]"
              >
                View all
              </button>
            </div>

            <div className="mt-6 space-y-5">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-[#10202a] font-semibold text-white">
                      {member.name
                        .split(" ")
                        .map((word) => word.charAt(0))
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>

                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-[#6a746f]">{member.role}</p>
                    </div>
                  </div>

                  <span className="rounded-lg bg-[#e8f2eb] px-3 py-1 text-sm font-medium text-[#176748]">
                    {member.access}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setInviteOpen(true)}
              className="mt-7 w-full rounded-xl border border-[#d9ded9] px-4 py-3 font-semibold text-[#14704d] hover:bg-[#f2f7f4]"
            >
              ＋ Invite Team Member
            </button>
          </section>
        </div>

        <section className="rounded-2xl border border-[#e0e4df] bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">⌁ Recent Activity</h3>

            <button
              type="button"
              onClick={() => alert("Showing all employer activity.")}
              className="font-semibold text-[#14704d]"
            >
              View all activity
            </button>
          </div>

          <div className="mt-7 grid gap-6 md:grid-cols-3">
            <Activity
              icon="♙"
              title="Profile updated"
              description="You updated company information"
              date="July 10, 2026 · 10:24 AM"
            />

            <Activity
              icon="▣"
              title="New job posted"
              description="Senior Full Stack Developer"
              date="July 10, 2026 · 3:45 PM"
            />

            <Activity
              icon="□"
              title="Event scheduled"
              description="Austin Tech Hiring Day"
              date="July 8, 2026 · 11:15 AM"
            />
          </div>
        </section>
      </div>

      {editProfileOpen && (
        <Modal title="Edit Employer Profile" onClose={() => setEditProfileOpen(false)}>
          <form onSubmit={saveProfile}>
            <div className="grid max-h-[62vh] gap-5 overflow-y-auto pr-2 md:grid-cols-2">
              <FormField
                label="Employer name"
                value={draft.employerName}
                onChange={(value) =>
                  setDraft({ ...draft, employerName: value })
                }
              />

              <FormField
                label="Company name"
                value={draft.companyName}
                onChange={(value) =>
                  setDraft({ ...draft, companyName: value })
                }
              />

              <FormField
                label="Role"
                value={draft.role}
                onChange={(value) => setDraft({ ...draft, role: value })}
              />

              <FormField
                label="Email"
                value={draft.email}
                onChange={(value) => setDraft({ ...draft, email: value })}
              />

              <FormField
                label="Phone"
                value={draft.phone}
                onChange={(value) => setDraft({ ...draft, phone: value })}
              />

              <FormField
                label="Website"
                value={draft.website}
                onChange={(value) => setDraft({ ...draft, website: value })}
              />

              <FormField
                label="Location"
                value={draft.location}
                onChange={(value) =>
                  setDraft({ ...draft, location: value })
                }
              />

              <FormField
                label="Industry"
                value={draft.industry}
                onChange={(value) =>
                  setDraft({ ...draft, industry: value })
                }
              />

              <FormField
                label="Company size"
                value={draft.companySize}
                onChange={(value) =>
                  setDraft({ ...draft, companySize: value })
                }
              />

              <FormField
                label="Founded"
                value={draft.founded}
                onChange={(value) =>
                  setDraft({ ...draft, founded: value })
                }
              />

              <FormField
                label="Timezone"
                value={draft.timezone}
                onChange={(value) =>
                  setDraft({ ...draft, timezone: value })
                }
              />

              <FormField
                label="Work types"
                value={draft.workTypes}
                onChange={(value) =>
                  setDraft({ ...draft, workTypes: value })
                }
              />

              <FormField
                label="Preferred locations"
                value={draft.preferredLocations}
                onChange={(value) =>
                  setDraft({ ...draft, preferredLocations: value })
                }
              />

              <FormField
                label="Interview mode"
                value={draft.interviewMode}
                onChange={(value) =>
                  setDraft({ ...draft, interviewMode: value })
                }
              />

              <FormField
                label="Hiring volume"
                value={draft.hiringVolume}
                onChange={(value) =>
                  setDraft({ ...draft, hiringVolume: value })
                }
              />

              <label className="md:col-span-2">
                <span className="mb-2 block font-semibold">
                  About company
                </span>

                <textarea
                  rows={5}
                  value={draft.aboutCompany}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      aboutCompany: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[#d4dad5] px-4 py-3 outline-none focus:border-[#14704d]"
                />
              </label>
            </div>

            {savedMessage && (
              <p className="mt-5 rounded-xl bg-green-50 p-3 font-medium text-green-700">
                {savedMessage}
              </p>
            )}

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditProfileOpen(false)}
                className="rounded-xl border border-[#d4dad5] px-5 py-3 font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-[#14704d] px-5 py-3 font-semibold text-white"
              >
                Save Profile
              </button>
            </div>
          </form>
        </Modal>
      )}

      {inviteOpen && (
        <Modal title="Invite Team Member" onClose={() => setInviteOpen(false)}>
          <form onSubmit={addTeamMember} className="space-y-5">
            <FormField
              label="Member name"
              value={newMemberName}
              onChange={setNewMemberName}
            />

            <FormField
              label="Role"
              value={newMemberRole}
              onChange={setNewMemberRole}
            />

            <label className="block">
              <span className="mb-2 block font-semibold">Access level</span>

              <select
                value={newMemberAccess}
                onChange={(event) => setNewMemberAccess(event.target.value)}
                className="w-full rounded-xl border border-[#d4dad5] px-4 py-3"
              >
                <option>Member</option>
                <option>Admin</option>
                <option>Owner</option>
              </select>
            </label>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setInviteOpen(false)}
                className="rounded-xl border border-[#d4dad5] px-5 py-3 font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-[#14704d] px-5 py-3 font-semibold text-white"
              >
                Add Member
              </button>
            </div>
          </form>
        </Modal>
      )}
    </main>
  );
}

function Header({
  profileMenuOpen,
  notificationsOpen,
  setProfileMenuOpen,
  setNotificationsOpen,
  logout,
}: {
  profileMenuOpen: boolean;
  notificationsOpen: boolean;
  setProfileMenuOpen: (value: boolean) => void;
  setNotificationsOpen: (value: boolean) => void;
  logout: () => void;
}) {
  return (
    <header className="relative z-40 border-b border-[#e0e4df] bg-white">
      <div className="mx-auto flex h-[86px] max-w-[1440px] items-center justify-between px-6 lg:px-12">
        <Link href="/home" className="flex items-center gap-3">
          <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-[#14704d]">
            <span className="h-2 w-2 rounded-full bg-[#14704d]" />
          </span>

          <span className="font-serif text-3xl font-semibold">Waypoint</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Link
            href="/home"
            className="rounded-xl px-6 py-3 font-medium hover:bg-[#eef4f0]"
          >
            Home
          </Link>

          <Link
            href="/jobs"
            className="rounded-xl px-6 py-3 font-medium hover:bg-[#eef4f0]"
          >
            Job Posting
          </Link>

          <Link
            href="/events"
            className="rounded-xl px-6 py-3 font-medium hover:bg-[#eef4f0]"
          >
            Event Scheduling
          </Link>
        </nav>

        <div className="relative flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileMenuOpen(false);
            }}
            className="relative grid h-11 w-11 place-items-center rounded-full text-2xl hover:bg-[#eef4f0]"
          >
            ♧
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#20a36b]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-48 top-16 w-80 rounded-2xl border border-[#e0e4df] bg-white p-5 shadow-xl">
              <h3 className="font-semibold">Notifications</h3>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl bg-[#eef5f1] p-3">
                  A new applicant submitted an application.
                </div>

                <div className="rounded-xl bg-[#eef5f1] p-3">
                  Your scheduled event begins tomorrow.
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setProfileMenuOpen(!profileMenuOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-3 rounded-xl p-2 hover:bg-[#eef4f0]"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#10202a] font-semibold text-white">
              JH
            </span>

            <span className="hidden text-left sm:block">
              <strong className="block">Jhansi</strong>
              <span className="text-sm text-[#68716e]">Employer</span>
            </span>

            <span>⌄</span>
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 top-16 w-64 overflow-hidden rounded-2xl border border-[#e0e4df] bg-white shadow-xl">
              <Link
                href="/profile"
                className="block border-b border-[#e7e9e5] px-6 py-5 font-medium hover:bg-[#f2f6f3]"
              >
                ♙ Profile
              </Link>

              <Link
                href="/settings"
                className="block border-b border-[#e7e9e5] px-6 py-5 font-medium hover:bg-[#f2f6f3]"
              >
                ⚙ Settings
              </Link>

              <button
                type="button"
                onClick={logout}
                className="w-full px-6 py-5 text-left font-medium text-red-600 hover:bg-red-50"
              >
                ↪ Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function SummaryCard({
  icon,
  value,
  label,
  iconClass,
}: {
  icon: string;
  value: string;
  label: string;
  iconClass: string;
}) {
  return (
    <article className="flex items-center gap-7 rounded-2xl border border-[#e1e5e1] p-7">
      <span
        className={`grid h-16 w-16 place-items-center rounded-full text-3xl ${iconClass}`}
      >
        {icon}
      </span>

      <div>
        <p className="text-4xl font-semibold">{value}</p>
        <p className="mt-1 text-lg font-medium">{label}</p>
        <p className="mt-1 text-sm text-[#727c77]">All time</p>
      </div>
    </article>
  );
}

function ProfileDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="mb-7 grid grid-cols-[130px_1fr] gap-3">
      <strong>{label}</strong>
      <span className="text-[#64706b]">{value}</span>
    </div>
  );
}

function DetailLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-4">
      <span className="text-[#68726d]">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function SocialLink({
  name,
  value,
  href,
}: {
  name: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="grid grid-cols-[100px_1fr_auto] items-center gap-3 hover:text-[#14704d]"
    >
      <strong>{name}</strong>
      <span className="truncate text-sm text-[#68726d]">{value}</span>
      <span>↗</span>
    </a>
  );
}

function Activity({
  icon,
  title,
  description,
  date,
}: {
  icon: string;
  title: string;
  description: string;
  date: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e8f2eb] text-xl text-[#14704d]">
        {icon}
      </span>

      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-[#65706b]">{description}</p>
        <p className="mt-1 text-sm text-[#818985]">{date}</p>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-semibold">{label}</span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[#d4dad5] px-4 py-3 outline-none focus:border-[#14704d]"
      />
    </label>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <section className="w-full max-w-3xl rounded-3xl bg-white p-7 shadow-2xl">
        <div className="mb-7 flex items-center justify-between">
          <h2 className="font-serif text-3xl">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#f0f2ef] text-xl"
          >
            ×
          </button>
        </div>

        {children}
      </section>
    </div>
  );
}