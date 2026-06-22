# Queens Banquet System Architecture

Queens Banquet is organized as a layered web system so the landing page can launch first while backend features are integrated later.

## Layers

### Frontend

- Location: `frontend/`
- Technology: React, Vite, HTML, CSS, JavaScript
- Responsibility: Marketing landing page, package presentation, gallery-style visual sections, and inquiry form UX.
- API boundary: `frontend/src/api/inquiries.js`

### API

- Location: `api/`
- Technology: Node.js, Express, Zod
- Responsibility: HTTP routes, request validation, and controller orchestration.
- Initial endpoint: `POST /inquiries`

### Backend

- Location: `backend/`
- Technology: Node.js modules
- Responsibility: Business workflows, notification orchestration, queue processing, and future repository/database adapters.

### Database

- Location: `database/`
- Technology: SQL, PostgreSQL-oriented migration scripts
- Responsibility: Inquiry persistence, package data, and future venue availability records.

## Initial Inquiry Flow

```text
Contact form
  -> frontend/src/api/inquiries.js
  -> POST /inquiries
  -> api controller and schema validation
  -> backend inquiry service
  -> database event_inquiries table
  -> notification service
```

The current frontend gracefully handles a missing API base URL, allowing the landing page to work as a static site until API deployment is ready.
