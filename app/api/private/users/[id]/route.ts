import mongoose from 'mongoose';
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

const toItem = (user: {
  _id: unknown;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email: string;
  phone?: string | null;
  roleType: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}) => ({
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
});

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await requireSessionUser(request);
  if (!session) return NextResponse.json({ ok: false, message: 'unauthorized' }, { status: 401 });
  if (!isAdmin(session.roleType)) return NextResponse.json({ ok: false, message: 'forbidden' }, { status: 403 });

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, message: 'invalid id' }, { status: 400 });
  }

  await dbConnect();
  const user = await User.findById(id).lean();
  if (!user) return NextResponse.json({ ok: false, message: 'user not found' }, { status: 404 });
  return NextResponse.json({ ok: true, item: toItem(user) });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await requireSessionUser(request);
  if (!session) return NextResponse.json({ ok: false, message: 'unauthorized' }, { status: 401 });
  if (!isAdmin(session.roleType)) return NextResponse.json({ ok: false, message: 'forbidden' }, { status: 403 });

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, message: 'invalid id' }, { status: 400 });
  }

  try {
    const body = await request.json();
    await dbConnect();
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ ok: false, message: 'user not found' }, { status: 404 });

    if (typeof body.firstName === 'string') user.firstName = body.firstName.trim();
    if (typeof body.lastName === 'string') user.lastName = body.lastName.trim();
    if (typeof body.phone === 'string') user.phone = body.phone.trim();
    if (typeof body.active === 'boolean') user.active = body.active;

    if (typeof body.roleType === 'string' && isValidRole(body.roleType)) {
      user.roleType = body.roleType;
    }

    if (typeof body.email === 'string' && body.email.trim()) {
      const email = body.email.trim().toLowerCase();
      if (email !== user.email) {
        const exists = await User.findOne({ email }).lean();
        if (exists) return NextResponse.json({ ok: false, message: 'email already exists' }, { status: 409 });
        user.email = email;
      }
    }

    if (typeof body.password === 'string' && body.password.length > 0) {
      if (body.password.length < 6) {
        return NextResponse.json({ ok: false, message: 'password must be at least 6 characters long' }, { status: 400 });
      }
      user.passwordHash = await hashPassword(body.password);
    }

    user.name = fullName(user.firstName, user.lastName, user.name);
    await user.save();

    return NextResponse.json({ ok: true, item: toItem(user.toObject()) });
  } catch {
    return NextResponse.json({ ok: false, message: 'invalid payload' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await requireSessionUser(request);
  if (!session) return NextResponse.json({ ok: false, message: 'unauthorized' }, { status: 401 });
  if (!isAdmin(session.roleType)) return NextResponse.json({ ok: false, message: 'forbidden' }, { status: 403 });

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ ok: false, message: 'invalid id' }, { status: 400 });
  }
  if (id === session.id) {
    return NextResponse.json({ ok: false, message: 'cannot delete current admin user' }, { status: 400 });
  }

  await dbConnect();
  const deleted = await User.findByIdAndDelete(id).lean();
  if (!deleted) return NextResponse.json({ ok: false, message: 'user not found' }, { status: 404 });
  return NextResponse.json({ ok: true, message: 'user deleted' });
}
