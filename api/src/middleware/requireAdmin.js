import { verifyAdminToken } from '@queens-banquet/backend';

export function requireAdmin(request, response, next) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Admin authentication required.' });
  }

  try {
    const token = authorization.slice('Bearer '.length);
    request.admin = verifyAdminToken(token);
    return next();
  } catch {
    return response.status(401).json({ message: 'Invalid or expired admin session.' });
  }
}
