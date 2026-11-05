# Code Style

- Use functional components with hooks; no class components.
- Keep components small; extract helpers into `src/features/*` near related code.
- Prefer named exports for utilities, default exports for page-level components.
- Before adding any new package, check `package.json` — we may already have what we want.
- Avoid adding new dependencies. Justify in the response before adding one.
- Avoid async mutations in RTK Query. Prefer optimistic updates.
- Write tests with `vitest` to cover test scenarios. Attempt Test Driven Development, so we catch bugs easily.
