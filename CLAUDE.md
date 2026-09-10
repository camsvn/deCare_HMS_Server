# HMSServer — working notes for Claude

Express + TypeScript 4.3 + Sequelize 5 (SQL Server via tedious) API for the DeCare HMS mobile
app (`../HMSFlutter`). Node 24 locally.

## Commands

```bash
npm run dev     # tsc watch + nodemon on port 4041 (the developer's process — do not kill it)
npm run build   # tsc; must be clean before every commit
```

There is no test runner. `README-api.md` holds the curl sequence that acts as the regression
suite; run it against the dev server after changes.

## Rules and gotchas

- The Sequelize connection is created with `query: { raw: true }`: `findOne`/`findAll` return plain
  objects keyed by attribute names (capitalised, e.g. `user.Password`, `user.ID`). Never call
  `.get()` on results.
- Async Express 4 handlers must catch their own errors: an unhandled rejection hangs the request
  (no response). Wrap awaited DB calls in try/catch and answer with `errorResponse`.
- JSend envelopes everywhere: `{status:'success', data}`, `{status:'fail', data}` (4xx),
  `{status:'error', message}` (5xx). Auth failures are 401 with `failResponse(message)`.
- Auth: `src/middlewares/auth.ts` requires a Bearer access token (`token_type: 'access'`) on
  `/api/opregister` and `/api/tomogram`; `POST /api/auth/refresh` issues a new access token from a
  refresh token (`appSecret + '_refresh'`). Access 2 h, refresh 5 days, stateless.
- Passwords are stored in plain text in the shared ERP table; changing that is out of scope.
- Do not edit `.env`; do not add npm dependencies without a decision.
- Fresh local databases need `sql/seed-local-tomogram.sql` (TomogramType/TomogramPart rows) or
  uploads fail on foreign keys.
- Deploying the auth middleware breaks the old React Native client, which never sent a token.
