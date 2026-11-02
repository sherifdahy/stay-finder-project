# StayFinder

A small hotel booking app built with Next.js (App Router), Redux Toolkit / RTK Query and a fake API written as Route Handlers. The API is deliberately slow and unreliable (chaos mode), and the UI has to stay correct while it happens.

## Setup

```bash
npm install
cp .env.example .env.local   # optional, defaults work as they are
npm run dev                  # http://localhost:3000
npm test                     # pricing and schema unit tests
npm run lint
npm run build
```

Chaos mode is controlled by `.env.example` (all values are optional):

| Variable | Default | Behaviour |
|---|---|---|
| `CHAOS_ENABLED` | `true` | Master switch |
| `CHAOS_MAX_LATENCY_MS` | `1500` | Random delay of 0..N ms on every request |
| `CHAOS_ERROR_RATE` | `0.1` | Share of requests answered with 500 `INTERNAL_ERROR` (on confirm, after the booking is confirmed) |
| `CHAOS_PRICE_CHANGE_RATE` | `0.1` | Chance a hold answers 409 `PRICE_CHANGED` with a 5–15% higher total |
| `HOLD_TTL_SECONDS` | `300` | Hold lifetime |

Reviewer settings: `CHAOS_MAX_LATENCY_MS=3000 CHAOS_ERROR_RATE=0.3 CHAOS_PRICE_CHANGE_RATE=0.5 HOLD_TTL_SECONDS=60`.

## Status

| Area | Status |
|---|---|
| Fake API (all endpoints, chaos wrapper, seed data) | Done |
| Pricing (`buildQuote`) and its unit tests | Done |
| Shared Zod schemas (form and API) | Done |
| RTK Query layer (base API, typed errors, cache tags, optimistic cancel, booking slice) | Done |
| M1 Search & results | Done |
| M2 Hotel page, M3 reserve errors | Not done |
| M4 Checkout and countdown | Not done |
| M5 My bookings and cancel UI | Not done (the endpoints, optimistic mutation and tags exist) |
| Bonuses | Skipped |

## Where state lives

| State | Where it lives | Why |
|---|---|---|
| Search criteria, filters, sort | URL | Refresh, Back/Forward and shared links show the same results |
| Hotels and rooms | RTK Query cache | Server data; tags keep it fresh |
| The active hold (idempotency key) | Redux slice (`bookingSlice`) | Client-only; every confirm retry must reuse the same key |
| Countdown seconds left | Component state | Derived from `holdExpiresAt` and `serverTime`, no reason to be global |
| Guest form fields | Component state | Local to the form, validated by the shared `guestSchema` |

## Decisions and assumptions

- **Price change is stored on the server.** When chaos raises a price, the new rate is saved on the room, so the quote in the 409 response is the real current price. Accepting it and retrying succeeds instead of looping.
- **Stars accept a list** (`stars=4,5`), so a guest can pick several star ratings.
- **"Today" is computed in UTC**, so near midnight in other time zones a check-in date can be off by one day (known limitation).
- **One schema for the form and the API.** `hotelSearchSchema` validates the search form in the browser and the query string on the server; the stay rules (not in the past, 1–14 nights) live in one refine.
- **Errors have one shape.** `store/baseApi.ts` turns every failure into `{ status, code, message, details }`, and network failures become `NETWORK_ERROR`.
- **Layout deviations:** UI components from shadcn/ui live in `src/shared/ui`; the store files use kebab-case names.
