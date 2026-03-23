import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongoose';
import User, { userRoleTypes } from '@/src/models/User';
import { hashPassword } from '@/src/lib/auth';
import { isAdmin, requireSessionUser } from '@/src/lib/auth-server';

export const runtime = 'nodejs';

const fullName = (firstName?: string | null, lastName?: string | null, legacyName?: string | null) => {
  const value = `${firstName || ''} ${lastName || ''}`.trim();
  if (value) return value;
  return legacyName || '';
};

const isValidRole = (role: string): role is (typeof userRoleTypes)[number] => {
  return userRoleTypes.includes(role as (typeof userRoleTypes)[number]);
};

export async function GET(request: NextRequest) {
  const session = await requireSessionUser(request);
  if (!session) {
    return NextResponse.json({ ok: false, message: 'unauthorized' }, { status: 401 });
  }
  if (!isAdmin(session.roleType)) {
    return NextResponse.json({ ok: false, message: 'forbidden' }, { status: 403 });
  }

  await dbConnect();
  const users = await User.find().sort({ createdAt: -1 }).lean();

  const items = users.map((user) => ({
    id: String(user._id),
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    name: fullName(user.firstName, user.lastName, user.name),
    email: user.email,
    phone: user.phone ?? null,
    roleType: user.roleType,
    active: Boolean(user.active),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));

  return NextResponse.json({ ok: true, items });
}

export async function POST(request: NextRequest) {
  const session = await requireSessionUser(request);
  if (!session) {
    return NextResponse.json({ ok: false, message: 'unauthorized' }, { status: 401 });
  }
  if (!isAdmin(session.roleType)) {
    return NextResponse.json({ ok: false, message: 'forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
    const lastName = typeof body.lastName === 'string' ? body.lastName.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : undefined;
    const roleInput = typeof body.roleType === 'string' ? body.roleType : 'operator';
    const roleType = isValidRole(roleInput) ? roleInput : 'operator';
    const active = body.active === undefined ? true : Boolean(body.active);

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ ok: false, message: 'firstName, lastName, email and password are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ ok: false, message: 'password must be at least 6 characters long' }, { status: 400 });
    }

    await dbConnect();
    const exists = await User.findOne({ email }).lean();
    if (exists) {
      return NextResponse.json({ ok: false, message: 'email already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const created = await User.create({
      firstName,
      lastName,
      name: fullName(firstName, lastName),
      email,
      passwordHash,
      phone,
      roleType,
      active,
    });

    return NextResponse.json(
      {
        ok: true,
        item: {
          id: String(created._id),
          firstName: created.firstName,
          lastName: created.lastName,
          name: fullName(created.firstName, created.lastName, created.name),
          email: created.email,
          phone: created.phone ?? null,
          roleType: created.roleType,
          active: created.active,
          createdAt: created.createdAt,
          updatedAt: created.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ ok: false, message: 'invalid payload' }, { status: 400 });
  }
}
