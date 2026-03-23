import { NextResponse } from 'next/server';
import { getAuthCookieName } from '@/src/lib/auth-config';

export const runtime = 'nodejs';

export async function POST() {
  const response = NextResponse.json({ ok: true, message: 'logged out' });
  response.cookies.set({
    name: getAuthCookieName(),
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
