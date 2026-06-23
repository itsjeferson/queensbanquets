import {
  authenticateAdmin,
  getAdminProfile,
  getPool,
  signAdminToken,
} from '@queens-banquet/backend';
import { adminLoginSchema } from '../schemas/admin.schema.js';

export async function loginAdmin(request, response) {
  const parsedCredentials = adminLoginSchema.safeParse(request.body);

  if (!parsedCredentials.success) {
    return response.status(400).json({
      message: 'Invalid admin login request.',
      issues: parsedCredentials.error.flatten().fieldErrors,
    });
  }

  try {
    const pool = getPool();
    const admin = await authenticateAdmin(
      pool,
      parsedCredentials.data.email,
      parsedCredentials.data.password,
    );

    if (!admin) {
      return response.status(401).json({ message: 'Invalid admin email or password.' });
    }

    const token = signAdminToken(admin);

    return response.json({
      message: 'Admin login successful.',
      token,
      admin,
    });
  } catch (error) {
    console.error('Admin login failed:', error.message);
    return response.status(503).json({ message: 'Unable to sign in right now.' });
  }
}

export async function getCurrentAdmin(request, response) {
  try {
    const pool = getPool();
    const admin = await getAdminProfile(pool, request.admin.sub);

    if (!admin) {
      return response.status(401).json({ message: 'Admin account not found.' });
    }

    return response.json({ admin });
  } catch (error) {
    console.error('Unable to load admin profile:', error.message);
    return response.status(503).json({ message: 'Unable to load admin profile.' });
  }
}
