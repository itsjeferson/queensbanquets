# Queen's Banquet Events System Architecture

Queen's Banquet Events is organized as a layered web system with PostgreSQL-backed content, admin authentication, and meeting request capture.

## Layers

### Frontend

- Location: `frontend/`
- Technology: React, Vite
- Responsibility: Landing page, admin panel, meeting booking UX
- API clients: `frontend/src/api/content.js`, `frontend/src/api/admin.js`, `frontend/src/api/inquiries.js`

### API

- Location: `api/`
- Technology: Node.js, Express, Zod
- Responsibility: HTTP routes, validation, auth middleware
- Key endpoints:
  - `GET /health`
  - `GET /content`
  - `POST /inquiries`
  - `POST /admin/login`
  - `GET /admin/me`
  - `PUT /admin/content`
  - `POST /admin/content/reset`
  - `GET /admin/inquiries`

### Backend

- Location: `backend/`
- Technology: Node.js, PostgreSQL (`pg`), JWT, bcrypt
- Responsibility: Database access, content persistence, admin auth, inquiry storage

### Database

- Location: `database/`
- Technology: PostgreSQL 16
- Responsibility: Landing content JSON, admin users, meeting requests, package records
- Local runtime: `docker-compose.yml`

## Data Flow

```text
Landing page
  -> GET /content
  -> landing_content table

Admin save
  -> PUT /admin/content
  -> JWT auth
  -> landing_content table

Meeting form
  -> POST /inquiries
  -> event_inquiries table
```

## Local Development

```bash
cp .env.example .env
npm install
npm run db:setup
npm run dev:api
npm run dev
```

- Landing: `http://localhost:5174`
- Admin: `http://localhost:5174/admin`
- API: `http://localhost:4000`

The frontend still falls back to localStorage when the API is unavailable, so the landing page remains usable during setup.
