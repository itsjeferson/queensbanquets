import { defaultLandingContent } from '../../../frontend/src/data/siteContent.js';
import { getPool, getPublishedLandingContent } from '@queens-banquet/backend';

export async function getContent(_request, response) {
  try {
    const pool = getPool();
    const result = await getPublishedLandingContent(pool, defaultLandingContent);

    return response.json({
      content: result.content,
      updatedAt: result.updatedAt,
      source: result.source,
    });
  } catch (error) {
    console.error('Unable to load landing content:', error.message);
    return response.status(503).json({
      message: 'Landing content is temporarily unavailable.',
    });
  }
}
