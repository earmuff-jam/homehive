# Tech Stack (fixed)

- React 19 + Vite 8. Do not suggest upgrades or alternative frameworks.
- Data fetching: RTK Query. Do not introduce redux/zustand for server state.
- Styling: MUI V7. Prefer less css; simple the better; follow minimalist design standard.
- Tables: `material-react-table` (already a dependency). Use it where a table is needed.
- Immutable state updates: `immer` (already a dependency). Use `produce` where applicable.
- Backend: Firebase (Firestore + Auth). Do not introduce a separate REST backend or ORM.
- Language: JavaScript (.jsx files). Match the language of the file you are editing.
