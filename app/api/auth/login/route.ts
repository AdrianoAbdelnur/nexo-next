import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongoose';
import User from '@/src/models/User';
import { comparePassword, getTokenMaxAgeSeconds, signAuthToken } from '@/src/lib/auth';
import { getAuthCookieName } from '@/src/lib/auth-config';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json({ message: 'email and password are required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user || !user.active) {
      return NextResponse.json({ message: 'invalid credentials' }, { status: 401 });
    }

    const passwordIsValid = await comparePassword(password, user.passwordHash);
    if (!passwordIsValid) {
      return NextResponse.json({ message: 'invalid credentials' }, { status: 401 });
    }

    const token = signAuthToken({
      sub: String(user._id),
      email: user.email,
      roleType: user.roleType,
    });

    const response = NextResponse.json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        roleType: user.roleType,
        phone: user.phone ?? null,
        active: user.active,
      },
      token,
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
    return NextResponse.json({ message: 'invalid request payload' }, { status: 400 });
  }
}
