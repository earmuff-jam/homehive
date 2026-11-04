# Project Structure

- Feature-scoped folders under `src/features/<Feature>/` with `components/`, `hooks/`, `utils.jsx`, `constants.jsx`, `Routes.jsx` as needed.
- Shared UI goes in `src/common/`; page-specific components stay in the feature folder.
- Shared app-level hooks go in `src/hooks/`; global helpers go in `src/utils/`.
- Path aliases (see `jsconfig.json`): `common/*` → `src/common/*`, `hooks/*` → `src/hooks/*`, `features/*` → `src/features/*`. Use these aliases in imports.
- API endpoints live in `src/features/Api/*Api.js` as RTK Query hooks. Do not put fetch logic in components.
- Reusable business logic shared across the app that is a hook goes in `src/hooks/`; feature-specific helpers stay in `src/features/<Feature>/utils.jsx`.
