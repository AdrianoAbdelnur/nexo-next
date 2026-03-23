import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthCookieName } from '@/src/lib/auth-config';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(getAuthCookieName())?.value;
  const authHeader = request.headers.get('authorization');
  const hasBearerToken = Boolean(authHeader && authHeader.toLowerCase().startsWith('bearer '));

  const isApiPrivate = pathname.startsWith('/api/private');
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAuthPage = pathname === '/login';

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isApiPrivate && !token && !hasBearerToken) {
    return NextResponse.json({ ok: false, message: 'unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/private/:path*', '/login'],
};
