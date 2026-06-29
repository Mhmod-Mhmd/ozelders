---
name: prefers-simple-readable-code
description: User prefers simple, readable code over clever/dense code; refactors must preserve behavior and design exactly
metadata:
  type: feedback
---

The user values simple, readable code over "smart" / clever / dense code, and when asking for cleanups insists the design and functionality stay exactly the same.

**Why:** Stated directly when asking to "review all the project then make it simple and readable code than smart and complicated one, ensure the design and functionality doesn't change at all."

**How to apply:**
- Prefer guard clauses / early returns over nested ternaries; small named helpers over inline cleverness.
- Treat behavior + design as invariants: verify with `npx tsc -b --noEmit`, `npx eslint .`, and `npx vite build` before/after. A byte-identical CSS bundle hash is good evidence the design didn't change.
- Keep diffs surgical — revert unrelated formatter churn (e.g. Prettier re-wrapping pre-existing long lines / reordering Tailwind classes) so only the intended simplifications remain.
- This repo is already clean and disciplined (feature-based, mock API layer, React Query). Refactors should be targeted, not wholesale rewrites.
