# AGENTS.md

## Project

Operational web panel built with Next.js + TypeScript + MongoDB for technical task coordination, vehicle-based scheduling, resource planning, live monitoring, and audit trails.
It acts as the administrative and operational source of truth for the field workflow described in `docs/Documento-de-Inicio-de-Proyecto.md`.

## Related Projects

- Mobile app (React Native / Expo): `D:\CopiaD\backUp\Proyectos App\nexoApp`
- This web panel (Next.js): `D:\CopiaD\backUp\Proyectos Web\nexo`

## How To Work

- Before touching code, first explain what is proposed, how it will be done, and where.
- Do not modify any code until the user explicitly approves the proposed plan.
- Make minimal, clear, and easy-to-verify changes.
- Do not refactor unrelated parts.
- Move in stages, prioritizing small changes.

## Rules

- Use TypeScript where applicable.
- Do not add libraries unless truly necessary.
- Do not duplicate logic.
- Do not use hacks.
- Do not leave dead code.
- Do not break existing API contracts with the mobile app.
- Always follow `docs/Guia-Visual-UI.md` when generating or refactoring any UI, page, component, empty state, or dashboard screen.
- Never commit or push directly to `main`.
- Before any commit, run `npm run build` and ensure it finishes successfully.
- Never commit if `npm run build` fails.

## Structure

- `app`: pages and route handlers (`app/api`)
- `components`: UI and layout
- `docs`: project documentation, functional analysis, and product notes
- `lib`: auth, DB, Google Maps, task/resource utilities
- `models`: Mongoose schemas
- `public`: assets

## UI System

- Use `docs/Guia-Visual-UI.md` as the visual source of truth.
- Prefer the shared palette, typography, spacing, and card rhythm from that guide.
- Keep desktop layouts operational and table-heavy where needed, but preserve clarity and breathing room.
- For mobile-facing UI, reuse the same identity with denser but still clean arrangements.

## Main Modules

1. Auth and session (`/login`, `/register`, `lib/auth.ts`, `proxy.ts`)
2. Requests and technical tasks (`/requests`, task detail, status flow, task items by vehicle)
3. Coordination and scheduling (`/coordination`, vehicle-based planning, replication tools)
4. Resources and Odoo integration (equipment lookup, snapshots, assignment)
5. Live monitoring (`/monitoring`, active tasks, GPS, photo updates, incidents)
6. Audit and history (`/audit`, change log, author/date/origin)
7. Administration (`/admin`, catalogs, users, operational configuration)

## App <-> Web Contract (Critical)

- Keep stable:
  - JWT payload (`user.id`, `user.role`)
  - task and execution states used by the mobile app
  - task item structure by vehicle
  - evidence upload payloads and metadata
  - live tracking payloads while a task is active
- If an endpoint/payload used by mobile changes, update mobile and document migration.

## Environment Variables

- `DATABASE_URL` (required)
- `SECRET_WORD` (required)
- `GOOGLE_MAPS_API_KEY` (required for routing / map features)
- `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` (frontend map)
- `MONGODB_URI` or equivalent DB connection string if the project uses a different naming convention internally

## Backend/API

- Validate inputs and roles in each handler.
- Do not leak sensitive data (passwords/tokens).
- Keep consistent responses (`ok`, `error`/`message`, `items`/`item`).

## Validation

- Review types.
- Review imports.
- Verify main flow.
- Report touched files and what to test.
- Test affected endpoints with success and error cases.

## Useful Commands

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
