export async function sendInquiryNotification(inquiry, notifier) {
  const subject = `New Queens Banquet inquiry from ${inquiry.coupleName}`;
  const body = [
    `Email: ${inquiry.email}`,
    `Event date: ${inquiry.eventDate ?? 'Not provided'}`,
    `Estimated guests: ${inquiry.estimatedGuests ?? 'Not provided'}`,
    `Notes: ${inquiry.notes || 'No notes provided'}`,
  ].join('\n');

  if (!notifier?.send) {
    return {
      delivered: false,
      reason: 'notification_provider_not_configured',
      subject,
      body,
    };
  }

  return notifier.send({ subject, body });
}
