# Ozelders — Frontend

Production-ready React frontend scaffold for the Ozelders (özel ders) platform.

## Tech stack

| Concern          | Choice                                   |
| ---------------- | ---------------------------------------- |
| UI library       | **React 19**                             |
| Language         | **TypeScript** (strict)                  |
| Build tool       | **Vite**                                 |
| Styling          | **Tailwind CSS v4** (CSS-first config)   |
| Routing          | **React Router DOM** (data router API)   |
| Data fetching    | **TanStack Query** (React Query)         |
| HTTP client      | **Axios** (shared instance)              |
| Lint / format    | **ESLint** (flat config) + **Prettier**  |

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Create your local env file
cp .env.example .env      # then edit the values

# 3. Start the dev server (http://localhost:5173)
npm run dev
```

## Scripts

| Script                 | Description                                       |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Start the Vite dev server with HMR.               |
| `npm run build`        | Type-check (`tsc -b`) and build for production.   |
| `npm run preview`      | Preview the production build locally.             |
| `npm run typecheck`    | Type-check without emitting.                      |
| `npm run lint`         | Lint the project with ESLint.                     |
| `npm run lint:fix`     | Lint and auto-fix.                                |
| `npm run format`       | Format `src` with Prettier.                       |
| `npm run format:check` | Verify formatting (use in CI).                    |

## Project structure

```
ozelders/
├─ public/                 # static assets served as-is
├─ src/
│  ├─ components/
│  │  ├─ layout/           # app shell (RootLayout, header, footer)
│  │  └─ ui/               # design-system primitives (Button, …)
│  ├─ config/              # env.ts — typed, validated env access
│  ├─ constants/           # app-wide constants
│  ├─ features/            # vertical slices (see features/README.md)
│  │  └─ tutors/           # example feature: api + hooks + types
│  ├─ hooks/               # shared, cross-feature hooks
│  ├─ lib/                 # third-party client setup
│  │  ├─ axios.ts          # shared HTTP client + interceptors
│  │  ├─ react-query.ts    # QueryClient + defaults
│  │  └─ token-storage.ts  # auth-token persistence seam
│  ├─ pages/               # route-level pages
│  ├─ providers/           # global context providers (AppProviders)
│  ├─ router/              # router instance + centralized paths
│  ├─ styles/              # index.css — Tailwind entry + design tokens
│  ├─ types/               # global types + normalized ApiError
│  ├─ utils/               # pure helpers (cn, formatters)
│  ├─ main.tsx             # app entry
│  └─ vite-env.d.ts        # typed import.meta.env
├─ eslint.config.js        # ESLint flat config
├─ .prettierrc.json
├─ vite.config.ts
├─ tsconfig*.json          # solution-style project references
└─ .env.example
```

## Conventions

- **Path alias:** `@/` resolves to `src/` (e.g. `import { cn } from '@/utils'`).
  Configured in both `tsconfig.app.json` and `vite.config.ts`.
- **Feature-first architecture:** business logic lives in `src/features/*`,
  each exposing a barrel `index.ts`. See [`src/features/README.md`](src/features/README.md).
- **File naming:** React components & pages use `PascalCase.tsx`; hooks use
  `useThing.ts`; everything else uses `kebab-case.ts`.
- **Data fetching:** call the shared Axios client via a feature's `api/`
  functions, and consume them through React Query hooks with a query-key
  factory. Every failed request is normalized to an `ApiError`.
- **Styling:** Tailwind v4 is configured CSS-first in `src/styles/index.css`
  via `@theme`. There is no `tailwind.config.js` — add design tokens as CSS
  variables in the `@theme` block.

## Environment variables

Only variables prefixed with `VITE_` are exposed to the client. Access them
through `@/config/env` (which validates required values at startup) rather than
reading `import.meta.env` directly.

| Variable            | Description                                  |
| ------------------- | -------------------------------------------- |
| `VITE_API_BASE_URL` | Base URL of the backend API.                 |
| `VITE_APP_NAME`     | Public application name.                      |
| `VITE_APP_ENV`      | `development` \| `staging` \| `production`.   |

## Next steps

This is the scaffold only — UI/design implementation comes next. When the
designs arrive: build pages under `src/pages`, register them in
`src/router/index.tsx`, and create one feature folder per domain area.
