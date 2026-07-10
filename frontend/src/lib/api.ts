import type { Applicant, Stage } from "./data";
import { getToken } from "./auth";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8081";

/** Thrown on a 401 so callers can drop the session and show the login screen. */
export class UnauthorizedError extends Error {}

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = getToken();
  return {
    ...(extra ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handle<T>(res: Response): Promise<T> {
  if (res.status === 401) throw new UnauthorizedError("Session expired");
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json() as Promise<T>;
}

export interface LoginResult {
  token: string;
  username: string;
  role: string;
}

export async function login(username: string, password: string): Promise<LoginResult> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (res.status === 401) throw new UnauthorizedError("Invalid username or password");
  if (!res.ok) throw new Error(`Login failed (${res.status})`);
  return res.json();
}

export function fetchApplicants(): Promise<Applicant[]> {
  return fetch(`${API_BASE}/api/applicants`, {
    cache: "no-store",
    headers: authHeaders(),
  }).then(handle<Applicant[]>);
}

export function updateStage(id: string, stage: Stage): Promise<Applicant> {
  return fetch(`${API_BASE}/api/applicants/${id}/stage`, {
    method: "PATCH",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ stage }),
  }).then(handle<Applicant>);
}

export function scheduleCall(id: string, callTime: string): Promise<Applicant> {
  return fetch(`${API_BASE}/api/applicants/${id}/call`, {
    method: "PATCH",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ callTime }),
  }).then(handle<Applicant>);
}

/**
 * Opens the protected resume PDF. The tab is opened synchronously on the click so it isn't
 * treated as a popup, then pointed at a blob fetched with the auth header.
 */
export async function openResume(id: string): Promise<void> {
  const tab = window.open("", "_blank", "noopener,noreferrer");
  try {
    const res = await fetch(`${API_BASE}/api/applicants/${id}/resume`, {
      headers: authHeaders(),
    });
    if (res.status === 401) {
      tab?.close();
      throw new UnauthorizedError("Session expired");
    }
    if (!res.ok) {
      tab?.close();
      throw new Error("Failed to load resume");
    }
    const url = URL.createObjectURL(await res.blob());
    if (tab) tab.location.href = url;
    else window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch (err) {
    tab?.close();
    throw err;
  }
}
