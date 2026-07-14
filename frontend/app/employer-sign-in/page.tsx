"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { Field } from "../components/FormControls";
import { loginEmployer } from "../lib/api";

export default function EmployerSignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const workEmail = String(form.get("workEmail") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");

    if (!workEmail || !password) {
      setError("Enter your work email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await loginEmployer(workEmail, password);
      router.replace("/employer/jobs");
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Unable to sign in.";
      setError(
        message === "Failed to fetch"
          ? "The employer service is unavailable. Start the backend and try again."
          : message,
      );
      setIsSubmitting(false);
    }
  }

  return (
    <main className="signup-wrap account-reference-page employer-signin-page">
      <section className="signup-card account-reference-card employer-signin-card">
        <aside className="brand-panel account-reference-brand employer-signin-brand" aria-label="Waypoint employer sign-in">
          <div>
            <Link className="logo" href="/employer-sign-in">
              <span className="logo-mark" />
              <span>Waypoint</span>
            </Link>
            <p className="signin-eyebrow">WAYPOINT FOR EMPLOYERS</p>
            <h1>Welcome back to better, local-first hiring.</h1>
            <p>Review applicants, manage job postings, and keep upcoming hiring events moving forward from one focused workspace.</p>
          </div>
        </aside>

        <section className="account-form account-reference-form employer-signin-form" aria-labelledby="employer-signin-title">
          <header>
            <h2 id="employer-signin-title">Sign in to Waypoint</h2>
            <p>Access your employer workspace with your hiring contact credentials.</p>
          </header>

          <div className="role-toggle" role="tablist" aria-label="Account type">
            <button type="button">Employee</button>
            <button className="active" type="button">Employer</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="signin-fields">
              <Field label="Work email" name="workEmail" required type="email" />
              <Field label="Password" name="password" required type="password" />
            </div>

            <div className="signin-options">
              <label><input name="rememberMe" type="checkbox" /> Remember me</label>
              <span>Use the email registered to your employer account.</span>
            </div>

            {error ? <p className="form-error" role="alert">{error}</p> : null}

            <button className="primary-action create-account-submit" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Signing in..." : "Sign in as employer"}
            </button>
            <p className="signin-copy">
              New to Waypoint? <Link href="/employer-create-account">Create an employer account</Link>
            </p>
          </form>
        </section>
      </section>
    </main>
  );
}
