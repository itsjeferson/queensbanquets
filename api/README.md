# Queens Banquet API

HTTP API layer prepared for future website integration.

## Current Endpoint

- `GET /health` - service health check.
- `POST /inquiries` - validates and accepts website inquiry payloads.

## Structure

- `src/routes` - Express route definitions.
- `src/controllers` - request and response orchestration.
- `src/schemas` - request validation with Zod.
- `src/services` - API-level service adapters.
