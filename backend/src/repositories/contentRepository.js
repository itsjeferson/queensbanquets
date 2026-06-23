export async function getLandingContentRecord(pool) {
  const result = await pool.query(
    `
      SELECT content, updated_at AS "updatedAt"
      FROM landing_content
      WHERE id = 1
      LIMIT 1
    `,
  );

  return result.rows[0] ?? null;
}

export async function upsertLandingContent(pool, content, adminUserId = null) {
  const result = await pool.query(
    `
      INSERT INTO landing_content (id, content, updated_by)
      VALUES (1, $1::jsonb, $2)
      ON CONFLICT (id) DO UPDATE
      SET
        content = EXCLUDED.content,
        updated_by = EXCLUDED.updated_by,
        updated_at = NOW()
      RETURNING content, updated_at AS "updatedAt"
    `,
    [JSON.stringify(content), adminUserId],
  );

  return result.rows[0];
}

export const contentRepository = {
  getLandingContentRecord,
  upsertLandingContent,
};
