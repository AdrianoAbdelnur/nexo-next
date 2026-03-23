import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/src/lib/mongoose';
import User from '@/src/models/User';
import { extractAuthToken, verifyAuthToken } from '@/src/lib/auth';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const token = extractAuthToken(request);
    if (!token) {
      return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
    }

    const payload = verifyAuthToken(token);
    if (!payload) {
      return NextResponse.json({ message: 'invalid token' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(payload.sub).select('-passwordHash').lean();
    if (!user || !user.active) {
      return NextResponse.json({ message: 'user not found' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        roleType: user.roleType,
        phone: user.phone ?? null,
        active: user.active,
      },
    });
  } catch {
    return NextResponse.json({ message: 'internal server error' }, { status: 500 });
  }
}
