import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthCookieName } from '@/src/lib/auth-config';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(getAuthCookieName())?.value;

  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/api/private') && !token) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/private/:path*'],
};
