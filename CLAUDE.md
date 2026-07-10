# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository is at the scaffolding stage. As of the initial commit it contains only an
empty `README.md` and an empty `src/` directory — there is no application code, build config,
or dependency manifest yet. The stack and conventions below come from the project's design
spec, not from code discovered in the repo. Treat them as the intended target; verify against
actual files as they land, and update this document as the codebase materializes.

## Product

"Waypoint" — a recruiting / applicant-tracking web app. Core surfaces from the design mockup:
- **Applicants** list with per-posting filtering and status tabs (Applied, Reviewed, Call
  scheduled, Selected), plus a candidate detail panel (resume, resume score, review notes,
  pipeline stage, schedule/reschedule call, advance stage).
- Top-level navigation: Home, Job Posting, Event Scheduling, Profile.

## Intended stack

- **Frontend:** React + Next.js, styled with Tailwind CSS.
- **Backend:** Java + Spring Boot (REST API).
- **Databases:** PostgreSQL (primary relational) and MongoDB Atlas.
- **Auth:** JWT-based authorization.
- **Monitoring:** Splunk.
- **Testing:** Playwright for browser/E2E tests; Postman for API/integration testing.

## Architecture notes (target)

- Two-tier split: a Next.js frontend calling a Spring Boot API over REST. Keep the frontend and
  backend as separate build units (likely separate top-level folders once scaffolded).
- The dual database choice implies a boundary: relational, transactional data (users, postings,
  applications, pipeline state) in PostgreSQL; less-structured or high-volume data (e.g. resume
  documents, activity logs) in MongoDB Atlas. Confirm and document the actual split when models
  are defined.
- Auth flows through JWTs issued by the Spring Boot backend and verified on protected routes.

## Commands

None exist yet — there is no `package.json`, `pom.xml`/`build.gradle`, or test runner in the
repo. Once the frontend and backend are scaffolded, record the real build / lint / test / run
commands here (including how to run a single test), replacing this note.
