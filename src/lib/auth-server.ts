import type { NextRequest } from 'next/server';
import dbConnect from '@/src/lib/mongoose';
import User from '@/src/models/User';
import { extractAuthToken, verifyAuthToken } from '@/src/lib/auth';

export type SessionUser = {
  id: string;
  email: string;
  roleType: string;
  firstName: string;
  lastName: string;
  name: string;
  active: boolean;
};

const fullName = (firstName?: string | null, lastName?: string | null, legacyName?: string | null) => {
  const value = `${firstName || ''} ${lastName || ''}`.trim();
  if (value) return value;
  return legacyName || '';
};

export async function requireSessionUser(request: NextRequest): Promise<SessionUser | null> {
  const token = extractAuthToken(request);
  if (!token) return null;

  const payload = verifyAuthToken(token);
  if (!payload?.sub) return null;

  await dbConnect();
  const user = await User.findById(payload.sub).lean();
  if (!user || !user.active) return null;

  return {
    id: String(user._id),
    email: user.email,
    roleType: user.roleType,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    name: fullName(user.firstName, user.lastName, user.name),
    active: user.active,
  };
}

export function isAdmin(roleType: string) {
  return roleType === 'admin';
}
