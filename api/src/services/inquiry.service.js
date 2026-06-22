export async function queueInquiry(inquiry) {
  return {
    id: crypto.randomUUID(),
    status: 'queued',
    receivedAt: new Date().toISOString(),
    ...inquiry,
  };
}
