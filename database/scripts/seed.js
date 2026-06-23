import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import { defaultLandingContent } from '../../frontend/src/data/siteContent.js';

const databaseUrl = process.env.DATABASE_URL;
const adminEmail = process.env.ADMIN_EMAIL ?? 'queensbanquet07@gmail.com';
const adminPassword = process.env.ADMIN_PASSWORD ?? 'marou-admin';
const adminName = process.env.ADMIN_NAME ?? 'Marou Madrid';

if (!databaseUrl) {
  console.error('DATABASE_URL is required to run seeds.');
  process.exit(1);
}

const client = new pg.Client({ connectionString: databaseUrl });

async function seed() {
  await client.connect();

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const adminResult = await client.query(
    `
      INSERT INTO admin_users (email, password_hash, display_name)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO UPDATE
      SET password_hash = EXCLUDED.password_hash,
          display_name = EXCLUDED.display_name,
          updated_at = NOW()
      RETURNING id
    `,
    [adminEmail, passwordHash, adminName],
  );

  const adminId = adminResult.rows[0].id;

  await client.query(
    `
      INSERT INTO landing_content (id, content, updated_by)
      VALUES (1, $1::jsonb, $2)
      ON CONFLICT (id) DO NOTHING
    `,
    [JSON.stringify(defaultLandingContent), adminId],
  );

  await client.query(
    `
      INSERT INTO event_packages (name, tier, description, is_featured)
      SELECT 'Ivory Guidance', 'Consultation', 'Initial planning meeting, coordination checklist, and program review.', FALSE
      WHERE NOT EXISTS (SELECT 1 FROM event_packages WHERE name = 'Ivory Guidance')
    `,
  );

  await client.query(
    `
      INSERT INTO event_packages (name, tier, description, is_featured)
      SELECT 'Golden Coordination', 'Signature', 'Supplier alignment, wedding timeline, and on-the-day coordination.', TRUE
      WHERE NOT EXISTS (SELECT 1 FROM event_packages WHERE name = 'Golden Coordination')
    `,
  );

  await client.query(
    `
      INSERT INTO event_packages (name, tier, description, is_featured)
      SELECT 'Royal Full Coordination', 'Complete', 'Planning meetings, family and entourage cues, and reception program flow.', FALSE
      WHERE NOT EXISTS (SELECT 1 FROM event_packages WHERE name = 'Royal Full Coordination')
    `,
  );

  await client.end();
  console.log('Seed data applied.');
}

seed().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
