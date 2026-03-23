import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { getAuthCookieName } from '@/src/lib/auth-config';

const DEFAULT_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

export type AuthTokenPayload = {
  sub: string;
  email: string;
  roleType: string;
};

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || process.env.SECRET_WORD;
  if (!secret) {
    throw new Error('Missing JWT_SECRET (or SECRET_WORD) environment variable');
  }
  return secret;
};

export const getTokenMaxAgeSeconds = () => {
  const rawValue = process.env.AUTH_TOKEN_MAX_AGE_SECONDS;
  if (!rawValue) {
    return DEFAULT_TOKEN_TTL_SECONDS;
  }
  const parsed = Number(rawValue);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TOKEN_TTL_SECONDS;
};

export const hashPassword = async (plainPassword: string) => {
  const roundsRaw = process.env.BCRYPT_SALT_ROUNDS;
  const rounds = Number(roundsRaw);
  const saltRounds = Number.isFinite(rounds) && rounds >= 8 ? rounds : 10;
  return bcrypt.hash(plainPassword, saltRounds);
};

export const comparePassword = async (plainPassword: string, passwordHash: string) => {
  return bcrypt.compare(plainPassword, passwordHash);
};

export const signAuthToken = (payload: AuthTokenPayload) => {
  const secret = getJwtSecret();
  const signOptions: jwt.SignOptions = {};
  if (process.env.JWT_EXPIRES_IN) {
    signOptions.expiresIn = process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'];
  } else {
    signOptions.expiresIn = getTokenMaxAgeSeconds();
  }
  return jwt.sign(payload, secret, signOptions);
};

export const verifyAuthToken = (token: string): AuthTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (!decoded || typeof decoded !== 'object') {
      return null;
    }

    const sub = typeof decoded.sub === 'string' ? decoded.sub : '';
    const email = typeof decoded.email === 'string' ? decoded.email : '';
    const roleType = typeof decoded.roleType === 'string' ? decoded.roleType : '';

    if (!sub || !email || !roleType) {
      return null;
    }

    return { sub, email, roleType };
  } catch {
    return null;
  }
};

export const extractAuthToken = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const [scheme, token] = authHeader.split(' ');
    if (scheme?.toLowerCase() === 'bearer' && token) {
      return token;
    }
    if (!token) {
      return authHeader;
    }
  }

  const cookieName = getAuthCookieName();
  const cookieToken = request.cookies.get(cookieName)?.value;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
};
