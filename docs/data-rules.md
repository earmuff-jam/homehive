# Firestore / Data Rules

- Security rules must stay in `firestore.rules`; never rely on client-side checks for authorization.
- Read user data via RTK Query hooks (generated `useXxxQuery`/`useXxxMutation`), not ad-hoc firebase calls inside components.
