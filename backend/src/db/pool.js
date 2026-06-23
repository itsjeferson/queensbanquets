import pg from 'pg';
import { getEnvironment } from '../config/environment.js';

let pool;

export function getPool() {
  if (pool) {
    return pool;
  }

  const { databaseUrl } = getEnvironment();

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured.');
  }

  pool = new pg.Pool({
    connectionString: databaseUrl,
    max: 10,
  });

  return pool;
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}

export async function checkDatabaseConnection() {
  const dbPool = getPool();
  const result = await dbPool.query('SELECT 1 AS ok');
  return result.rows[0]?.ok === 1;
}
