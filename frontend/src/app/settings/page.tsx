"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type SettingsData = {
  emailNotifications: boolean;
  applicantNotifications: boolean;
  eventReminders: boolean;
  marketingEmails: boolean;
  profileVisibility: boolean;
  dataSharing: boolean;
  twoFactorAuthentication: boolean;
  sessionAlerts: boolean;
  theme: "Light" | "Dark" | "System";
  language: string;
  timezone: string;
};

const defaultSettings: SettingsData = {
  emailNotifications: true,
  applicantNotifications: true,
  eventReminders: true,
  marketingEmails: false,
  profileVisibility: true,
  dataSharing: false,
  twoFactorAuthentication: false,
  sessionAlerts: true,
  theme: "Light",
  language: "English",
  timezone: "Central Time (CT)",
};

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<SettingsData>(defaultSettings);

  const [draft, setDraft] =
    useState<SettingsData>(defaultSettings);

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedSettings = localStorage.getItem("waypoint-settings");

    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(
          savedSettings,
        ) as SettingsData;

        setSettings(parsedSettings);
        setDraft(parsedSettings);
      } catch {
        setSettings(defaultSettings);
        setDraft(defaultSettings);
      }
    }
  }, []);

  function saveSettings() {
    localStorage.setItem(
      "waypoint-settings",
      JSON.stringify(draft),
    );

    setSettings(draft);
    setMessage("Settings saved successfully.");

    window.setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  function resetSettings() {
    setDraft(defaultSettings);
    setMessage("Default settings restored. Click Save Changes.");

    window.setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("New password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirmation do not match.");
      return;
    }

    localStorage.setItem(
      "waypoint-password-updated",
      new Date().toISOString(),
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordModalOpen(false);
    setMessage("Password updated successfully.");

    window.setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  function downloadAccountData() {
    const profile =
      localStorage.getItem("waypoint-employer-profile") || "{}";

    const team =
      localStorage.getItem("waypoint-team-members") || "[]";

    const dashboard =
      localStorage.getItem("waypoint-dashboard") || "{}";

    const accountData = {
      profile: JSON.parse(profile),
      teamMembers: JSON.parse(team),
      dashboard: JSON.parse(dashboard),
      settings: draft,
      exportedAt: new Date().toISOString(),
    };

    const file = new Blob(
      [JSON.stringify(accountData, null, 2)],
      {
        type: "application/json",
      },
    );

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "waypoint-account-data.json";
    link.click();

    URL.revokeObjectURL(url);

    setMessage("Account data downloaded successfully.");

    window.setTimeout(() => {
      setMessage("");
    }, 2500);
  }

  function signOutAllDevices() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMessage("You have been signed out from all devices.");

    window.setTimeout(() => {
      window.location.href = "/";
    }, 1200);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-[#f4f2ec] text-[#16201e]">
      <Header
        profileMenuOpen={profileMenuOpen}
        notificationsOpen={notificationsOpen}
        setProfileMenuOpen={setProfileMenuOpen}
        setNotificationsOpen={setNotificationsOpen}
        logout={logout}
      />

      <section className="bg-[#101c22] px-6 py-14 text-white lg:px-12">
        <div className="mx-auto flex max-w-[1360px] flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h1 className="font-serif text-5xl md:text-6xl">
              Settings
            </h1>

            <p className="mt-3 text-lg text-[#d3dcda]">
              Manage your account, preferences, security, and privacy.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetSettings}
              className="rounded-xl border border-[#668078] px-5 py-3 font-semibold text-white hover:bg-[#182f29]"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={saveSettings}
              className="rounded-xl bg-[#55dd96] px-6 py-3 font-semibold text-[#0e281d] hover:bg-[#6ae4a5]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1360px] gap-6 px-6 py-10 lg:grid-cols-[270px_1fr] lg:px-10">
        <aside className="h-fit rounded-2xl border border-[#dfe4de] bg-white p-4 shadow-sm">
          <p className="px-3 pb-3 text-xs font-bold tracking-[0.16em] text-[#7a847f]">
            SETTINGS MENU
          </p>

          <a
            href="#account"
            className="block rounded-xl bg-[#e8f2eb] px-4 py-3 font-semibold text-[#176748]"
          >
            Account Information
          </a>

          <a
            href="#security"
            className="mt-2 block rounded-xl px-4 py-3 font-medium hover:bg-[#f1f5f2]"
          >
            Account & Security
          </a>

          <a
            href="#notifications"
            className="mt-2 block rounded-xl px-4 py-3 font-medium hover:bg-[#f1f5f2]"
          >
            Notification Preferences
          </a>

          <a
            href="#appearance"
            className="mt-2 block rounded-xl px-4 py-3 font-medium hover:bg-[#f1f5f2]"
          >
            Appearance & Region
          </a>

          <a
            href="#privacy"
            className="mt-2 block rounded-xl px-4 py-3 font-medium hover:bg-[#f1f5f2]"
          >
            Advanced Privacy Features
          </a>
        </aside>

        <div className="space-y-6">
          {message && (
            <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 font-medium text-green-700">
              {message}
            </div>
          )}

          <SettingsSection
            id="account"
            icon="▣"
            title="Account Information"
            description="Manage your employer account and company information."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <ReadOnlyField label="Employer name" value="Jhansi" />
              <ReadOnlyField
                label="Company name"
                value="Waypoint Hiring Solutions"
              />
              <ReadOnlyField
                label="Email address"
                value="jhansi@waypointhire.com"
              />
              <ReadOnlyField
                label="Account role"
                value="Employer / Hiring Manager"
              />
            </div>

            <div className="mt-6 flex justify-end">
              <Link
                href="/profile"
                className="rounded-xl border border-[#176748] px-5 py-3 font-semibold text-[#176748] hover:bg-[#eef6f1]"
              >
                Edit Profile Information
              </Link>
            </div>
          </SettingsSection>

          <SettingsSection
            id="security"
            icon="▧"
            title="Account & Security"
            description="Protect your account and control sign-in security."
          >
            <SettingRow
              title="Two-factor authentication"
              description="Require an additional verification step when signing in."
            >
              <Toggle
                enabled={draft.twoFactorAuthentication}
                onChange={(enabled) =>
                  setDraft({
                    ...draft,
                    twoFactorAuthentication: enabled,
                  })
                }
              />
            </SettingRow>

            <SettingRow
              title="Login and session alerts"
              description="Receive an alert when your account is accessed from a new device."
            >
              <Toggle
                enabled={draft.sessionAlerts}
                onChange={(enabled) =>
                  setDraft({
                    ...draft,
                    sessionAlerts: enabled,
                  })
                }
              />
            </SettingRow>

            <SettingRow
              title="Password"
              description="Change your employer account password."
            >
              <button
                type="button"
                onClick={() => setPasswordModalOpen(true)}
                className="rounded-xl border border-[#d3d9d4] px-4 py-2 font-semibold hover:bg-[#f2f5f3]"
              >
                Change Password
              </button>
            </SettingRow>
          </SettingsSection>

          <SettingsSection
            id="notifications"
            icon="♢"
            title="Notification Preferences"
            description="Choose which employer notifications you receive."
          >
            <SettingRow
              title="Email notifications"
              description="Receive important Waypoint updates through email."
            >
              <Toggle
                enabled={draft.emailNotifications}
                onChange={(enabled) =>
                  setDraft({
                    ...draft,
                    emailNotifications: enabled,
                  })
                }
              />
            </SettingRow>

            <SettingRow
              title="New applicant notifications"
              description="Get notified when a candidate applies for a job."
            >
              <Toggle
                enabled={draft.applicantNotifications}
                onChange={(enabled) =>
                  setDraft({
                    ...draft,
                    applicantNotifications: enabled,
                  })
                }
              />
            </SettingRow>

            <SettingRow
              title="Hiring event reminders"
              description="Receive reminders before scheduled hiring events."
            >
              <Toggle
                enabled={draft.eventReminders}
                onChange={(enabled) =>
                  setDraft({
                    ...draft,
                    eventReminders: enabled,
                  })
                }
              />
            </SettingRow>

            <SettingRow
              title="Product and marketing emails"
              description="Receive Waypoint product announcements and hiring tips."
            >
              <Toggle
                enabled={draft.marketingEmails}
                onChange={(enabled) =>
                  setDraft({
                    ...draft,
                    marketingEmails: enabled,
                  })
                }
              />
            </SettingRow>
          </SettingsSection>

          <SettingsSection
            id="appearance"
            icon="◐"
            title="Appearance & Region"
            description="Customize how Waypoint appears and displays information."
          >
            <div className="grid gap-5 md:grid-cols-3">
              <SelectField
                label="Theme"
                value={draft.theme}
                options={["Light", "Dark", "System"]}
                onChange={(value) =>
                  setDraft({
                    ...draft,
                    theme: value as SettingsData["theme"],
                  })
                }
              />

              <SelectField
                label="Language"
                value={draft.language}
                options={[
                  "English",
                  "Spanish",
                  "French",
                  "Hindi",
                ]}
                onChange={(value) =>
                  setDraft({
                    ...draft,
                    language: value,
                  })
                }
              />

              <SelectField
                label="Timezone"
                value={draft.timezone}
                options={[
                  "Eastern Time (ET)",
                  "Central Time (CT)",
                  "Mountain Time (MT)",
                  "Pacific Time (PT)",
                ]}
                onChange={(value) =>
                  setDraft({
                    ...draft,
                    timezone: value,
                  })
                }
              />
            </div>
          </SettingsSection>

          <SettingsSection
            id="privacy"
            icon="◉"
            title="Advanced Privacy Features"
            description="Control profile visibility, account data, and device access."
          >
            <SettingRow
              title="Employer profile visibility"
              description="Allow verified candidates to view your public employer profile."
            >
              <Toggle
                enabled={draft.profileVisibility}
                onChange={(enabled) =>
                  setDraft({
                    ...draft,
                    profileVisibility: enabled,
                  })
                }
              />
            </SettingRow>

            <SettingRow
              title="Data sharing controls"
              description="Allow anonymous hiring analytics to improve Waypoint services."
            >
              <Toggle
                enabled={draft.dataSharing}
                onChange={(enabled) =>
                  setDraft({
                    ...draft,
                    dataSharing: enabled,
                  })
                }
              />
            </SettingRow>

            <SettingRow
              title="Download account data"
              description="Download a copy of your employer profile, team, dashboard, and settings."
            >
              <button
                type="button"
                onClick={downloadAccountData}
                className="rounded-xl border border-[#176748] px-4 py-2 font-semibold text-[#176748] hover:bg-[#eef6f1]"
              >
                Download Data
              </button>
            </SettingRow>

            <SettingRow
              title="Review privacy information"
              description="Review how employer information is stored and used."
            >
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(true)}
                className="rounded-xl border border-[#d3d9d4] px-4 py-2 font-semibold hover:bg-[#f2f5f3]"
              >
                Review
              </button>
            </SettingRow>

            <SettingRow
              title="Sign out from all devices"
              description="End every active Waypoint session connected to this account."
            >
              <button
                type="button"
                onClick={signOutAllDevices}
                className="rounded-xl border border-red-300 px-4 py-2 font-semibold text-red-600 hover:bg-red-50"
              >
                Sign Out All
              </button>
            </SettingRow>
          </SettingsSection>
        </div>
      </div>

      {passwordModalOpen && (
        <Modal
          title="Change Password"
          onClose={() => setPasswordModalOpen(false)}
        >
          <form onSubmit={changePassword} className="space-y-5">
            <PasswordField
              label="Current password"
              value={currentPassword}
              onChange={setCurrentPassword}
            />

            <PasswordField
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
            />

            <PasswordField
              label="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPasswordModalOpen(false)}
                className="rounded-xl border border-[#d3d9d4] px-5 py-3 font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-[#176748] px-5 py-3 font-semibold text-white"
              >
                Update Password
              </button>
            </div>
          </form>
        </Modal>
      )}

      {privacyModalOpen && (
        <Modal
          title="Privacy Information"
          onClose={() => setPrivacyModalOpen(false)}
        >
          <div className="space-y-5 leading-7 text-[#5f6b66]">
            <p>
              Your employer profile information is used to manage job
              postings, hiring events, applicants, team members, and account
              preferences.
            </p>

            <p>
              Profile visibility and data-sharing preferences can be changed
              at any time from Advanced Privacy Features.
            </p>

            <p>
              Download Account Data creates a local JSON file containing the
              information currently saved in your browser.
            </p>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                className="rounded-xl bg-[#176748] px-5 py-3 font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
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
          <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-[#176748]">
            <span className="h-2 w-2 rounded-full bg-[#176748]" />
          </span>

          <span className="font-serif text-3xl font-semibold">
            Waypoint
          </span>
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
              <span className="text-sm text-[#68716e]">
                Employer
              </span>
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

function SettingsSection({
  id,
  icon,
  title,
  description,
  children,
}: {
  id: string;
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-3xl border border-[#dfe4de] bg-white p-7 shadow-sm"
    >
      <div className="mb-6 flex items-start gap-4 border-b border-[#e7eae6] pb-5">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#e8f2eb] text-xl text-[#176748]">
          {icon}
        </span>

        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-1 text-[#69736f]">{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
}

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-[#edf0ec] py-5 last:border-b-0 sm:flex-row sm:items-center">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 max-w-2xl text-sm text-[#69736f]">
          {description}
        </p>
      </div>

      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative h-7 w-14 rounded-full transition ${
        enabled ? "bg-[#176748]" : "bg-[#cbd2cd]"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
          enabled ? "left-8" : "left-1"
        }`}
      />
    </button>
  );
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-[#67716c]">
        {label}
      </p>

      <div className="rounded-xl border border-[#dce1dc] bg-[#f8f9f7] px-4 py-3">
        {value}
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block font-semibold">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[#d5dbd6] px-4 py-3 outline-none focus:border-[#176748]"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function PasswordField({
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
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[#d4dad5] px-4 py-3 outline-none focus:border-[#176748]"
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
      <section className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl">
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