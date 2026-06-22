# Queens Banquet Database

This directory prepares the data layer for future integration. The SQL is written to be portable for PostgreSQL-oriented deployments.

## Contents

- `schema.sql` - current target schema snapshot.
- `migrations/001_create_inquiries.sql` - starter migration for inquiry capture.
- `seeds/sample_events.sql` - optional sample package/event records for local development.

## Future Tables

- `event_inquiries` - contact form submissions and booking requests.
- `event_packages` - package cards such as Ivory Promise, Golden Vow, and Royal Banquet.
- `gallery_items` - image or media records for the website portfolio.
- `venue_availability` - optional calendar availability for booking flows.
