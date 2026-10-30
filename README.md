# VSM — Vanaheim Service Management

A Next.js application for managing Vanaheim services.

## Scripts

Run scripts with `npm run <script>`. Definitions are in `package.json`.

### Application

| Script    | Purpose                                                            |
| --------- | ------------------------------------------------------------------ |
| `dev`     | Start the development server with Turbopack.                       |
| `build`   | Build the production application.                                  |
| `start`   | Serve the built production application.                            |
| `lint`    | Run ESLint.                                                        |
| `prepare` | Install Husky Git hooks; also runs during dependency installation. |

### Local database

| Script           | Purpose                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------- |
| `supabase:types` | Generate local database types in `lib/types/database.types.ts`.                         |
| `db:dump`        | Dump local data to `supabase/seed.sql`, replacing the file.                             |
| `db:reset`       | Replace the local database with migrations and configured seed data.                    |
| `db:up`          | Apply pending migrations to the local database.                                         |
| `db:diff`        | Print differences between migration history and the live local database using pg-delta. |
| `db:migration`   | Generate a migration from declarative schemas without applying it.                      |

Start Supabase with `npx supabase start`, edit `supabase/schemas/`, then generate:

```sh
npm run db:migration -- -f migration_name
```

Review the generated SQL, then apply it locally and regenerate TypeScript types:

```sh
npm run db:up
npm run supabase:types
```

Commit schemas and generated migrations together. Keep deployed migrations
unchanged; write data backfills as manual migrations.

### Remote database and configuration

These scripts target the staging or production project references defined in
`package.json`, with environment overrides in `supabase/config.toml`.

| Script                   | Purpose                                                      |
| ------------------------ | ------------------------------------------------------------ |
| `db:plan:staging`        | Preview pending staging migrations without applying them.    |
| `db:push:staging`        | Apply pending migrations to staging.                         |
| `db:plan:production`     | Preview pending production migrations without applying them. |
| `db:push:production`     | Apply pending migrations to production.                      |
| `config:diff:staging`    | Show configuration differences for staging.                  |
| `config:push:staging`    | Apply configuration changes to staging.                      |
| `config:diff:production` | Show configuration differences for production.               |
| `config:push:production` | Apply configuration changes to production.                   |

Review `db:plan:*` before `db:push:*`, and `config:diff:*` before `config:push:*`.
