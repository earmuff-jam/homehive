# Testing & Verification

- Tests use Vitest + React Testing Library (snapshot tests are common); test files are co-located `*.test.jsx` (plain JS, no TypeScript).
- After code changes, run `make start` (or the nearest available check) to confirm nothing broke.
- Do not run destructive commands (drop collections, delete docs, git push) without explicit confirmation.
- After code changes, run `make prettier-fix` to run all lint.
- Run the newly created vitest file to ensure that it passes as well.
