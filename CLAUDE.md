## Skills
Use the frontend-design skill for any UI/component work.

## Simulate API requests for all data (current + future work)

Treat this app as if a real backend exists. **Every** feature — those built now
and every improvement added later — must read and write its data through a
simulated HTTP API, never by importing from `src/data` directly inside a page or
component. The static data in `src/data` is the mock database; it is only allowed
to be touched by the mock API layer.

The flow for any data, without exception, is:

`component → React Query hook → feature api/*.api.ts → httpClient (axios) → mock backend → src/data`

Rules:

1. **No direct data imports in UI.** Pages/components must not `import { TUTORS }`
   (or any `src/data` export). They consume a React Query hook instead. When you
   touch an existing page that still imports `src/data` directly, migrate it to a
   hook as part of the change.
2. **One typed `api/` module per feature** (e.g. `features/tutors/api/tutors.api.ts`).
   Functions call `httpClient` (`src/lib/axios.ts`) with realistic REST shapes:
   `GET /tutors`, `GET /tutors/:id`, `POST /bookings`, etc. Lists return the
   `Paginated<T>` envelope from `src/types/api.ts`; never invent an ad-hoc shape.
3. **One React Query hooks module per feature** with a colocated query-key factory
   (see `features/tutors/hooks/useTutors.ts`). Lists use `useQuery`; writes use
   `useMutation` and invalidate the relevant keys.
4. **The mock backend simulates a real server**, going through `httpClient` so
   that auth headers, the `ApiError` normalization, retries, and pagination all
   exercise the real path. It must be realistic:
   - artificial latency (~200–600ms) on every request,
   - server-side filtering, sorting, search and pagination (don't return
     everything and filter on the client),
   - correct error responses (404 for a missing id, 401 when unauthenticated,
     422 with field errors for invalid input) surfaced as `ApiError`.
   Implement it as an axios mock adapter / interceptor on `httpClient`, or MSW —
   keep all mocking in one place (e.g. `src/lib/mock/`) and keep components
   unaware that the backend is fake.
5. **Design endpoints as if shipping to production.** Realistic request/response
   types, status codes, and pagination — so swapping the mock for a real API is
   just deleting the mock layer, with zero changes to components or hooks.
6. **Loading & error states are mandatory.** Because every screen now waits on a
   request, render the hook's `isLoading` / `isError` states (skeletons or
   spinners + a retry affordance), never assume data is present synchronously.

## Fully responsive design (mobile → md → lg → xl)

Every screen, component, and future improvement must be **fully web responsive**
and look intentional at all sizes — never desktop-only with a broken phone view.
Design and verify each layout at these Tailwind breakpoints:

| Token   | Min width | Target devices                          |
| ------- | --------- | --------------------------------------- |
| (base)  | 0px       | Mobile portrait (design here first)     |
| `sm`    | 640px     | Large phones / small tablets portrait   |
| `md`    | 768px     | Tablets                                 |
| `lg`    | 1024px    | Small laptops / desktop                 |
| `xl`    | 1280px    | Large desktop                           |
| `2xl`   | 1536px    | Wide desktop (optional polish)          |

Rules:

1. **Mobile-first.** Write base (unprefixed) classes for the smallest screen,
   then layer `sm:` / `md:` / `lg:` / `xl:` overrides upward. Never start from a
   desktop layout and try to claw it back down.
2. **No horizontal scroll / overflow at any width.** Use fluid widths, `min-w-0`,
   `flex-wrap`, `truncate`, and responsive `grid-cols-*` so content reflows. Test
   down to 320px wide.
3. **Reflow multi-column layouts.** Grids/flex rows that sit side-by-side on `lg`
   must stack on mobile (e.g. `grid-cols-1 lg:grid-cols-[1fr_320px]`). Right rails
   and sidebars collapse or move below content on small screens.
4. **Navigation adapts.** Full nav on `md`+; a hamburger / drawer and a usable
   dropdown on mobile (the patterns already in `StudentNavbar`). Menus and popovers
   must stay within the viewport on small screens.
5. **Responsive type & spacing.** Scale headings and padding with breakpoints
   (e.g. `text-2xl sm:text-3xl`, `px-4 lg:px-8`); keep tap targets ≥ 44px on touch.
6. **Use the shared `Container`** for page gutters rather than hard-coded widths,
   and prefer `max-w-*` + `mx-auto` over fixed pixel widths.
7. **Verify at every breakpoint** (mobile, `md`, `lg`, `xl`) before considering UI
   work done — no overlap, clipping, overflow, or cramped/blown-up spacing.

## Internationalization (i18n) — multi-language from day one

The app is multilingual. Build every feature so a new language is **only a
translation file**, never a code change. Ship with these locales, in this order:

