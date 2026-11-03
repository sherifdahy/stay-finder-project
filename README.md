# StayFinder

A small hotel booking app built with Next.js (App Router), Redux Toolkit / RTK Query and a fake API written as Route Handlers. The API is deliberately slow and unreliable (chaos mode), and the UI has to stay correct while it happens.

## Setup

```bash
npm install
cp .env.example .env.local   # optional, defaults work as they are
npm run dev                  # http://localhost:3000
npm test                     # Jest: pricing and schema unit tests
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
| M2 Hotel page, M3 reserve errors | Done |
| M4 Checkout and countdown | Done |
| M5 My bookings and cancel UI | Done |
| M6 Error and not-found states (`error.tsx`, `global-error.tsx`, `not-found.tsx`) | Done |
| Bonuses | Done: translation (English and Arabic, with RTL) and Vercel deployment |

## Where state lives

| State | Where it lives | Why |
|---|---|---|
| Search criteria, filters, sort | URL | Refresh, Back/Forward and shared links show the same results |
| Search form fields before submit | Component state (`SearchForm`) | Edits stay local until the guest presses Search; the query always reads the URL |
| Hotels and rooms | RTK Query cache | Server data; tags keep it fresh |
| The active hold (idempotency key) | Redux slice (`bookingSlice`) | Client-only; every confirm retry must reuse the same key |
| Countdown seconds left | Component state | Derived from `holdExpiresAt` and `serverTime`, no reason to be global |
| Guest form fields | Component state | Local to the form, validated by the shared `guestSchema` |

## Decisions and assumptions

- **Price change is stored on the server.** When chaos raises a price, the new rate is saved on the room, so the quote in the 409 response is the real current price. Accepting it and retrying succeeds instead of looping.
- **The countdown follows the server clock.** Seconds left come from `holdExpiresAt`, corrected by the gap between `serverTime` and the moment the response arrived, so a refresh or a wrong device clock does not reset it.
- **Confirm retries reuse one Idempotency-Key.** A 500 on confirm may mean the booking went through and only the reply was lost, so pressing Confirm again sends the same key and the server returns the same booking. After a page refresh the key is new, but the server also returns a booking that is already confirmed.
- **One search form, sort on its own.** City, dates, adults, max price and stars sit in one sidebar form and apply together when the guest presses Search, so typing a price sends no request at all. Sort sits above the results and applies at once, because it only reorders them.
- **Back goes search by search.** A search uses `push` and a sort change uses `replace`, so the Back button returns to the previous search, not the previous sort.
- **A lost confirm reply still ends well.** If confirm fails but the booking went through, the checkout page redirects to `/bookings` with a success message as soon as the booking shows as `confirmed`.
- **The first visit shows results.** With no dates in the URL, the search page uses a default stay of one night from today (UTC), so the cards show a one-night total. The dates are written to the URL on the first search or sort change. A bare `/` link opened on another day shows that day's results. The hotel page has no default and asks for dates, so a guest never holds dates they did not pick.
- **Stars accept a list** (`stars=4,5`), so a guest can pick several star ratings.
- **"Today" is computed in UTC**, so near midnight in other time zones a check-in date can be off by one day (known limitation).
- **One schema for the form and the API.** `hotelSearchSchema` validates the search form in the browser and the query string on the server; the stay rules (not in the past, 1–14 nights) live in one refine.
- **Errors have one shape.** `store/baseApi.ts` turns every failure into `{ status, code, message, details }`, and network failures become `NETWORK_ERROR`.
- **Layout deviations:**
  - `domain/` is split into folders (`dates/`, `validations/`, `types/`, `constants/`) instead of single `dates.ts`, `schemas.ts` and `types.ts` files, so the files stay small.
  - File names are kebab-case (`hotel.api.ts`, `search-params.ts`, `use-hold-countdown.ts`).
  - UI components from shadcn/ui live in `src/shared/ui`, and general helpers (`formatMoney`, `cn`) in `src/shared/lib`.
  - Each feature has an `index.ts` that is its public API; other features may import only from it.

## AI usage

I used Claude Code for some of the tasks, not all of them. It helped me write
the HTML/JSX markup of some components, some of the server-side files (services
and route handlers), and some of the tests. After finishing each phase, I also
used it to review the code. I designed the structure and made the decisions
myself, I reviewed what it produced, and I can explain how each part works.
