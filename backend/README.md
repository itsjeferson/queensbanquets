# Queens Banquet Backend

Backend service layer prepared for future Queens Banquet business workflows.

## Structure

- `src/config` - environment and runtime configuration.
- `src/jobs` - background process entry points.
- `src/lib` - shared utilities.
- `src/services` - business logic such as inquiry normalization and notifications.

The backend is intentionally lightweight until database repositories and external notification providers are selected.
