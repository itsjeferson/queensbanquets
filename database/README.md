# Queen's Banquet Events Database

PostgreSQL schema, migrations, and seed scripts for the landing page, admin panel, and meeting requests.

## Quick start

```bash
cp .env.example .env
npm install
npm run db:setup
```

This starts PostgreSQL in Docker, runs migrations, and seeds:

- default landing content
- admin user (`queensbanquet07@gmail.com` / `marou-admin` by default)
- sample coordination packages

## Manual commands

```bash
npm run db:up
npm run db:migrate
npm run db:seed
```

## Tables

| Table | Purpose |
|---|---|
| `admin_users` | Admin login accounts |
| `landing_content` | Published landing/admin content as JSON |
| `event_inquiries` | Contact and meeting request submissions |
| `event_packages` | Coordination package records |
| `schema_migrations` | Applied migration history |

## Files

- `schema.sql` - full PostgreSQL schema snapshot
- `migrations/` - ordered migration files
- `scripts/migrate.js` - migration runner
- `scripts/seed.js` - development seed data
- `seeds/sample_events.sql` - optional SQL seed reference

## Connection

Default local connection string:

```text
postgresql://queensbanquet:queensbanquet@localhost:5432/queensbanquet
```

Set `DATABASE_URL` in `.env` for the API and migration scripts.
