import { contentRepository } from '../repositories/contentRepository.js';

export async function getPublishedLandingContent(pool, defaultContent) {
  const record = await contentRepository.getLandingContentRecord(pool);

  if (!record?.content) {
    return {
      content: defaultContent,
      updatedAt: null,
      source: 'default',
    };
  }

  return {
    content: mergeLandingContent(defaultContent, record.content),
    updatedAt: record.updatedAt,
    source: 'database',
  };
}

export async function saveLandingContent(pool, content, adminUserId) {
  const record = await contentRepository.upsertLandingContent(pool, content, adminUserId);

  return {
    content: record.content,
    updatedAt: record.updatedAt,
  };
}

function mergeLandingContent(defaultContent, storedContent) {
  return mergeValue(defaultContent, storedContent);
}

function mergeValue(defaultValue, storedValue) {
  if (Array.isArray(defaultValue)) {
    return Array.isArray(storedValue) ? storedValue : structuredClone(defaultValue);
  }

  if (defaultValue && typeof defaultValue === 'object') {
    return Object.fromEntries(
      Object.entries(defaultValue).map(([key, value]) => [
        key,
        mergeValue(value, storedValue?.[key]),
      ]),
    );
  }

  return storedValue ?? defaultValue;
}