| Code | Language | Direction | Default |
| ---- | -------- | --------- | ------- |
| `en` | English  | LTR       | ✅ yes  |
| `tr` | Turkish  | LTR       |         |
| `ar` | Arabic   | **RTL**   |         |

Rules:

1. **No hard-coded user-facing strings.** Every visible string (labels, buttons,
   placeholders, `aria-label`s, toasts, errors, empty states) comes from a
   translation lookup — e.g. `t('tutors.bookTrial')`. Reviews should reject any
   literal copy in JSX.
2. **Namespaced translation files per locale.** Keep messages under
   `src/i18n/locales/<lang>/<namespace>.json` (e.g. `en/common.json`,
   `en/tutors.json`). Every key must exist in `en`, `tr`, and `ar`; `en` is the
   source of truth and the fallback locale for missing keys.
3. **One i18n setup module** (`src/i18n/`) that configures the library
   (use `react-i18next` + `i18next`), registers locales, sets `en` as fallback,
   and exposes the active locale + a `setLocale` helper. Resolve the initial
   locale from a stored preference → browser language → `en`, and persist the
   user's choice (localStorage).
4. **RTL is first-class (for Arabic).** On locale change, set `dir="rtl"` /
   `dir="ltr"` and `lang` on `<html>`. Use logical Tailwind utilities
   (`ms-*`/`me-*`/`ps-*`/`pe-*`, `text-start`/`text-end`, `start-*`/`end-*`)
   instead of physical `ml/mr/left/right` so layouts mirror automatically. Verify
   every screen in Arabic, not just `en`/`tr`.
5. **Localize data, not just chrome.** Format numbers, currency, and dates with
   `Intl` APIs bound to the active locale (e.g. `Intl.NumberFormat(locale, …)`);
   don't hard-code `tr-TR`. Use i18n pluralization for counts (`{{count}} reviews`)
   rather than manual `=== 1 ? 'review' : 'reviews'`.
6. **A language switcher** in the header lets users pick en / tr / ar; the choice
   updates strings, direction, and persists across reloads.
7. **Adding a language later = drop-in.** A new locale must require only a new
   `locales/<lang>/` folder and one registry entry — no edits to feature code.
   Keep keys generic and locale-agnostic so this stays true.

## Authentication & Authorization

1. Use a **JWT access token + refresh token** architecture.
2. Access tokens are stored **in memory** (never persisted to disk).
3. Refresh tokens are stored in **HttpOnly cookies** (set by the backend).
4. **Never** store JWTs in `localStorage` or `sessionStorage`.
5. Authentication state is managed through **React Query** (e.g. a `useAuth` /
   `useSession` query as the single source of truth).
6. **Protected routes use role-based guards** — a guard component/loader checks
   the session and role before rendering, and redirects otherwise.
7. Roles: `student`, `tutor`, `admin`.
8. Every API request **automatically attaches the auth header** (extend the
   `httpClient` request interceptor in `src/lib/axios.ts`).
9. A `401`/unauthorized response **triggers the refresh flow**, then transparently
   retries the original request once.
10. A **failed refresh logs out and redirects to login**, clearing in-memory state.

## Roles & Permissions

User roles: `student`, `tutor`, `admin`.

Route groups (each guarded by the matching role):

- `/student/*`
- `/tutor/*`
- `/admin/*`

Rules:

1. Users may only access resources permitted by their role.
2. Unauthorized access must redirect appropriately (e.g. to login or a
   role-appropriate home), never render the protected content.
3. Hide UI a role can't use, but **always enforce on the route guard too** —
   hiding alone is not authorization.

## Feature-based architecture

**Everything belongs to a feature** under `src/features/<feature>/`
(`api/`, `hooks/`, `components/`, `types/`, `utils/`).

Avoid dumping feature logic into:

- `components/` — only truly shared, generic UI primitives live here.
- `pages/` — pages compose features; they hold no business logic or data access.
- `app/` — wiring/providers only.

If a piece of logic is about a domain concept (tutors, bookings, auth, …), it
goes in that feature, not in a shared bucket.

## Forms

Use **React Hook Form** + **Zod** for every form.

Rules:

1. Every form is validated by a **Zod schema** (`zodResolver`); no ad-hoc
   validation.
2. Validation schemas/types are **shared with the API contract** — derive field
   types from the Zod schema (`z.infer`) so the form and the request payload can't
   drift.
3. **Display field-level errors** inline from React Hook Form state.
4. **Display server validation errors** — map the API's `422` `fieldErrors`
   (`ApiError.fieldErrors`, see `src/types/api.ts`) back onto the matching form
   fields via `setError`.
