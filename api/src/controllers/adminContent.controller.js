import { defaultLandingContent } from '../../../frontend/src/data/siteContent.js';
import {
  getPool,
  saveLandingContent as persistLandingContent,
} from '@queens-banquet/backend';
import { landingContentSchema } from '../schemas/content.schema.js';

export async function updateContent(request, response) {
  const parsedContent = landingContentSchema.safeParse(request.body?.content ?? request.body);

  if (!parsedContent.success) {
    return response.status(400).json({
      message: 'Invalid landing content payload.',
      issues: parsedContent.error.flatten().fieldErrors,
    });
  }

  try {
    const pool = getPool();
    const result = await persistLandingContent(pool, parsedContent.data, request.admin.sub);

    return response.json({
      message: 'Landing content saved.',
      content: result.content,
      updatedAt: result.updatedAt,
    });
  } catch (error) {
    console.error('Unable to save landing content:', error.message);
    return response.status(503).json({
      message: 'Unable to save landing content right now.',
    });
  }
}

export async function resetContent(request, response) {
  try {
    const pool = getPool();
    const result = await persistLandingContent(pool, defaultLandingContent, request.admin.sub);

    return response.json({
      message: 'Landing content reset to defaults.',
      content: result.content,
      updatedAt: result.updatedAt,
    });
  } catch (error) {
    console.error('Unable to reset landing content:', error.message);
    return response.status(503).json({
      message: 'Unable to reset landing content right now.',
    });
  }
}
