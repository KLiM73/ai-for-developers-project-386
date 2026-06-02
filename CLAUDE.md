# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Calendar booking system (Hexlet "AI for Developers" course project). The repo contains three artifacts:

- **`main.tsp`** — TypeSpec API specification (source of truth for the API contract)
- **`frontend/`** — React SPA that consumes the API
- **`backend/`** — Rails 8.1 API-only app (the actual backend implementation)

`docker-compose.yml` wires them together: frontend on port 3000, backend on port 3001.

## Backend commands

All commands run from the `backend/` directory. Ruby 3.4.2 (`.ruby-version` / rbenv or asdf).

```bash
bin/setup               # install gems, prepare DB, start server
bin/rails server -p 3001  # start dev server on port 3001 (matches frontend VITE_API_URL default)
bin/rails db:prepare    # create + migrate DB
bin/rails db:reset      # drop, recreate, and seed
bin/ci                  # full CI: setup, rubocop, bundler-audit, brakeman
bin/rubocop             # Ruby style checks
bin/brakeman            # static security analysis
```

There are no automated tests — CI only covers style and security static analysis.

## Backend architecture

Rails 8.1 API-only, SQLite (via solid_cache + solid_queue for background jobs). CORS is enabled via `rack-cors`.

**Models:** `EventType` (string PK = user-provided slug, validated with `SLUG_PATTERN`) and `Booking` (string PK = UUID auto-generated in `before_create`). `Booking` denormalizes `event_type_name` at creation time so it survives event type renames/deletes. The `Booking.overlapping` scope enforces the no-overlap invariant globally across all event types.

**Slot generation:** `SlotGeneratorService` (`app/services/`) computes available slots over a 14-day window. It loads all existing bookings for the window once, then filters candidates using an in-memory overlap check. `granularity` controls the grid step (≥ 5 min, default 30).

**Admin bookings** (`GET /admin/bookings`) accepts an optional `from` query param (RFC 3339); defaults to `Time.now.utc` when omitted or unparseable.

**Error responses** use a consistent `{ code, message }` JSON shape. `ApplicationController` rescues `RecordNotFound` → 404 and `RecordNotUnique` → 409.

**Serialization** is done inline in `ApplicationController` private helpers (`serialize_event_type`, `serialize_booking`) — no dedicated serializer layer.

## Frontend commands

All commands run from the `frontend/` directory.

```bash
npm run dev      # Vite dev server (hot reload)
npm run build    # tsc + Vite production build
npm run lint     # ESLint
npm run preview  # Preview the production build locally
```

Run the full stack in Docker (frontend on 3000, backend on 3001):

```bash
docker compose up --build
```

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

When changing the API contract, update `main.tsp` first, then keep `src/types/api.ts` and the Rails controllers in sync.

## E2E tests

Playwright tests live in `e2e/`. They spin up both servers automatically (Rails on 3001 in test env, Vite on 3000) and reset the database via `db:seed:replant` between test suites.

All commands run from the `e2e/` directory. Install deps first: `npm install`.

```bash
npm test            # run all tests headlessly
npm run test:ui     # Playwright UI mode (interactive)
npm run test:debug  # debug mode with Playwright inspector
```

The test database (`backend/storage/test.sqlite3`) is seeded with three event types (`intro-call-15min`, `one-on-one-30min`, `deep-dive-60min`) and two bookings. `global-setup.ts` recreates it from scratch before the suite; `resetDb()` calls `db:seed:replant` inside test files to reset between describe blocks without dropping the file (which would break the running Rails connection).

Tests use a Page Object pattern — page objects live in `e2e/pages/` and wrap Playwright locators for each page.

## Environment

Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL` to the backend origin before running the dev server. When running via `docker compose`, `VITE_API_URL` is baked into the build as `http://localhost:3001`.
