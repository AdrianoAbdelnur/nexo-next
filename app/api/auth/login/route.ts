import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongoose';
import User from '@/src/models/User';
import { comparePassword, getTokenMaxAgeSeconds, signAuthToken } from '@/src/lib/auth';
import { getAuthCookieName } from '@/src/lib/auth-config';

export const runtime = 'nodejs';

const buildFullName = (firstName?: string | null, lastName?: string | null, legacyName?: string | null) => {
  const fullName = `${firstName || ''} ${lastName || ''}`.trim();
  if (fullName) return fullName;
  return (legacyName || '').trim();
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json({ ok: false, message: 'email and password are required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user || !user.active) {
      return NextResponse.json({ ok: false, message: 'invalid credentials' }, { status: 401 });
    }

    const passwordIsValid = await comparePassword(password, user.passwordHash);
    if (!passwordIsValid) {
      return NextResponse.json({ ok: false, message: 'invalid credentials' }, { status: 401 });
    }

    const token = signAuthToken({
      sub: String(user._id),
      email: user.email,
      roleType: user.roleType,
    });

    const response = NextResponse.json({
      ok: true,
      item: {
        user: {
          id: String(user._id),
          firstName: user.firstName,
          lastName: user.lastName,
          name: buildFullName(user.firstName, user.lastName, user.name),
          email: user.email,
          roleType: user.roleType,
          phone: user.phone ?? null,
          active: user.active,
        },
        token,
      },
    });

    response.cookies.set({
      name: getAuthCookieName(),
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: getTokenMaxAgeSeconds(),
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false, message: 'invalid request payload' }, { status: 400 });
  }
}
