import {
  authenticateAdmin,
  changeAdminPassword,
  getAdminProfile,
  getPool,
  signAdminToken,
} from '@queens-banquet/backend';
import { adminLoginSchema, adminPasswordChangeSchema } from '../schemas/admin.schema.js';

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

export async function updateAdminPassword(request, response) {
  const parsedBody = adminPasswordChangeSchema.safeParse(request.body);

  if (!parsedBody.success) {
    const firstIssue = parsedBody.error.issues[0]?.message;
    return response.status(400).json({
      message: firstIssue ?? 'Invalid password update request.',
      issues: parsedBody.error.flatten().fieldErrors,
    });
  }

  try {
    const pool = getPool();
    const result = await changeAdminPassword(
      pool,
      request.admin.sub,
      parsedBody.data.currentPassword,
      parsedBody.data.newPassword,
    );

    if (!result.ok) {
      if (result.reason === 'invalid_current') {
        return response.status(401).json({ message: 'Current password is incorrect.' });
      }
      if (result.reason === 'same_password') {
        return response.status(400).json({ message: 'New password must be different from the current password.' });
      }
      return response.status(404).json({ message: 'Admin account not found.' });
    }

    return response.json({
      message: 'Password updated successfully.',
      admin: result.admin,
    });
  } catch (error) {
    console.error('Unable to update admin password:', error.message);
    return response.status(503).json({ message: 'Unable to update password right now.' });
  }
}
