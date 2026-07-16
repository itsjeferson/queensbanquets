export async function findAdminByEmail(pool, email) {
  const result = await pool.query(
    `
      SELECT
        id,
        email,
        password_hash AS "passwordHash",
        display_name AS "displayName",
        is_active AS "isActive"
      FROM admin_users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1
    `,
    [email],
  );

  return result.rows[0] ?? null;
}

export async function findAdminById(pool, adminId) {
  const result = await pool.query(
    `
      SELECT
        id,
        email,
        display_name AS "displayName",
        is_active AS "isActive"
      FROM admin_users
      WHERE id = $1
      LIMIT 1
    `,
    [adminId],
  );

  return result.rows[0] ?? null;
}

export async function findAdminCredentialsById(pool, adminId) {
  const result = await pool.query(
    `
      SELECT
        id,
        email,
        password_hash AS "passwordHash",
        display_name AS "displayName",
        is_active AS "isActive"
      FROM admin_users
      WHERE id = $1
      LIMIT 1
    `,
    [adminId],
  );

  return result.rows[0] ?? null;
}

export async function updateAdminPasswordHash(pool, adminId, passwordHash) {
  const result = await pool.query(
    `
      UPDATE admin_users
      SET password_hash = $2,
          updated_at = NOW()
      WHERE id = $1
        AND is_active = TRUE
      RETURNING id, email, display_name AS "displayName"
    `,
    [adminId, passwordHash],
  );

  return result.rows[0] ?? null;
}

export const adminRepository = {
  findAdminByEmail,
  findAdminById,
  findAdminCredentialsById,
  updateAdminPasswordHash,
};
