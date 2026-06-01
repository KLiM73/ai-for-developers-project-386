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

There are no tests in this project.

## Frontend architecture

Node.js 22 (`.tool-versions` / asdf). Stack: React 19, TypeScript, Vite, Mantine v9, TanStack Query v5, React Router v7, `dayjs` (date formatting).

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

**Query vs mutation hooks:** read hooks (`useEventTypes`, `useSlots`, `useAdminBookings`, `useAdminEventTypes`) wrap `useQuery`; write hooks (`useCreateBooking`, `useCreateEventType`) wrap `useMutation` — callers call `.mutate()` / `.mutateAsync()` on the returned object. The shared `queryClient` (`src/lib/queryClient.ts`) has `staleTime: 30_000` and `retry: 1` as defaults.

**Booking flow (`BookingPage`)** is two-step: first the guest picks a `TimeSlot` from `SlotGrid`; state lifts to `selectedSlot` in the page, which then swaps `SlotGrid` out for `BookingForm`. On success the page navigates to `/book/:eventTypeId/success`.

**Error handling:** `apiFetch` throws the raw JSON body as `ApiError` on non-2xx responses. TanStack Query surfaces this on `query.error` / `mutation.error`. Use `isApiError()` from `src/types/api.ts` to narrow the type in catch blocks.

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
