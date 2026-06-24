# Features

Each subfolder here is a **self-contained vertical slice** of the product. A
feature owns everything it needs and exposes a small public API through its
`index.ts` barrel.

## Anatomy of a feature

```
features/
└─ tutors/                  # example feature — copy this shape
   ├─ api/                  # endpoint functions built on @/lib/axios
   │  └─ tutors.api.ts
   ├─ components/           # UI used only by this feature
   ├─ hooks/                # React Query hooks + query-key factory
   │  └─ useTutors.ts
   ├─ types/                # feature-specific types
   │  └─ tutor.types.ts
   └─ index.ts              # public surface — import from here
```

Add `components/`, `pages/`, `utils/`, etc. inside a feature only when that
feature actually needs them.

## Rules of thumb

- **Import from the barrel.** Use `@/features/tutors`, not
  `@/features/tutors/hooks/useTutors`. Internals stay refactorable.
- **No cross-feature deep imports.** If feature A needs something from feature
  B, export it from B's `index.ts`. If two features share code, promote it to
  `@/components`, `@/hooks`, `@/lib`, or `@/utils`.
- **Data fetching lives in the feature.** Endpoint functions go in `api/`,
  React Query hooks (and their query-key factory) go in `hooks/`.
- **Shared, app-wide pieces live outside features** — design-system primitives
  in `@/components/ui`, the HTTP client in `@/lib`, global types in `@/types`.
