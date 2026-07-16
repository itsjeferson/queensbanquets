import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getEnvironment } from '../config/environment.js';
import { adminRepository } from '../repositories/adminRepository.js';

export function signAdminToken(admin) {
  const { adminJwtSecret } = getEnvironment();

  return jwt.sign(
    {
      sub: admin.id,
      email: admin.email,
      name: admin.displayName,
    },
    adminJwtSecret,
    { expiresIn: '12h' },
  );
}

export function verifyAdminToken(token) {
  const { adminJwtSecret } = getEnvironment();
  return jwt.verify(token, adminJwtSecret);
}

export async function authenticateAdmin(pool, email, password) {
  const admin = await adminRepository.findAdminByEmail(pool, email);

  if (!admin?.isActive) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);

  if (!passwordMatches) {
    return null;
  }

  return {
    id: admin.id,
    email: admin.email,
    displayName: admin.displayName,
  };
}

export async function getAdminProfile(pool, adminId) {
  const admin = await adminRepository.findAdminById(pool, adminId);

  if (!admin?.isActive) {
    return null;
  }

  return {
    id: admin.id,
    email: admin.email,
    displayName: admin.displayName,
  };
}

export async function changeAdminPassword(pool, adminId, currentPassword, newPassword) {
  const admin = await adminRepository.findAdminCredentialsById(pool, adminId);

  if (!admin?.isActive) {
    return { ok: false, reason: 'not_found' };
  }

  const currentMatches = await bcrypt.compare(currentPassword, admin.passwordHash);

  if (!currentMatches) {
    return { ok: false, reason: 'invalid_current' };
  }

  const sameAsCurrent = await bcrypt.compare(newPassword, admin.passwordHash);

  if (sameAsCurrent) {
    return { ok: false, reason: 'same_password' };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  const updated = await adminRepository.updateAdminPasswordHash(pool, adminId, passwordHash);

  if (!updated) {
    return { ok: false, reason: 'update_failed' };
  }

  return {
    ok: true,
    admin: {
      id: updated.id,
      email: updated.email,
      displayName: updated.displayName,
    },
  };
}
