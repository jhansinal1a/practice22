# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product

"Waypoint" — a recruiting / applicant-tracking web app. The built surface is the **Applicants**
screen: a filterable candidate list (status tabs + per-posting filter) and a detail panel with a
pipeline progress bar, resume, resume score, scheduled call, review, and actions (View resume,
Schedule/Reschedule call, Move to Selected). Access is gated behind a login.

## Layout

Monorepo with two independent build units:

- `frontend/` — Next.js 16 (App Router) + React 19 + Tailwind CSS v4. Runs on **:3000**.
- `backend/` — Spring Boot 4 + Spring Data JPA + Spring Security. Runs on **:8081**.
- Data lives in **PostgreSQL** in a Docker container on **:5544** (see below).

Ports are deliberately non-default: 8080 (a native service), 5432/5433 (native Postgres) were
already occupied on the original dev machine.

## Prerequisites

- **Node** (installed via `winget install OpenJS.NodeJS.LTS`) — on Windows it may only be on the
  PowerShell PATH, not the Bash PATH.
- **JDK 21** at `C:\Program Files\Java\jdk-21.0.11`. `mvn` is not installed — use the bundled
  `mvnw` wrapper, and set `JAVA_HOME` to the JDK for it to work.
- **Docker** (for PostgreSQL).

## Commands

Start PostgreSQL (first time; persists in the `waypoint_pgdata` volume across restarts):

```
docker run -d --name waypoint-postgres \
  -e POSTGRES_USER=waypoint -e POSTGRES_PASSWORD=waypoint -e POSTGRES_DB=waypoint \
  -p 5544:5432 -v waypoint_pgdata:/var/lib/postgresql/data postgres:16-alpine
```

Backend (from `backend/`, with `JAVA_HOME` set to the JDK):

```
./mvnw spring-boot:run        # run on :8081
./mvnw -q compile             # compile only
./mvnw test                   # run tests
```

Frontend (from `frontend/`):

```
npm run dev                   # dev server on :3000
npm run build                 # production build (also strict typecheck)
npm run lint                  # eslint
npx playwright test           # E2E (needs both servers running)
npx playwright test -g "login"   # run a single test by title
```

**Demo login:** `recruiter` / `waypoint123` (seeded on first backend startup).

## Architecture

**Shared contract.** The JSON shape of an applicant is the contract between the two halves.
Backend DTOs are Java records in `backend/.../model` (`Applicant`, `Review`, `Stage`); the
frontend mirrors them as TypeScript types in `frontend/src/lib/data.ts`. `Stage` labels
("Applied", "Reviewed", "Call scheduled", "Selected") are identical on both sides — the enum
serializes to those labels via `@JsonValue`/`@JsonCreator`.

**Backend layering** (`com.waypoint`):
- `web/` — REST controllers: `ApplicantController` (list/get/stage/call/resume), `AuthController`
  (`POST /api/auth/login`), `HealthController`. `ResumePdf` generates a valid PDF with no external
  dependency. `web/` speaks DTOs only.
- `service/ApplicantService` — business operations, maps entities ↔ DTOs.
- `persistence/` — JPA entities (`ApplicantEntity` with an embedded `ReviewEmbeddable`,
  `UserEntity`), Spring Data repositories, and `DataSeeder` (seeds applicants + demo user **only
  when the tables are empty**, so API edits survive restarts).
- `security/` — `SecurityConfig` (stateless, JWT), `JwtService` (jjwt), `JwtAuthFilter`.
- `model/` — the DTO records above.

**Frontend** (`frontend/src`): `app/page.tsx` is a client component holding all state (auth gate,
filters, selection, scheduling modal). `lib/api.ts` is the API client — it attaches the JWT from
`lib/auth.ts` (localStorage) to every call and throws `UnauthorizedError` on 401 to trigger
logout. Protected resources like the resume PDF are fetched as an authenticated blob and opened in
a new tab. `components/` holds the UI pieces. Theme tokens (cream/forest/gold) live in
`app/globals.css` under Tailwind v4's `@theme`.

**Auth flow.** Login returns a JWT; the frontend stores it and sends `Authorization: Bearer`.
Everything under `/api/**` is authenticated except `/api/health` and `/api/auth/login`.

## Framework-specific gotchas

- **Next.js 16** ships an `AGENTS.md` warning of breaking changes — consult
  `frontend/node_modules/next/dist/docs/` before non-trivial framework work. Tailwind v4 uses
  CSS-based config (`@theme`), not `tailwind.config.js`.
- **Spring Boot 4 / Spring Security 7**: the web starter is `spring-boot-starter-webmvc` (not
  `-web`). A `CorsConfigurationSource` bean must be `@Qualifier`'d where injected, because Spring
  MVC also registers one (`mvcHandlerMappingIntrospector`). Unauthenticated requests return 401
  (not the default 403) via a custom `authenticationEntryPoint` plus permitting the `ERROR`
  dispatch.
- The Playwright E2E test assumes both servers are already running; it does not start them.
