# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Calendar booking system (Hexlet "AI for Developers" course project). The repo contains two artifacts:

- **`main.tsp`** — TypeSpec API specification (source of truth for the API contract)
- **`frontend/`** — React SPA that consumes the API

There is no backend implementation in this repo; the frontend talks to an external API whose base URL is configured via `VITE_API_URL`.

## Frontend commands

All commands run from the `frontend/` directory.

```bash
npm run dev      # Vite dev server (hot reload)
npm run build    # tsc + Vite production build
npm run lint     # ESLint
npm run preview  # Preview the production build locally
```

Run the production build in Docker (served by nginx on port 3000):

```bash
docker compose up --build
```

## Frontend architecture

Node.js 22 (`.tool-versions` / asdf). Stack: React 19, TypeScript, Vite, Mantine v9, TanStack Query v5, React Router v7.

Two user roles drive the route/component split:

- **Guest** — `/`, `/book/:eventTypeId`, `/book/:eventTypeId/success`
- **Admin** — `/admin/event-types`, `/admin/bookings`

Layer breakdown:

| Layer | Location | Purpose |
|---|---|---|
| Types | `src/types/api.ts` | All API types; mirrors the TypeSpec models exactly |
| API client | `src/api/client.ts` | `apiFetch<T>` base fetcher (reads `VITE_API_URL`) |
| API modules | `src/api/*.ts` | Per-resource fetch functions (`eventTypes`, `bookings`, `slots`, `admin`) |
| Hooks | `src/hooks/use*.ts` | TanStack Query hooks, one per API operation |
| Components | `src/components/{admin,guest,shared}/` | Presentational components |
| Pages | `src/pages/{admin,guest}/` | Page-level components wired to hooks |
| Layouts | `src/layouts/` | `AdminLayout`, `GuestLayout` (nav + Mantine providers) |

API errors are thrown as `ApiError` objects (`{ code, message }`); use `isApiError()` from `src/types/api.ts` to narrow the type in catch blocks.

## TypeSpec spec

`main.tsp` in the repo root defines the full REST API. Key design points:

- Admin routes are under `/admin/*` (no auth by project design).
- Guest routes: `GET /event-types`, `GET /event-types/{eventTypeId}/slots`, `POST /bookings`.
- Slots are generated over a fixed-size grid for the next 14 days; already-booked intervals are excluded. No two bookings may overlap regardless of event type.
- `granularity` query param (≥ 5, default 30) controls slot grid size in minutes.
- All datetimes are RFC 3339 UTC strings (`Timestamp` scalar). Slug IDs are lowercase URL-safe strings.

When changing the API contract, update `main.tsp` first, then keep `src/types/api.ts` in sync.

## Environment

Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL` to the backend origin before running the dev server.
