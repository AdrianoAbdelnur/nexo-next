import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongoose';
import User from '@/src/models/User';
import { extractAuthToken, verifyAuthToken } from '@/src/lib/auth';

export const runtime = 'nodejs';

const buildFullName = (firstName?: string | null, lastName?: string | null, legacyName?: string | null) => {
  const fullName = `${firstName || ''} ${lastName || ''}`.trim();
  if (fullName) return fullName;
  return (legacyName || '').trim();
};

export async function GET(request: NextRequest) {
  try {
    const token = extractAuthToken(request);
    if (!token) {
      return NextResponse.json({ ok: false, message: 'unauthorized' }, { status: 401 });
    }

    const payload = verifyAuthToken(token);
    if (!payload) {
      return NextResponse.json({ ok: false, message: 'invalid token' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(payload.sub).select('-passwordHash').lean();
    if (!user || !user.active) {
      return NextResponse.json({ ok: false, message: 'user not found' }, { status: 404 });
    }

    return NextResponse.json({
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
      },
    });
  } catch {
    return NextResponse.json({ ok: false, message: 'internal server error' }, { status: 500 });
  }
}
