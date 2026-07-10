"use client";

import { useState } from "react";
import { login, UnauthorizedError } from "@/lib/api";
import { setAuth } from "@/lib/auth";

export function LoginForm({ onSuccess }: { onSuccess: (username: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await login(username, password);
      setAuth(result.token, result.username);
      onSuccess(result.username);
    } catch (err) {
      setError(
        err instanceof UnauthorizedError
          ? "Invalid username or password."
          : "Couldn't reach the Waypoint API. Is the backend running on :8081?",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-xl border border-line bg-surface p-8 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <span className="grid h-5 w-5 place-items-center rounded-full border-2 border-forest">
            <span className="h-1.5 w-1.5 rounded-full bg-forest" />
          </span>
          <span className="font-serif text-lg font-semibold text-ink">Waypoint</span>
        </div>
        <h1 className="mt-6 font-serif text-2xl text-ink">Sign in</h1>
        <p className="mt-1 text-sm text-muted">Access your hiring pipeline</p>

        <label
          htmlFor="username"
          className="mt-6 block text-[11px] font-medium uppercase tracking-wide text-faint"
        >
          Username
        </label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
        />

        <label
          htmlFor="password"
          className="mt-4 block text-[11px] font-medium uppercase tracking-wide text-faint"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="mt-2 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
        />

        {error && <p className="mt-4 text-sm text-gold">{error}</p>}

        <button
          type="submit"
          disabled={!username || !password || busy}
          className="mt-6 w-full rounded-md bg-forest px-4 py-2 text-sm font-medium text-white transition hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <p className="mt-4 text-center text-xs text-faint">
          Demo login — recruiter / waypoint123
        </p>
      </form>
    </div>
  );
}
