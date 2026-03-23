import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongoose';
import User, { userRoleTypes } from '@/src/models/User';
import { getTokenMaxAgeSeconds, hashPassword, signAuthToken } from '@/src/lib/auth';
import { getAuthCookieName } from '@/src/lib/auth-config';

export const runtime = 'nodejs';

const isValidRole = (role: string): role is (typeof userRoleTypes)[number] => {
  return userRoleTypes.includes(role as (typeof userRoleTypes)[number]);
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : undefined;
    const roleInput = typeof body.roleType === 'string' ? body.roleType : 'operator';
    const roleType = isValidRole(roleInput) ? roleInput : 'operator';

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'name, email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'password must be at least 6 characters long' }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return NextResponse.json({ message: 'email already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      passwordHash,
      phone,
      roleType,
      active: true,
    });

    const token = signAuthToken({
      sub: String(user._id),
      email: user.email,
      roleType: user.roleType,
    });

    const response = NextResponse.json(
      {
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          roleType: user.roleType,
          phone: user.phone ?? null,
          active: user.active,
        },
        token,
      },
      { status: 201 }
    );

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
