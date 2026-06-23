import { inquiryRepository } from '../repositories/inquiryRepository.js';

export function normalizeInquiry(inquiry) {
  return {
    coupleName: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone || null,
    preferredMeetingDate: inquiry.meetingDate || null,
    eventDate: inquiry.eventDate || null,
    coordinationNeed: inquiry.coordinationNeed || 'Wedding coordination',
    estimatedGuests: inquiry.guests ? Number(inquiry.guests) : null,
    notes: inquiry.message || '',
    source: 'website',
  };
}

export async function createEventInquiry(inquiry, pool) {
  const normalizedInquiry = normalizeInquiry(inquiry);

  if (!pool) {
    return {
      id: crypto.randomUUID(),
      status: 'pending_database_integration',
      ...normalizedInquiry,
    };
  }

  return inquiryRepository.saveInquiry(pool, normalizedInquiry);
}

export async function listEventInquiries(pool, limit = 50) {
  if (!pool) {
    return [];
  }

  return inquiryRepository.listInquiries(pool, limit);
}
