export async function saveInquiry(pool, inquiry) {
  const result = await pool.query(
    `
      INSERT INTO event_inquiries (
        couple_name,
        email,
        phone,
        preferred_meeting_date,
        event_date,
        coordination_need,
        estimated_guests,
        notes,
        source
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING
        id,
        couple_name AS "coupleName",
        email,
        phone,
        preferred_meeting_date AS "preferredMeetingDate",
        event_date AS "eventDate",
        coordination_need AS "coordinationNeed",
        estimated_guests AS "estimatedGuests",
        notes,
        status,
        source,
        created_at AS "createdAt"
    `,
    [
      inquiry.coupleName,
      inquiry.email,
      inquiry.phone,
      inquiry.preferredMeetingDate,
      inquiry.eventDate,
      inquiry.coordinationNeed,
      inquiry.estimatedGuests,
      inquiry.notes,
      inquiry.source ?? 'website',
    ],
  );

  return result.rows[0];
}

export async function listInquiries(pool, limit = 50) {
  const result = await pool.query(
    `
      SELECT
        id,
        couple_name AS "coupleName",
        email,
        phone,
        preferred_meeting_date AS "preferredMeetingDate",
        event_date AS "eventDate",
        coordination_need AS "coordinationNeed",
        estimated_guests AS "estimatedGuests",
        notes,
        status,
        source,
        created_at AS "createdAt"
      FROM event_inquiries
      ORDER BY created_at DESC
      LIMIT $1
    `,
    [limit],
  );

  return result.rows;
}

export const inquiryRepository = {
  saveInquiry,
  listInquiries,
};
