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

| Script           | Purpose                                                         |
| ---------------- | --------------------------------------------------------------- |
| `supabase:types` | Generate local database types in `lib/types/database.types.ts`. |
| `db:dump`        | Dump local data to `supabase/seed.sql`, replacing the file.     |
| `db:reset`       | Rebuild the local database from migrations and seed data.       |
| `db:diff`        | Compare the local public schema against migrations using migra. |
| `db:migration`   | Generate a migration from the local public-schema diff.         |

Pass a name when generating a migration:

```sh
npm run db:migration -- migration_name
```

### Remote database and configuration

These scripts target the staging or production project references defined in
`package.json`.

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
