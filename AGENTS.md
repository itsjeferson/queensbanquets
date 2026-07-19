# AGENTS.md

## Cursor Cloud specific instructions

Queen's Banquet Events is an npm-workspaces monorepo (single product) with four parts:

- `frontend/` — React + Vite landing page and hidden `/admin` panel. Dev server on `http://localhost:5174` (`npm run dev`). Runs standalone in offline mode (localStorage) when `VITE_API_BASE_URL` is unset.
- `api/` — Express HTTP API on `http://localhost:4000` (`npm run dev:api`). Serves `/content`, `/admin/*`, `/inquiries`, `/health`.
- `backend/` — business-logic library imported by the API (not a standalone service). Optional background job: `npm run process:inquiries -w backend`.
- `database/` — PostgreSQL schema, migrations, and seed. Standard DB commands are in root `package.json` (`db:up`, `db:migrate`, `db:seed`, `db:setup`, `db:down`) and `database/README.md`.

There is no lint or test tooling in this repo (no ESLint/Prettier, no test runner, no `test`/`lint` scripts).

### Startup caveats (non-obvious)

- **`.env` must exist in each workspace that needs it.** `api/` and `frontend/` load dotenv from their own working directory (the npm scripts `cd` into the workspace), so the root `.env` alone is not enough. Copy `.env.example` into all three locations: `cp .env.example .env && cp .env api/.env && cp .env frontend/.env`. Without `api/.env` the API reports "DATABASE_URL is not configured." These files are gitignored. The API/frontend read `.env` only at process start — restart the dev server after changing env.
- **Docker has no systemd here.** Start the daemon manually before using Postgres: run `sudo dockerd` in a background/tmux session, then `npm run db:up`. The Docker daemon config (`/etc/docker/daemon.json`) uses `fuse-overlayfs` with the containerd-snapshotter feature disabled (required for Docker 29 in this VM). The `ubuntu` user is in the `docker` group, so new shells can run `docker`/`npm run db:*` without `sudo`; already-open shells may still need `sudo`.
- **`npm run db:seed` / `npm run db:setup` exit non-zero** at the `event_packages` step: no migration creates the `event_packages` table (only `database/schema.sql` does). This is a pre-existing repo inconsistency and is non-blocking — the `admin_users` and `landing_content` rows seed successfully before it fails, and no service references `event_packages`. Core flows (admin login, content, inquiries) work fine.

### Recommended bring-up order

1. `npm install` (root; installs all workspaces) — this is the update script.
2. Ensure `.env` exists in root, `api/`, and `frontend/` (see caveat above).
3. `sudo dockerd &` (if not already running), then `npm run db:up`, `npm run db:migrate`, `npm run db:seed`.
4. `npm run dev:api` (API on :4000).
5. `npm run dev` (frontend on :5174; admin at `/admin`).

Default admin credentials (from `.env.example`): `queensbanquet07@gmail.com` / `marou-admin`.
